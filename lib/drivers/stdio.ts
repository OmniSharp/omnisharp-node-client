import {IDriver, IDriverOptions} from "../drivers";
import {DriverState} from "../omnisharp-client";
import {spawn, exec, ChildProcess} from "child_process";
import * as readline from "readline";
import {Observable, Observer, Subject, AsyncSubject} from "rx";
var omnisharpReleaseLocation = require('omnisharp-server-roslyn-binaries');
// TODO: Move into omnisharp-server-roslyn-binaries?
import {resolve} from 'path';
import {findProject} from "../project-finder";

class StdioDriver implements IDriver {
    private _seq: number = 1;
    private _process: ChildProcess;
    private _outstandingRequests = new Map<number, AsyncSubject<any>>();
    private _projectPath: string;
    private _serverPath: string;
    private _currentState: DriverState = DriverState.Disconnected;
    public get currentState() { return this._currentState; }
    public set currentState(value) {
        // Prevent the client from leaving the error state
        // Error means bad things, like mono is working right
        if (this._currentState !== DriverState.Error) {
            this._currentState = value;
        }
    }
    public id: string;

    constructor({projectPath, debug, serverPath}: IDriverOptions) {
        if (projectPath)
            this._projectPath = findProject(projectPath);
        this._serverPath = serverPath || omnisharpReleaseLocation;
        this._connectionStream.subscribe(state => this.currentState = state);
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

    public connect({projectPath}: IDriverOptions) {
        projectPath = projectPath || this._projectPath;

        this._connectionStream.onNext(DriverState.Connecting);

        var serverArguments: any[] = ["--stdio", "-s", findProject(projectPath), "--hostPID", process.pid];
        this._process = spawn(this._serverPath, serverArguments);
        this._process.stderr.on('data', function(data) { console.log(data.toString()) });
        this._process.stderr.on('data', (data) => this.serverErr(data));

        var rl = readline.createInterface({
            input: this._process.stdout,
            output: undefined
        });
        rl.on('line', (data) => this.handleData(data));

        if (this._process.pid)
            this.id = this._process.pid.toString();
        this._process.on('close', () => this.disconnect());
        this._process.on('error', (data) => this.serverErr(data));
        this._process.on('error', () => this.currentState = DriverState.Error);
    }

    private serverErr(data) {
        var friendlyMessage = this.parseError(data);

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
        this._connectionStream.onNext(DriverState.Disconnected);
        if (this._process != null) {
            this._process.kill("SIGTERM");
            if (process.platform === "win32") {
                exec("taskkill", ["/PID", this._process.pid.toString(), '/T', '/F']);
            }
        }
        this._process = null;
    }

    public request<TRequest, TResponse>(command: string, request?: TRequest): Rx.Observable<TResponse> {
        var sequence = this._seq++;
        var packet: OmniSharp.Stdio.Protocol.RequestPacket = {
            Command: command,
            Seq: sequence,
            Arguments: request
        };

        var subject = new AsyncSubject<TResponse>();
        this._outstandingRequests.set(sequence, subject);
        this._process.stdin.write(JSON.stringify(packet) + '\n', 'ascii');
        return subject;
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
        // enum?
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
                observer.onCompleted();
            } else {
                observer.onError(response.Message);
            }

        } else {

            if (!response.Success) {
                // TODO: make notification?
            }

        }

        if (response.Success) {
            this._commandStream.onNext(response);
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
