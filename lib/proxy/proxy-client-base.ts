import {IDriver, OmnisharpClientStatus, OmnisharpClientOptions} from "../interfaces";
import * as _ from "lodash";
import {Observable, AsyncSubject, CompositeDisposable, Disposable} from "rx";
import {DriverState} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import {observe, sync, proxy} from "./decorators";
import {ensureClientOptions} from "../options";
import {ClientProxyWrapper} from "./client-proxy-wrapper";

// A client that uses events to communicate cross process, and allows you to load Rx workers into the separate process.
export class ProxyClientBase implements IDriver, OmniSharp.Events, Rx.IDisposable {
    private _uniqueId = _.uniqueId("client");
    private _disposable = new CompositeDisposable();

    constructor(protected _options: OmnisharpClientOptions, private _proxy: ClientProxyWrapper) {
        ensureClientOptions(_options);
    }

    public get uniqueId() { return this._uniqueId; }
    public get id() { return this._uniqueId; }
    public get serverPath() { return this._options.serverPath; }
    public get projectPath() { return this._options.projectPath; }

    @observe public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { throw new Error('Implemented by decorator'); }
    @observe public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { throw new Error('Implemented by decorator'); }
    @observe public get state(): Rx.Observable<DriverState> { throw new Error('Implemented by decorator'); }

    @sync(() => this.state)
    public get currentState(): DriverState { throw new Error('Implemented by decorator'); }

    @proxy() public getCurrentRequests(): Observable<{ command: string; sequence: string; silent: boolean; request: any; duration: number; }> { throw new Error('Implemented by decorator'); }

    @observe public get status(): Rx.Observable<OmnisharpClientStatus> { throw new Error('Implemented by decorator'); }
    @observe public get requests(): Rx.Observable<RequestContext<any>> { throw new Error('Implemented by decorator'); }
    @observe public get responses(): Rx.Observable<ResponseContext<any, any>> { throw new Error('Implemented by decorator'); }
    @observe public get errors(): Rx.Observable<CommandContext<any>> { throw new Error('Implemented by decorator'); }

    @proxy(false) public log(message: string, logLevel?: string) { throw new Error('Implemented by decorator'); }
    @proxy(false) public connect(_options?: OmnisharpClientOptions) { }
    @proxy(false) public disconnect() { }
    @proxy() public request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Rx.Observable<TResponse> { throw new Error('Implemented by decorator'); }

    @observe public get projectAdded(): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); };
    @observe public get projectChanged(): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); };
    @observe public get projectRemoved(): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); };
    @observe public get error(): Rx.Observable<OmniSharp.Models.ErrorMessage> { throw new Error('Implemented by decorator'); };
    @observe public get msBuildProjectDiagnostics(): Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics> { throw new Error('Implemented by decorator'); };
    @observe public get packageRestoreStarted(): Rx.Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error('Implemented by decorator'); };
    @observe public get packageRestoreFinished(): Rx.Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error('Implemented by decorator'); };
    @observe public get unresolvedDependencies(): Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage> { throw new Error('Implemented by decorator'); };

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }
}
