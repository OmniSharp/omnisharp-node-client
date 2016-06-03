import * as OmniSharp from "../omnisharp-server";
//import {Observable, Subject, AsyncSubject, BehaviorSubject, Subscription} from "rxjs";
import {IDisposable, CompositeDisposable} from "../disposables";
import {keys, bind, isEqual, uniqueId, each, defaults, cloneDeep} from "lodash";
import {IAsyncDriver, IDriverOptions, OmnisharpClientStatus, AsyncClientOptions} from "../enums";
/*import {IOmnisharpPlugin, isPluginDriver} from "../enums";*/
import {DriverState, Runtime} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import {ensureClientOptions} from "../options";
import {preconditions} from "../helpers/preconditions";
import {EventEmitter} from "events";
import {Queue} from "../helpers/queue";
//import {PluginManager} from "../helpers/plugin-manager";


/////
// NOT TESTED
// NOT READY! :)
/////

export class AsyncEvents {
    public static request = "request";
    public static response = "response";
    public static status = "response";
    public static state = "response";
    public static error = "error";
    public static event = "event";
}

export class AsyncClient implements IAsyncDriver, IDisposable {
    private _emitter = new EventEmitter();
    private _queue: Queue<PromiseLike<ResponseContext<any, any>>>;
    private _listen(event: string, callback: Function): IDisposable {
        this._emitter.addListener(AsyncEvents.event, callback);
        return { dispose: () => this._emitter.removeListener(AsyncEvents.event, callback) };
    }

