import {IDriver, IDriverOptions, ILogger} from "../interfaces";
import {defaults} from "lodash";
import {DriverState} from "../enums";
import {spawn, exec, ChildProcess} from "child_process";
import * as readline from "readline";
import {Observable, Observer, Subject, AsyncSubject} from "rx";
import {resolve, join} from 'path';
import {omnisharpLocation} from '../omnisharp-path';
import {findProject as projectFinder} from "../project-finder";
import {enqueue} from "../queue";

var win32 = false;
// Setup the new process env.
if (process.platform === 'win32') {
    win32 = true;
    // ALL I have to say is WTF.
    var env: any = { ATOM_SHELL_INTERNAL_RUN_AS_NODE: '1' };
} else {
    var env: any = defaults({ ATOM_SHELL_INTERNAL_RUN_AS_NODE: '1' }, process.env);
}

class StdioDriver implements IDriver {
    private _seq: number = 1;
    private _process: ChildProcess;
    private _outstandingRequests = new Map<number, AsyncSubject<any>>();
    private _projectPath: string;
    private _serverPath: string;
    private _additionalArguments: string[];
    private _currentState: DriverState = DriverState.Disconnected;
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

    constructor({projectPath, debug, serverPath, findProject, logger, timeout, additionalArguments}: IDriverOptions) {
        this._projectPath = projectPath;
        this._findProject = findProject || false;
        this._serverPath = serverPath || omnisharpLocation;
        this._connectionStream.subscribe(state => this.currentState = state);
        this._logger = logger || console;
        this._timeout = (timeout || 60) * 1000;
        this._additionalArguments = additionalArguments;
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

    public connect({projectPath, findProject, additionalArguments}: IDriverOptions) {
        projectPath = projectPath || this._projectPath;
        additionalArguments = additionalArguments || this._additionalArguments;
        if (findProject || this._findProject) {
            projectPath = projectFinder(projectPath, this._logger);
        }

        if (!projectPath) {
            var error = "Failed to determine project path for omnisharp, aborting connect()";
            this._logger.error(error);
            this.serverErr(error);
            this.disconnect();
            return;
        }

        this._connectionStream.onNext(DriverState.Connecting);

        this._logger.log(`Connecting to child @ ${process.execPath}`);
        this._logger.log(`Path to server: ${this._serverPath}`);
        this._logger.log(`Selected project: ${this._projectPath}`);

        if (win32) {
            // Spawn a special windows only node client... so that we can shutdown nicely.
            var serverArguments: any[] = [join(__dirname, "../stdio/child.js"), "--serverPath", this._serverPath, "--projectPath", projectPath].concat(additionalArguments);
            this._logger.log(`Arguments: ${serverArguments}`);
            this._process = spawn(process.execPath, serverArguments, { env });
        } else {
            var serverArguments: any[] = ["--stdio", "-s", this._projectPath, "--hostPID", process.pid].concat(additionalArguments);
            this._logger.log(`Arguments: ${serverArguments}`);
            this._process = spawn(this._serverPath, serverArguments, { env });
        }

        if (!this._process.pid) {
            this.serverErr('failed to connect to connect to server');
            return;
        }

        this._process.stderr.on('data', (data) => this._logger.error(data.toString()));
        this._process.stderr.on('data', (data) => this.serverErr(data));

        var rl = readline.createInterface({
            input: this._process.stdout,
            output: undefined
        });

        rl.on('line', (data) => this.handleData(data));
        //rl.on('line', (data) => enqueue(() => this.handleData(data)));

        this.id = this._process.pid.toString();
        this._process.on('error', (data) => this.serverErr(data));
        this._process.on('close', () => this.disconnect());
        this._process.on('exit', () => this.disconnect());
        this._process.on('disconnect', () => this.disconnect());
    }

    private serverErr(data) {
        var friendlyMessage = this.parseError(data);
        this._connectionStream.onNext(DriverState.Error);
        this._process = null;

        this._eventStream.onNext({
            Type: "error",
            Event: "error",
            Seq: -1,
            Body: {
                Message: friendlyMessage
            }
        });
    }

    private parseError(data) {
        var message = data.toString();
        if (data.code === 'ENOENT' && data.path === 'mono') {
            message = 'mono could not be found, please ensure it is installed and in your path';
        }
        return message;
    }

    public disconnect() {
        if (this._process != null && this._process.pid) {
            this._process.kill("SIGTERM");
        }
        this._process = null;
        this._connectionStream.onNext(DriverState.Disconnected);
    }

    public request<TRequest, TResponse>(command: string, request?: TRequest): Rx.Observable<TResponse> {
        if (!this._process) {
            return Observable.throwError<any>(new Error("Server is not connected, erroring out"));
        }
        var sequence = this._seq++;
        var packet: OmniSharp.Stdio.Protocol.RequestPacket = {
            Command: command,
            Seq: sequence,
            Arguments: request
        };

        var subject = new AsyncSubject<TResponse>();
        this._outstandingRequests.set(sequence, subject);
        this._process.stdin.write(JSON.stringify(packet) + '\n', 'utf8');
        return subject.timeout(this._timeout, Observable.just(<any>'Request timed out'));
    }

    private handleData(data: string) {
        try {
            var packet: OmniSharp.Stdio.Protocol.Packet = JSON.parse(data.trim());
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

            var observer = this._outstandingRequests.get(response.Request_seq);
            this._outstandingRequests.delete(response.Request_seq);
            if (response.Success) {
                observer.onNext(response.Body);
            } else {
                observer.onError(response.Message);
            }
            observer.onCompleted();

        } else {
            if (response.Success) {
                this._commandStream.onNext(response);
            } else {
                // TODO: make notification?
            }
        }
    }

    private handlePacketEvent(event: OmniSharp.Stdio.Protocol.EventPacket) {
        this._eventStream.onNext(event);
        if (event.Event === "started") {
            this._connectionStream.onNext(DriverState.Connected);
        }
    }

    private handleNonPacket(data: any) {
        var s = data.toString();
        this._eventStream.onNext({
            Type: "unknown",
            Event: "unknown",
            Seq: -1,
            Body: {
                Message: s
            }
        });

        var ref = s.match(/Detected an OmniSharp instance already running on port/);
        if ((ref != null ? ref.length : 0) > 0) {
            this.disconnect();
        }
    }
}

export = StdioDriver;
