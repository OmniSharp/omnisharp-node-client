import * as OmniSharp from "../omnisharp-server";
import {Observable, Subject, AsyncSubject, BehaviorSubject, Subscription} from "rxjs";
import {IDisposable, CompositeDisposable} from "../disposables";
import {keys, bind, uniqueId, each, defaults, cloneDeep} from "lodash";
import {IReactiveDriver, IDriverOptions, OmnisharpClientStatus, ReactiveClientOptions} from "../enums";
/*import {IOmnisharpPlugin, isPluginDriver} from "../enums";*/
import {DriverState, Runtime} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import {ensureClientOptions} from "../options";
import {event, reference, request, response} from "../helpers/decorators";
import * as preconditions from "../helpers/preconditions";
import {isPriorityCommand, isNormalCommand, isDeferredCommand} from "../helpers/prioritization";
import {createObservable} from "../operators/create";
//import {PluginManager} from "../helpers/plugin-manager";
//
function pausable<T>(incomingStream: Observable<T>, pauser: Observable<boolean>) {
    return createObservable<T>(observer => {
        let paused: boolean;
        let queue: any[] = [];
        const sub = new Subscription();

        sub.add(pauser.subscribe(shouldRun => {
            paused = !shouldRun;

            if (shouldRun && queue.length) {
                each(queue, r => observer.next(r));
                queue = [];
            }
        }));

        sub.add(incomingStream
            .subscribe(request => {
                if (paused) {
                    queue.push(request);
                } else {
                    observer.next(request);
                }
            }));

        return sub;
    });
}