    private _driver: IAsyncDriver;
    private _uniqueId = uniqueId("client");
    protected _lowestIndexValue = 0;
    private _disposable = new CompositeDisposable();
    //private _pluginManager: PluginManager;

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }
    public get runtime(): Runtime { return this._driver.runtime; }

    public get outstandingRequests() { return this._currentRequests.size; }

    private _currentRequests = new Set<RequestContext<any>>();
    public getCurrentRequests() {
        const response: {
            command: string;
            sequence: string;
            silent: boolean;
            request: any;
            duration: number;
        }[] = [];

        this._currentRequests.forEach(request => {
            response.push({
                command: request.command,
                sequence: cloneDeep(request.sequence),
                request: request.request,
                silent: request.silent,
                duration: Date.now() - request.time.getTime()
            });
        });

        return response;
    }



    public onEvent(callback: (event: OmniSharp.Stdio.Protocol.EventPacket) => void) {
        return this._listen(AsyncEvents.event, callback);
    }

    private _currentState: DriverState = DriverState.Disconnected;
    public get currentState() { return this._currentState; }
    public onState(callback: (state: DriverState) => void) {
        return this._listen(AsyncEvents.state, callback);
    }

    public onStatus(callback: (status: OmnisharpClientStatus) => void) {
        return this._listen(AsyncEvents.status, callback);
    }

    public onRequest(callback: (request: RequestContext<any>) => void) {
        return this._listen(AsyncEvents.request, callback);
    }

    public onResponse(callback: (response: ResponseContext<any, any>) => void) {
        return this._listen(AsyncEvents.response, callback);
    }

    public onError(callback: (event: OmniSharp.Stdio.Protocol.EventPacket) => void) {
        return this._listen(AsyncEvents.error, callback);
    }

    //private _observe: ClientEventsCore;
    //public get observe(): ClientEventsCore { return this._observe; }

    private _options: AsyncClientOptions & IDriverOptions;

    constructor(_options: AsyncClientOptions) {
        _options.driver = _options.driver || ((options: IDriverOptions) => {
            const item = require("../drivers/stdio");
            const driverFactory = item[keys(item)[0]];
            return new driverFactory(this._options);
        });

        this._options = defaults(_options, <IDriverOptions>{
            onState: (state) => {
                this._currentState = state;
                this._emitter.emit(AsyncEvents.state, state);
            },
            onEvent: (event) => {
                this._emitter.emit(AsyncEvents.event, event);
            },
            onCommand: (packet) => {
                const response = new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, "command"), packet.Body);
                this._respondToRequest(packet.Command, response);
            }
        });

        ensureClientOptions(_options);

        //this._pluginManager = new PluginManager(_options.plugins);
        this._resetDriver();

        /*this._disposable.add(this._pluginManager.changed.subscribe(() => {
            const driver = this._driver;
            if (isPluginDriver(driver)) {
                driver.updatePlugins(this._pluginManager.plugins);
            }
        }));*/

        const getStatusValues = () => <OmnisharpClientStatus>({
            state: this._driver.currentState,
            outgoingRequests: this.outstandingRequests,
            hasOutgoingRequests: this.outstandingRequests > 0
        });

        let lastStatus: OmnisharpClientStatus = <any>{};
        const emitStatus = () => {
            const newStatus = getStatusValues();
            if (!isEqual(getStatusValues(), lastStatus)) {
                lastStatus = newStatus;
                this._emitter.emit(AsyncEvents.status, lastStatus);
            }
        };

        this._emitter.on(AsyncEvents.request, emitStatus);
        this._emitter.on(AsyncEvents.response, emitStatus);
        //this._observe = new ClientEventsCore(this);
        this._queue = new Queue<PromiseLike<ResponseContext<any, any>>>(this._options.concurrency, bind(this.handleResult, this));

        if (this._options.debug) {
            this._emitter.on(AsyncEvents.response, (context: ResponseContext<any, any>) => {
                this._emitter.emit(AsyncEvents.event, {
                    Event: "log",
                    Body: {
                        Message: `/${context.command}  ${context.responseTime}ms (round trip)`,
                        LogLevel: "INFORMATION"
                    },
                    Seq: -1,
                    Type: "log"
                });
            });
        }
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this.disconnect();
        this._disposable.dispose();
    }


    private handleResult(context: RequestContext<any>, complete?: () => void): Promise<ResponseContext<any, any>> {
        // TODO: Find a way to not repeat the same commands, if there are outstanding (timed out) requests.
        // In some cases for example find usages has taken over 30 seconds, so we shouldn"t hit the server with multiple of these requests (as we slam the cpU)
        const result = this._driver.request<any, any>(context.command, context.request);

        const cmp = () => {
            this._currentRequests.delete(context);
            if (complete) {
                complete();
                complete = null;
            }
        };

        return new Promise((resolve, reject) => {
            result
                .then((data) => {
                    this._respondToRequest(context.command, new ResponseContext(context, data));
                    cmp();
                    resolve(data);
                }, (error) => {
                    this._emitter.emit(AsyncEvents.error, new CommandContext(context.command, error));
                    this._respondToRequest(context.command, new ResponseContext(context, null, true));
                    this._currentRequests.delete(context);
                    cmp();
                    reject(error);
                });
        });
    }

    public log(message: string, logLevel?: string) {
        // log our complete response time
        this._emitter.emit(AsyncEvents.event, {
            Event: "log",
            Body: {
                Message: message,
                LogLevel: logLevel ? logLevel.toUpperCase() : "INFORMATION"
            },
            Seq: -1,
            Type: "log"
        });
    }

    public connect() {
        // Currently connecting
        if (this.currentState >= DriverState.Downloading && this.currentState <= DriverState.Connected) return;
        // Bootstrap plugins here

        this._currentRequests.clear();
        this._driver.connect();
    }

    private _resetDriver() {
        if (this._driver) {
            this._disposable.remove(this._driver);
            this._driver.dispose();
        }

        const {driver} = this._options;
        this._driver = driver(this._options);
        this._disposable.add(this._driver);

        return this._driver;
    }

    public disconnect() {
        this._driver.disconnect();
    }

    public request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Promise<TResponse> {
        let conditions = preconditions[action];
        if (conditions) { each(conditions, x => x(request)); }

        if (!options) options = <OmniSharp.RequestOptions>{};
        // Handle disconnected requests
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            return new Promise<TResponse>((resolve, reject) => {
                const disposable = this.onState(state => {
                    if (state === DriverState.Connected) {
                        disposable.dispose();
                        this.request<TRequest, TResponse>(action, request, options)
                            .then(resolve, reject);
                    }
                });
            });
        }

        const context = new RequestContext(this._uniqueId, action, request, options);
        return new Promise<TResponse>((resolve, reject) => {
            this._queue.enqueue(context).then((response) => resolve(response.response), reject);
        });
    }

    private _fixups: Array<(action: string, request: any, options?: OmniSharp.RequestOptions) => void> = [];
    public registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void) {
        this._fixups.push(func);
    }

    private _respondToRequest(key: string, response: ResponseContext<any, any>) {
        key = key.toLowerCase();
        this._emitter.emit(key, response);
        this._emitter.emit(AsyncEvents.response, response);
    }

    /* tslint:disable:no-unused-variable */
    private _fixup<TRequest>(action: string, request: TRequest, options?: OmniSharp.RequestOptions) {
        each(this._fixups, f => f(action, request, options));
    }
    /* tslint:enable:no-unused-variable */

    /*public addPlugin(plugin: IOmnisharpPlugin) {
        this._pluginManager.add(plugin);
    }

    public removePlugin(plugin: IOmnisharpPlugin) {
        this._pluginManager.remove(plugin);
    }*/
}

