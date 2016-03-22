import * as OmniSharp from "../omnisharp-server";
import {IDriver, IDriverOptions, ILogger, Runtime, IOmnisharpPlugin} from "../enums";
import {defaults, startsWith} from "lodash";
import {DriverState} from "../enums";
import cp, {ChildProcess} from "child_process";
import * as readline from "readline";
import {CompositeDisposable, Disposable} from "../disposables";
import {Observable, Subject, AsyncSubject} from "rxjs";
import {RuntimeContext, isSupportedRuntime} from "../helpers/runtime";

let spawn = cp.spawn;
if (process.platform === "win32") {
    spawn = require("../windows/super-spawn").spawn;
}

let env: any = defaults({ ATOM_SHELL_INTERNAL_RUN_AS_NODE: "1" }, process.env);

export class StdioDriver implements IDriver {
    private _seq: number;
    private _process: ChildProcess;
    private _outstandingRequests = new Map<number, AsyncSubject<any>>();
    private _projectPath: string;
    private _additionalArguments: string[];
    private _disposable = new CompositeDisposable();
    private _plugins: IOmnisharpPlugin[];
    private _serverPath: string;

    private _findProject: boolean;
    private _logger: ILogger;
    private _timeout: number;
    private _runtime: Runtime;
    private _version: string;
    private _PATH: string;
    private _runtimeContext: RuntimeContext;
    public id: string;

    private _currentState: DriverState = DriverState.Disconnected;
    public get currentState() { return this._currentState; }
    public set currentState(value) { this._currentState = value; }

    constructor({projectPath, serverPath, findProject, logger, timeout, additionalArguments, runtime, plugins, version}: IDriverOptions) {
        this._projectPath = projectPath;
        this._findProject = findProject || false;
        this._connectionStream.subscribe(state => this.currentState = state);
        this._logger = logger || console;
        this._serverPath = serverPath;
        this._timeout = (timeout || 60) * 1000;
        this._runtime = runtime || Runtime.ClrOrMono;
        this._additionalArguments = additionalArguments;
        this._plugins = plugins;
        this._version = version;

        this._runtimeContext = this._getRuntimeContext();

        this._disposable.add(Disposable.create(() => {
            if (this._process) {
                this._process.removeAllListeners();
            }
        }));

        this._disposable.add(Disposable.create(() => {
            const iterator = this._outstandingRequests.entries();
            let iteratee = iterator.next();

            while (!iteratee.done) {
                const [key, disposable] = iteratee.value;

                this._outstandingRequests.delete(key);
                disposable.unsubscribe();

                iteratee = iterator.next();
            }

            this._outstandingRequests.clear();
        }));
    }

    private _getRuntimeContext() {
        return new RuntimeContext({
            runtime: this.runtime,
            platform: process.platform,
            arch: process.arch,
            version: this._version || undefined
        }, this._logger);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this.disconnect();
        this._disposable.dispose();
    }

    public get serverPath() {
        if (this._serverPath) {
            return this._serverPath;
        }
        return this._runtimeContext.location;
    }
    public get projectPath() { return this._projectPath; }
    public get runtime() { return this._runtime; }

