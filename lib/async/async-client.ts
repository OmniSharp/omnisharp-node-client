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
import {request} from "../helpers/decorators";

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

// <#GENERATED />
request(AsyncClient.prototype, "getteststartinfo");
request(AsyncClient.prototype, "runtest");
request(AsyncClient.prototype, "autocomplete");
request(AsyncClient.prototype, "changebuffer");
request(AsyncClient.prototype, "codecheck");
request(AsyncClient.prototype, "codeformat");
request(AsyncClient.prototype, "close");
request(AsyncClient.prototype, "open");
request(AsyncClient.prototype, "filesChanged");
request(AsyncClient.prototype, "findimplementations");
request(AsyncClient.prototype, "findsymbols");
request(AsyncClient.prototype, "findusages");
request(AsyncClient.prototype, "fixusings");
request(AsyncClient.prototype, "formatAfterKeystroke");
request(AsyncClient.prototype, "formatRange");
request(AsyncClient.prototype, "getcodeactions");
request(AsyncClient.prototype, "gotodefinition");
request(AsyncClient.prototype, "gotofile");
request(AsyncClient.prototype, "gotoregion");
request(AsyncClient.prototype, "highlight");
request(AsyncClient.prototype, "currentfilemembersasflat");
request(AsyncClient.prototype, "currentfilemembersastree");
request(AsyncClient.prototype, "metadata");
request(AsyncClient.prototype, "navigatedown");
request(AsyncClient.prototype, "navigateup");
request(AsyncClient.prototype, "packagesearch");
request(AsyncClient.prototype, "packagesource");
request(AsyncClient.prototype, "packageversion");
request(AsyncClient.prototype, "rename");
request(AsyncClient.prototype, "runcodeaction");
request(AsyncClient.prototype, "signatureHelp");
request(AsyncClient.prototype, "gettestcontext");
request(AsyncClient.prototype, "typelookup");
request(AsyncClient.prototype, "updatebuffer");
request(AsyncClient.prototype, "project");
request(AsyncClient.prototype, "projects");
request(AsyncClient.prototype, "checkalivestatus");
request(AsyncClient.prototype, "checkreadystatus");
request(AsyncClient.prototype, "stopserver");

export interface AsyncClient {
    getteststartinfo(request: any, options?: OmniSharp.RequestOptions): Promise<any>;
    runtest(request: any, options?: OmniSharp.RequestOptions): Promise<any>;
    autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.AutoCompleteResponse[]>;
    changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
    codecheck(request: OmniSharp.Models.V2.CodeCheckRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.CodeCheckResponse>;
    codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.CodeFormatResponse>;
    close(request: OmniSharp.Models.FileCloseRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileCloseResponse>;
    open(request: OmniSharp.Models.FileOpenRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileOpenResponse>;
    filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FilesChangedResponse>;
    findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FixUsingsResponse>;
    formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
    formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
    getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.GetCodeActionsResponse>;
    gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GotoDefinitionResponse>;
    gotofile(request: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.HighlightResponse>;
    currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFix[]>;
    currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileMemberTree>;
    metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.MetadataResponse>;
    navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
    navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
    packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSearchResponse>;
    packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSourceResponse>;
    packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageVersionResponse>;
    rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.RenameResponse>;
    runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.RunCodeActionResponse>;
    signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.SignatureHelp>;
    gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GetTestCommandResponse>;
    typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.TypeLookupResponse>;
    updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
    project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.ProjectInformationResponse>;
    projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.WorkspaceInformationResponse>;
    checkalivestatus(options?: OmniSharp.RequestOptions): Promise<boolean>;
    checkreadystatus(options?: OmniSharp.RequestOptions): Promise<boolean>;
    stopserver(options?: OmniSharp.RequestOptions): Promise<boolean>;
    request(path: "/v2/getteststartinfo", request: any, options?: OmniSharp.RequestOptions): Promise<any>;
    request(path: "/v2/runtest", request: any, options?: OmniSharp.RequestOptions): Promise<any>;
    request(path: "/autocomplete", request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.AutoCompleteResponse[]>;
    request(path: "/changebuffer", request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
    request(path: "/codecheck", request: OmniSharp.Models.CodeCheckRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    request(path: "/codeformat", request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.CodeFormatResponse>;
    request(path: "/close", request: OmniSharp.Models.FileCloseRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileCloseResponse>;
    request(path: "/open", request: OmniSharp.Models.FileOpenRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileOpenResponse>;
    request(path: "/filesChanged", request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FilesChangedResponse>;
    request(path: "/findimplementations", request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    request(path: "/findsymbols", request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    request(path: "/findusages", request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    request(path: "/fixusings", request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FixUsingsResponse>;
    request(path: "/formatAfterKeystroke", request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
    request(path: "/formatRange", request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
    request(path: "/getcodeactions", request: OmniSharp.Models.GetCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GetCodeActionsResponse>;
    request(path: "/gotodefinition", request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GotoDefinitionResponse>;
    request(path: "/gotofile", request: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    request(path: "/gotoregion", request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    request(path: "/highlight", request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.HighlightResponse>;
    request(path: "/currentfilemembersasflat", request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFix[]>;
    request(path: "/currentfilemembersastree", request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileMemberTree>;
    request(path: "/metadata", request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.MetadataResponse>;
    request(path: "/navigatedown", request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
    request(path: "/navigateup", request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
    request(path: "/packagesearch", request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSearchResponse>;
    request(path: "/packagesource", request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSourceResponse>;
    request(path: "/packageversion", request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageVersionResponse>;
    request(path: "/rename", request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.RenameResponse>;
    request(path: "/runcodeaction", request: OmniSharp.Models.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.RunCodeActionResponse>;
    request(path: "/signatureHelp", request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.SignatureHelp>;
    request(path: "/gettestcontext", request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GetTestCommandResponse>;
    request(path: "/typelookup", request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.TypeLookupResponse>;
    request(path: "/updatebuffer", request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
    request(path: "/v2/codecheck", request: OmniSharp.Models.V2.CodeCheckRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.CodeCheckResponse>;
    request(path: "/v2/getcodeactions", request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.GetCodeActionsResponse>;
    request(path: "/v2/runcodeaction", request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.RunCodeActionResponse>;
    request(path: "/project", request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.ProjectInformationResponse>;
    request(path: "/projects", request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.WorkspaceInformationResponse>;
    request(path: "/checkalivestatus", options?: OmniSharp.RequestOptions): Promise<boolean>;
    request(path: "/checkreadystatus", options?: OmniSharp.RequestOptions): Promise<boolean>;
    request(path: "/stopserver", options?: OmniSharp.RequestOptions): Promise<boolean>;
}
