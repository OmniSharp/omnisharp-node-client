import {OmniSharp} from "../omnisharp-server";
import {IDriver, IDriverOptions, ILogger} from "../interfaces";
import {defaults} from "lodash";
import {DriverState} from "../enums";
import {spawn, ChildProcess} from "child_process";
import * as readline from "readline";
import {Observable, Subject, AsyncSubject, CompositeDisposable, Disposable} from "rx";
import {join} from "path";
import {omnisharpLocation} from "../omnisharp-path";

let win32 = false;
let env: any;
// Setup the new process env.
if (process.platform === "win32") {
    win32 = true;
    // ALL I have to say is WTF.
    env = { ATOM_SHELL_INTERNAL_RUN_AS_NODE: "1" };
} else {
    env = defaults({ ATOM_SHELL_INTERNAL_RUN_AS_NODE: "1" }, process.env);
}

export class StdioDriver implements IDriver {
    private _seq: number;
    private _process: ChildProcess;
    private _outstandingRequests = new Map<number, AsyncSubject<any>>();
    private _projectPath: string;
    private _serverPath: string;
    private _additionalArguments: string[];
    private _currentState: DriverState = DriverState.Disconnected;
    private _disposable = new CompositeDisposable();
    public get currentState() { return this._currentState; }
    public set currentState(value) {
        // Prevent the client from leaving the error state
        // Error means bad things, like mono is working right
        if (this._currentState !== DriverState.Error) {
            this._currentState = value;
        }
    }
    private _findProject: boolean;
    private _logger: ILogger;
    private _timeout: number;
    public id: string;

    constructor({projectPath, serverPath, findProject, logger, timeout, additionalArguments}: IDriverOptions) {
        this._projectPath = projectPath;
        this._findProject = findProject || false;
        this._serverPath = serverPath || omnisharpLocation;
        this._connectionStream.subscribe(state => this.currentState = state);
        this._logger = logger || console;
        this._timeout = (timeout || 60) * 1000;
        this._additionalArguments = additionalArguments;

        this._disposable.add(this._commandStream);
        this._disposable.add(this._eventStream);
        this._disposable.add(this._connectionStream);

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
                disposable.dispose();

                iteratee = iterator.next();
            }
        }));
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this.disconnect();
        this._disposable.dispose();
    }

    public get serverPath() { return this._serverPath; }
    public get projectPath() { return this._projectPath; }

    private _commandStream = new Subject<OmniSharp.Stdio.Protocol.ResponsePacket>();
    public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._commandStream; }

    private _eventStream = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();
    public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._eventStream; }

    private _connectionStream = new Subject<DriverState>();
    public get state(): Rx.Observable<DriverState> { return this._connectionStream; }

    public get outstandingRequests() { return this._outstandingRequests.size; }

    public connect() {
        this._seq = 1;
        this._outstandingRequests.clear();
        if (!this._connectionStream.isDisposed) { this._connectionStream.onNext(DriverState.Connecting); }

        this._logger.log(`Connecting to child @ ${process.execPath}`);
        this._logger.log(`Path to server: ${this._serverPath}`);
        this._logger.log(`Selected project: ${this._projectPath}`);

        if (win32) {
            // Spawn a special windows only node client... so that we can shutdown nicely.
            const serverArguments: any[] = [join(__dirname, "../stdio/child.js"), "--serverPath", this._serverPath, "--projectPath", this._projectPath].concat(this._additionalArguments || []);
            this._logger.log(`Arguments: ${serverArguments}`);
            this._process = spawn(process.execPath, serverArguments, { env });
        } else {
            const serverArguments: any[] = ["--stdio", "-s", this._projectPath, "--hostPID", process.pid].concat(this._additionalArguments || []);
            this._logger.log(`Arguments: ${serverArguments}`);
            this._process = spawn(this._serverPath, serverArguments, { env });
        }

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
        //rl.on("line", (data) => enqueue(() => this.handleData(data)));

        this.id = this._process.pid.toString();
        this._process.on("error", (data: any) => this.serverErr(data));
        this._process.on("close", () => this.disconnect());
        this._process.on("exit", () => this.disconnect());
        this._process.on("disconnect", () => this.disconnect());
    }

    private serverErr(data: any) {
        const friendlyMessage = this.parseError(data);
        if (!this._connectionStream.isDisposed) { this._connectionStream.onNext(DriverState.Error); }
        this._process = null;

        if (!this._eventStream.isDisposed) {
            this._eventStream.onNext({
                Type: "error",
                Event: "error",
                Seq: -1,
                Body: {
                    Message: friendlyMessage
                }
            });
        }
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
        if (!(<any>this._connectionStream).isDisposed)
            this._connectionStream.onNext(DriverState.Disconnected);
    }

    public request<TRequest, TResponse>(command: string, request?: TRequest): Rx.Observable<TResponse> {
        if (!this._process) {
            return Observable.throw<any>(new Error("Server is not connected, erroring out"));
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
        let packet: OmniSharp.Stdio.Protocol.Packet
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
            if (observer.isDisposed) return;
            if (response.Success) {
                observer.onNext(response.Body);
                observer.onCompleted();
            } else {
                observer.onError(response.Message);
            }

        } else {
            if (!this._commandStream.isDisposed && response.Success) {
                this._commandStream.onNext(response);
            } else {
                // TODO: make notification?
            }
        }
    }

    private handlePacketEvent(event: OmniSharp.Stdio.Protocol.EventPacket) {
        if (!this._eventStream.isDisposed) { this._eventStream.onNext(event); }
        if (!this._connectionStream.isDisposed && event.Event === "started") {
            this._connectionStream.onNext(DriverState.Connected);
        }
    }

    private handleNonPacket(data: any) {
        const s = data.toString();
        if (!this._eventStream.isDisposed) {
            this._eventStream.onNext({
                Type: "unknown",
                Event: "unknown",
                Seq: -1,
                Body: {
                    Message: s
                }
            });
        }

        const ref = s.match(/Detected an OmniSharp instance already running on port/);
        if ((ref != null ? ref.length : 0) > 0) {
            this.disconnect();
        }
    }
}