    private _commandStream = new Subject<OmniSharp.Stdio.Protocol.ResponsePacket>();
    public get commands(): Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return <Observable<OmniSharp.Stdio.Protocol.ResponsePacket>><any>this._commandStream; }

    private _eventStream = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();
    public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { return <Observable<OmniSharp.Stdio.Protocol.EventPacket>><any>this._eventStream; }

    private _connectionStream = new Subject<DriverState>();
    public get state(): Observable<DriverState> { return <Observable<DriverState>><any>this._connectionStream; }

    public get outstandingRequests() { return this._outstandingRequests.size; }

    public connect() {
        if (this._disposable.isDisposed)
            throw new Error("Driver is disposed");

        this._ensureRuntimeExists()
            .subscribe({ complete: () => this._connect() });
        /*
        Enable once we can push a new build again
        this._disposable.add(this._ensureBootstrapExists()
            .subscribe((path) => this._serverPath = path, null, () => this._connect()));
        */
    }

    private _connect() {
        this._seq = 1;
        this._outstandingRequests.clear();
        this._connectionStream.next(DriverState.Connecting);

        let path = this.serverPath;

        this._logger.log(`Connecting to child @ ${process.execPath}`);
        this._logger.log(`Path to server: ${path}`);
        this._logger.log(`Selected project: ${this._projectPath}`);

        env.PATH = this._PATH || env.PATH;

        const serverArguments: any[] = ["--stdio", "-s", this._projectPath, "--hostPID", process.pid].concat(this._additionalArguments || []);

        if (startsWith(path, "mono ")) {
            serverArguments.unshift(path.substr(5));
            path = "mono";
        }

        this._logger.log(`Arguments: ${serverArguments}`);
        this._process = spawn(path, serverArguments, { env });

        if (!this._process.pid) {
            this.serverErr("failed to connect to connect to server");
            return;
        }

        this._process.stderr.on("data", (data: any) => this._logger.error(data.toString()));
        this._process.stderr.on("data", (data: any) => this.serverErr(data));

        const rl = readline.createInterface({
            input: this._process.stdout,
            output: undefined
        });

        rl.on("line", (data: any) => this.handleData(data));

        this.id = this._process.pid.toString();
        this._process.on("error", (data: any) => this.serverErr(data));
        this._process.on("close", () => this.disconnect());
        this._process.on("exit", () => this.disconnect());
        this._process.on("disconnect", () => this.disconnect());
    }

    private _ensureRuntimeExists() {
        this._connectionStream.next(DriverState.Downloading);
        return Observable.fromPromise(isSupportedRuntime(this._runtimeContext)
            .do((ctx) => {
                this._runtime = ctx.runtime;
                this._PATH = ctx.path;
                this._runtimeContext = this._getRuntimeContext();
            })
            .toPromise()
            .then((runtime) =>
                this._runtimeContext.downloadRuntimeIfMissing()
                    .do({ complete: () => { this._connectionStream.next(DriverState.Downloaded); } })
                    .toPromise()
            ));
    }

    /*private _ensureBootstrapExists() {
        return this._ensureRuntimeExists()
            .flatMap(() => getPluginPath(this._projectPath, this._runtime, process, this._plugins, this._logger));
    }*/

    public updatePlugins(plugins: IOmnisharpPlugin[]) {
        this._plugins = plugins;
        this.disconnect();
        this.connect();
    }

    private serverErr(data: any) {
        const friendlyMessage = this.parseError(data);
        this._connectionStream.next(DriverState.Error);
        this._process = null;

        this._eventStream.next({
            Type: "error",
            Event: "error",
            Seq: -1,
            Body: {
                Message: friendlyMessage
            }
        });
    }

    private parseError(data: any) {
        let message = data.toString();
        if (data.code === "ENOENT" && data.path === "mono") {
            message = "mono could not be found, please ensure it is installed and in your path";
        }
        return message;
    }

    public disconnect() {
        if (this._process != null && this._process.pid) {
            this._process.kill("SIGTERM");
        }
        this._process = null;
        this._connectionStream.next(DriverState.Disconnected);
    }

    public request<TRequest, TResponse>(command: string, request?: TRequest): Observable<TResponse> {
        if (!this._process) {
            return <any>Observable.throw<any>(new Error("Server is not connected, erroring out"));
        }

        const sequence = this._seq++;
        const packet: OmniSharp.Stdio.Protocol.RequestPacket = {
            Command: command,
            Seq: sequence,
            Arguments: request
        };

        const subject = new AsyncSubject<TResponse>();
        this._outstandingRequests.set(sequence, subject);
        this._process.stdin.write(JSON.stringify(packet) + "\n", "utf8");
        return subject.timeout(this._timeout, Observable.throw<any>("Request timed out"));
    }

    private handleData(data: string) {
        let packet: OmniSharp.Stdio.Protocol.Packet;
        try {
            packet = JSON.parse(data.trim());
        } catch (_error) {
            this.handleNonPacket(data);
        }

        if (packet) {
            this.handlePacket(packet);
        }
    }

    private handlePacket(packet: OmniSharp.Stdio.Protocol.Packet) {
        if (packet.Type === "response") {
            this.handlePacketResponse(<OmniSharp.Stdio.Protocol.ResponsePacket>packet);
        } else if (packet.Type === "event") {
            this.handlePacketEvent(<OmniSharp.Stdio.Protocol.EventPacket>packet);
        }
    }

    private handlePacketResponse(response: OmniSharp.Stdio.Protocol.ResponsePacket) {
        if (this._outstandingRequests.has(response.Request_seq)) {

            const observer = this._outstandingRequests.get(response.Request_seq);
            this._outstandingRequests.delete(response.Request_seq);
            if (observer.isUnsubscribed) return;
            if (response.Success) {
                observer.next(response.Body);
                observer.complete();
            } else {
                observer.error(response.Message);
            }

        } else {
            if (response.Success) {
                this._commandStream.next(response);
            } else {
                // TODO: make notification?
            }
        }
    }

    private handlePacketEvent(event: OmniSharp.Stdio.Protocol.EventPacket) {
        this._eventStream.next(event);
        if (event.Event === "started") {
            this._connectionStream.next(DriverState.Connected);
        }
    }

    private handleNonPacket(data: any) {
        const s = data.toString();
        this._eventStream.next({
            Type: "unknown",
            Event: "unknown",
            Seq: -1,
            Body: {
                Message: s
            }
        });

        const ref = s.match(/Detected an OmniSharp instance already running on port/);
        if ((ref != null ? ref.length : 0) > 0) {
            this.disconnect();
        }
    }
}