/*
export class AsyncClientEvents implements OmniSharp.Events {
    constructor(private _client: AsyncClient) { }

    public get uniqueId() { return this._client.uniqueId; }

    @event public get projectAdded(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @event public get projectChanged(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @event public get projectRemoved(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @event public get error(): Observable<OmniSharp.Models.ErrorMessage> { throw new Error("Implemented by decorator"); }
    @event public get msBuildProjectDiagnostics(): Observable<OmniSharp.Models.MSBuildProjectDiagnostics> { throw new Error("Implemented by decorator"); }
    @event public get packageRestoreStarted(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @event public get packageRestoreFinished(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @event public get unresolvedDependencies(): Observable<OmniSharp.Models.UnresolvedDependenciesMessage> { throw new Error("Implemented by decorator"); }

    @reference public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { throw new Error("Implemented by decorator"); }
    @reference public get commands(): Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { throw new Error("Implemented by decorator"); }
    @reference public get state(): Observable<DriverState> { throw new Error("Implemented by decorator"); }
    @reference public get status(): Observable<OmnisharpClientStatus> { throw new Error("Implemented by decorator"); }
    @reference public get requests(): Observable<RequestContext<any>> { throw new Error("Implemented by decorator"); }
    @reference public get responses(): Observable<ResponseContext<any, any>> { throw new Error("Implemented by decorator"); }
    @reference public get errors(): Observable<CommandContext<any>> { throw new Error("Implemented by decorator"); }

    @response public get updatebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @response public get changebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @response public get codecheck(): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @response public get formatAfterKeystroke(): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @response public get formatRange(): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @response public get codeformat(): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>> { throw new Error("Implemented by decorator"); }
    @response public get autocomplete(): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>> { throw new Error("Implemented by decorator"); }
    @response public get findimplementations(): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @response public get findsymbols(): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @response public get findusages(): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @response public get fixusings(): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>> { throw new Error("Implemented by decorator"); }
    @response public get gotodefinition(): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>> { throw new Error("Implemented by decorator"); }
    @response public get gotofile(): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @response public get gotoregion(): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @response public get highlight(): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>> { throw new Error("Implemented by decorator"); }
    @response public get metadata(): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>> { throw new Error("Implemented by decorator"); }
    @response public get navigateup(): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @response public get navigatedown(): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @response public get packagesearch(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>> { throw new Error("Implemented by decorator"); }
    @response public get packagesource(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>> { throw new Error("Implemented by decorator"); }
    @response public get packageversion(): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>> { throw new Error("Implemented by decorator"); }
    @response public get rename(): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>> { throw new Error("Implemented by decorator"); }
    @response public get signatureHelp(): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>> { throw new Error("Implemented by decorator"); }
    @response public get stopserver(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @response public get checkalivestatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @response public get checkreadystatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @response public get currentfilemembersastree(): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>> { throw new Error("Implemented by decorator"); }
    @response public get currentfilemembersasflat(): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>> { throw new Error("Implemented by decorator"); }
    @response public get typelookup(): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>> { throw new Error("Implemented by decorator"); }
    @response public get filesChanged(): Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>> { throw new Error("Implemented by decorator"); }
    @response public get projects(): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>> { throw new Error("Implemented by decorator"); }
    @response public get project(): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>> { throw new Error("Implemented by decorator"); }
    @response public get getcodeactions(): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>> { throw new Error("Implemented by decorator"); }
    @response public get runcodeaction(): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>> { throw new Error("Implemented by decorator"); }
    @response public get gettestcontext(): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error("Implemented by decorator"); }
}
*/