export class ReactiveClient implements IReactiveDriver, IDisposable, OmniSharp.Api.V2 {
    private _driver: IReactiveDriver;
    private _requestStream = new Subject<RequestContext<any>>();
    private _responseStream = new Subject<ResponseContext<any, any>>();
    private _responseStreams = new Map<string, Subject<ResponseContext<any, any>>>();
    private _statusStream: Observable<OmnisharpClientStatus>;
    private _errorStream = new Subject<CommandContext<any>>();
    private _uniqueId = uniqueId("client");
    protected _lowestIndexValue = 0;
    private _disposable = new CompositeDisposable();
    //private _pluginManager: PluginManager;

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }
    public get runtime(): Runtime { return this._driver.runtime; }

    private _eventsStream = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();
    private _events = this._eventsStream.asObservable();
    public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._events; }

    public get currentState() { return this._stateStream.getValue(); }
    private _stateStream = new BehaviorSubject<DriverState>(DriverState.Disconnected);
    private _state = this._stateStream.asObservable();
    public get state(): Observable<DriverState> { return this._state; }

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

    public get status(): Observable<OmnisharpClientStatus> { return this._statusStream; }
    public get requests(): Observable<RequestContext<any>> { return <Observable<RequestContext<any>>><any>this._requestStream; }
    public get responses(): Observable<ResponseContext<any, any>> { return this._responseStream; }
    public get errors(): Observable<CommandContext<any>> { return <Observable<CommandContext<any>>><any>this._errorStream; }

    private _observe: ReactiveClientEvents;
    public get observe(): ReactiveClientEvents { return this._observe; }

    private _options: ReactiveClientOptions & IDriverOptions;

    constructor(_options: ReactiveClientOptions) {
        _options.driver = _options.driver || ((options: IDriverOptions) => {
            const item = require("../drivers/stdio");
            const driverFactory = item[keys(item)[0]];
            return new driverFactory(this._options);
        });

        this._options = defaults(_options, <IDriverOptions>{
            onState: bind(this._stateStream.next, this._stateStream),
            onEvent: bind(this._eventsStream.next, this._eventsStream),
            onCommand: (packet) => {
                const response = new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, "command"), packet.Body);
                this._getResponseStream(packet.Command).next(response);
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

        this._disposable.add(this._requestStream.subscribe(x => this._currentRequests.add(x)));

        const getStatusValues = () => <OmnisharpClientStatus>({
            state: this._driver.currentState,
            outgoingRequests: this.outstandingRequests,
            hasOutgoingRequests: this.outstandingRequests > 0
        });

        this.setupRequestStreams();

        const status = Observable.merge(
            <Observable<any>><any>this._requestStream,
            <Observable<any>><any>this._responseStream);

        this._statusStream = status
            .delay(10)
            .map(getStatusValues)
            .distinctUntilChanged()
            .share();

        this._observe = new ReactiveClientEvents(this);

        if (this._options.debug) {
            this._disposable.add(this._responseStream.subscribe(context => {
                // log our complete response time
                this._eventsStream.next({
                    Event: "log",
                    Body: {
                        Message: `/${context.command}  ${context.responseTime}ms (round trip)`,
                        LogLevel: "INFORMATION"
                    },
                    Seq: -1,
                    Type: "log"
                });
            }));
        }
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this.disconnect();
        this._disposable.dispose();
    }

    private setupRequestStreams() {
        const priorityRequests = new BehaviorSubject(0), priorityResponses = new BehaviorSubject(0);

        const pauser = Observable.combineLatest(
            <Observable<number>><any>priorityRequests,
            <Observable<number>><any>priorityResponses,
            (requests, responses) => {
                if (requests > 0 && responses === requests) {
                    priorityRequests.next(0);
                    priorityResponses.next(0);
                    return true;
                } else if (requests > 0) {
                    return false;
                }

                return true;
            })
            .startWith(true)
            .debounceTime(120)
            .share();

        // Keep deferred concurrency at a min of two, this lets us get around long running requests jamming the pipes.
        const deferredConcurrency = Math.max(Math.floor(this._options.concurrency / 4), 2);

        // These are operations that should wait until after
        // we have executed all the current priority commands
        // We also defer silent commands to this queue, as they are generally for "background" work

        this._disposable.add(
            //deferredQueue
            pausable(this._requestStream.filter(isDeferredCommand), pauser)
                .map(request => this.handleResult(request))
                .merge(deferredConcurrency)
                .subscribe(),

            //normalQueue
            // We just pass these operations through as soon as possible
            pausable(this._requestStream.filter(isNormalCommand), pauser)
                .map(request => this.handleResult(request))
                .merge(this._options.concurrency)
                .subscribe(),

            //priorityQueue
            // We must wait for these commands
            this._requestStream
                .filter(isPriorityCommand)
                .do(() => priorityRequests.next(priorityRequests.getValue() + 1))
                .map(request => this.handleResult(request, () => priorityResponses.next(priorityResponses.getValue() + 1)))
                .concat() // And these commands must run in order.
                .subscribe()
        );
    }

    private handleResult(context: RequestContext<any>, complete?: () => void): Observable<ResponseContext<any, any>> {
        // TODO: Find a way to not repeat the same commands, if there are outstanding (timed out) requests.
        // In some cases for example find usages has taken over 30 seconds, so we shouldn"t hit the server with multiple of these requests (as we slam the cpU)
        const result = <Observable<ResponseContext<any, any>>>this._driver.request<any, any>(context.command, context.request);
        const responseStream = this._getResponseStream(context.command);
        result.subscribe((data) => {
            responseStream.next(new ResponseContext(context, data));
        }, (error) => {
            this._errorStream.next(new CommandContext(context.command, error));
            responseStream.next(new ResponseContext(context, null, true));
            this._currentRequests.delete(context);
            if (complete) {
                complete();
                complete = null;
            }
        }, () => {
            this._currentRequests.delete(context);
            if (complete) {
                complete();
                complete = null;
            }
        });

        return result
            // This timeout doesn't prevent the request from completing
            // It simply unblocks the queue, so we can continue to process items.
            .timeout(this._options.concurrencyTimeout, Observable.empty<ResponseContext<any, any>>());
    }

    public log(message: string, logLevel?: string) {
        // log our complete response time
        this._eventsStream.next({
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

    public request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Observable<TResponse> {
        if (!options) options = <OmniSharp.RequestOptions>{};
        // Handle disconnected requests
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            const response = new AsyncSubject<TResponse>();

            this.state.filter(z => z === DriverState.Connected)
                .take(1)
                .subscribe(z => {
                    this.request<TRequest, TResponse>(action, request, options).subscribe(x => response.next(x));
                });

            return <Observable<TResponse>><any>response;
        }

        const context = new RequestContext(this._uniqueId, action, request, options);
        this._requestStream.next(context);

        return context.getResponse<TResponse>(<Observable<any>><any>this._responseStream);
    }

    private _fixups: Array<(action: string, request: any, options?: OmniSharp.RequestOptions) => void> = [];
    public registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void) {
        this._fixups.push(func);
    }

    private _getResponseStream(key: string) {
        key = key.toLowerCase();
        if (!this._responseStreams.has(key)) {
            const subject = new Subject<ResponseContext<any, any>>();
            subject.subscribe({
                next: bind(this._responseStream.next, this._responseStream)
            });
            this._responseStreams.set(key, subject);
            return subject;
        }

        return this._responseStreams.get(key);
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

    @request(preconditions.getcodeactions)
    public getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.runcodeaction)
    public runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.RunCodeActionResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.updatebuffer)
    public updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @request(preconditions.changebuffer)
    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @request(preconditions.codecheck)
    public codecheck(request: OmniSharp.Models.CodeCheckRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.formatAfterKeystroke)
    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.formatRange)
    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.codeformat)
    public codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.autocomplete)
    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]> { throw new Error("Implemented by decorator"); }

    @request(preconditions.findimplementations)
    public findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.findsymbols)
    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.findusages)
    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.fixusings)
    public fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.gotodefinition)
    public gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @request(preconditions.navigateup)
    public navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.gotofile)
    public open(request?: OmniSharp.Models.FileOpenRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileOpenResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.gotofile)
    public close(request?: OmniSharp.Models.FileCloseRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileCloseResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.gotofile)
    public gotofile(request?: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.gotoregion)
    public gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.highlight)
    public highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.HighlightResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.metadata)
    public metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.MetadataResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.navigatedown)
    public navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.packagesearch)
    public packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.packagesource)
    public packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.packageversion)
    public packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.rename)
    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RenameResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.signatureHelp)
    public signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.SignatureHelp> { throw new Error("Implemented by decorator"); }

    @request()
    public stopserver(request: any, options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @request()
    public checkalivestatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @request()
    public checkreadystatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @request(preconditions.currentfilemembersastree)
    public currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @request(preconditions.currentfilemembersasflat)
    public currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @request(preconditions.typelookup)
    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.filesChanged)
    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Observable<boolean> { throw new Error("Implemented by decorator"); }

    @request(preconditions.projects)
    public projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.project)
    public project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }

    @request(preconditions.gettestcontext)
    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse> { throw new Error("Implemented by decorator"); }
}

export class ReactiveClientEvents implements OmniSharp.Events {
    constructor(private _client: ReactiveClient) { }

    public get uniqueId() { return this._client.uniqueId; }

    @event public get diagnostic(): Observable<OmniSharp.Models.DiagnosticMessage> { throw new Error("Implemented by decorator"); }
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
