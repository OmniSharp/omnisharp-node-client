import * as OmniSharp from "../omnisharp-server";
import {Observable, Subject, AsyncSubject, BehaviorSubject, Subscription} from "rxjs";
import {IDisposable, CompositeDisposable} from "../disposables";
import {keys, isObject, uniqueId, each, defaults, cloneDeep} from "lodash";
import {IDriver, IStaticDriver, OmnisharpClientStatus, OmnisharpClientOptions} from "../enums";
/*import {IOmnisharpPlugin, isPluginDriver} from "../enums";*/
import {Driver, DriverState, Runtime} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import {serverLineNumbers, serverLineNumberArrays} from "../response-handling";
import {ensureClientOptions} from "../options";
import {watchEvent, reference} from "../decorators";
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

export class ClientCore<TEvents extends ClientEventsCore> implements IDriver, IDisposable {
    public static serverLineNumbers = serverLineNumbers;
    public static serverLineNumberArrays = serverLineNumberArrays;

    private _driver: IDriver;
    private _requestStream = new Subject<RequestContext<any>>();
    private _responseStream = new Subject<ResponseContext<any, any>>();
    private _statusStream: Observable<OmnisharpClientStatus>;
    private _errorStream = new Subject<CommandContext<any>>();
    private _customEvents = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();
    private _uniqueId = uniqueId("client");
    protected _lowestIndexValue: number;
    private _eventWatchers = new Map<string, [Subject<CommandContext<any>>, Observable<CommandContext<any>>]>();
    private _commandWatchers = new Map<string, [Subject<ResponseContext<any, any>>, Observable<ResponseContext<any, any>>]>();
    private _disposable = new CompositeDisposable();
    //private _pluginManager: PluginManager;

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }
    public get runtime(): Runtime { return this._driver.runtime; }

    public get currentState() { return this._driver.currentState; }
    private _enqueuedEvents: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._enqueuedEvents; }
    public get commands(): Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._driver.commands; }
    public get state(): Observable<DriverState> { return this._driver.state; }

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

    private _enqueuedResponses: Observable<ResponseContext<any, any>>;
    public get responses(): Observable<ResponseContext<any, any>> { return this._enqueuedResponses; }
    public get errors(): Observable<CommandContext<any>> { return <Observable<CommandContext<any>>><any>this._errorStream; }

    private _observe: TEvents;
    public get observe(): TEvents { return this._observe; }

    constructor(private _options: OmnisharpClientOptions, observableFactory: (client: ClientCore<TEvents>) => TEvents) {
        _options.driver = _options.driver || Driver.Stdio;
        ensureClientOptions(_options);

        //this._pluginManager = new PluginManager(_options.plugins);
        this._resetDriver();

        /*this._disposable.add(this._pluginManager.changed.subscribe(() => {
            const driver = this._driver;
            if (isPluginDriver(driver)) {
                driver.updatePlugins(this._pluginManager.plugins);
            }
        }));*/

        this._enqueuedEvents = Observable.merge(<Observable<OmniSharp.Stdio.Protocol.EventPacket>><any>this._customEvents, this._driver.events)
            .map(event => {
                if (isObject(event.Body)) {
                    Object.freeze(event.Body);
                }
                return Object.freeze(event);
            });

        this._enqueuedResponses = Observable.merge(
            <Observable<ResponseContext<any, any>>><any>this._responseStream,
            this._driver.commands
                .map(packet => new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, "command"), packet.Body)));

        this._lowestIndexValue = _options.oneBasedIndices ? 1 : 0;

        this._disposable.add(this._requestStream.subscribe(x => this._currentRequests.add(x)));

        const getStatusValues = () => <OmnisharpClientStatus>({
            state: this._driver.currentState,
            outgoingRequests: this.outstandingRequests,
            hasOutgoingRequests: this.outstandingRequests > 0
        });

        this.setupRequestStreams();
        this.setupObservers();

        const status = Observable.merge(
            <Observable<any>><any>this._requestStream,
            <Observable<any>><any>this._responseStream);

        this._statusStream = status
            .delay(10)
            .map(getStatusValues)
            .distinctUntilChanged()
            .map(Object.freeze)
            .share();

        this._observe = observableFactory(this);

        if (this._options.debug) {
            this._disposable.add(this._responseStream.subscribe(context => {
                // log our complete response time
                this._customEvents.next({
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
        const deferredQueue = pausable(this._requestStream.filter(isDeferredCommand), pauser)
            .map(request => this.handleResult(request))
            .merge(deferredConcurrency);

        // We just pass these operations through as soon as possible
        const normalQueue = pausable(this._requestStream.filter(isNormalCommand), pauser)
            .map(request => this.handleResult(request))
            .merge(this._options.concurrency);

        // We must wait for these commands
        // And these commands must run in order.
        const priorityQueue = this._requestStream
            .filter(isPriorityCommand)
            .do(() => priorityRequests.next(priorityRequests.getValue() + 1))
            .map(request => this.handleResult(request, () => priorityResponses.next(priorityResponses.getValue() + 1)))
            .merge(this._options.concurrency);

        this._disposable.add(Observable.merge(deferredQueue, normalQueue, priorityQueue).subscribe());
    }

    private handleResult(context: RequestContext<any>, complete?: () => void): Observable<ResponseContext<any, any>> {
        // TODO: Find a way to not repeat the same commands, if there are outstanding (timed out) requests.
        // In some cases for example find usages has taken over 30 seconds, so we shouldn"t hit the server with multiple of these requests (as we slam the cpU)
        const result = <Observable<ResponseContext<any, any>>>this._driver.request<any, any>(context.command, context.request);
        result.subscribe((data) => {
            this._responseStream.next(new ResponseContext(context, data));
        }, (error) => {
            this._errorStream.next(new CommandContext(context.command, error));
            this._responseStream.next(new ResponseContext(context, null, true));
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
        this._customEvents.next({
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
        const item = require("../drivers/" + Driver[driver].toLowerCase());
        const driverFactory: IStaticDriver = item[keys(item)[0]];
        this._driver = new driverFactory(this._options);
        this._disposable.add(this._driver);

        return this._driver;
    }

    public disconnect() {
        this._driver.disconnect();
    }

    public request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Observable<TResponse> {
        if (!options) options = <OmniSharp.RequestOptions>{};
        defaults(options, { oneBasedIndices: this._options.oneBasedIndices });

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

    private setupObservers() {
        this._driver.events.subscribe(x => {
            if (this._eventWatchers.has(x.Event))
                this._eventWatchers.get(x.Event)[0].next(x.Body);
        });

        this._enqueuedResponses.subscribe(x => {
            if (!x.silent && this._commandWatchers.has(x.command))
                this._commandWatchers.get(x.command)[0].next(x);
        });
    }

    private _fixups: Array<(action: string, request: any, options?: OmniSharp.RequestOptions) => void> = [];
    public registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void) {
        this._fixups.push(func);
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

    @fixup
    @isNotNull((request: any) => request.FileName)
    @precondition((request: any) => !request.Selection,
        isNotNull((request: any) => request.Line),
        isAboveZero((request: any) => request.Line),
        isNotNull((request: any) => request.Column),
        isAboveZero((request: any) => request.Column))
    @precondition((request: any) => !!request.Selection,
        isNotNull((request: any) => request.Selection.Start.Line),
        isAboveZero((request: any) => request.Selection.Start.Line),
        isNotNull((request: any) => request.Selection.Start.Column),
        isAboveZero((request: any) => request.Selection.Start.Column),
        isNotNull((request: any) => request.Selection.End.Line),
        isAboveZero((request: any) => request.Selection.End.Line),
        isNotNull((request: any) => request.Selection.End.Column),
        isAboveZero((request: any) => request.Selection.End.Column))
    @endpoint(2)
    public getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Identifier)
    @precondition((request: any) => !request.Selection,
        isNotNull((request: any) => request.Line),
        isAboveZero((request: any) => request.Line),
        isNotNull((request: any) => request.Column),
        isAboveZero((request: any) => request.Column))
    @precondition((request: any) => request.Selection,
        isNotNull((request: any) => request.Selection.Start.Line),
        isAboveZero((request: any) => request.Selection.Start.Line),
        isNotNull((request: any) => request.Selection.Start.Column),
        isAboveZero((request: any) => request.Selection.Start.Column),
        isNotNull((request: any) => request.Selection.End.Line),
        isAboveZero((request: any) => request.Selection.End.Line),
        isNotNull((request: any) => request.Selection.End.Column),
        isAboveZero((request: any) => request.Selection.End.Column))
    @endpoint(2)
    public runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.RunCodeActionResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Buffer)
    @endpoint()
    public updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.NewText)
    @isNotNull((request: any) => request.StartLine)
    @isAboveZero((request: any) => request.StartLine)
    @isNotNull((request: any) => request.StartColumn)
    @isAboveZero((request: any) => request.StartColumn)
    @isNotNull((request: any) => request.EndLine)
    @isAboveZero((request: any) => request.EndLine)
    @isNotNull((request: any) => request.EndColumn)
    @isAboveZero((request: any) => request.EndColumn)
    @endpoint()
    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public codecheck(request: OmniSharp.Models.CodeCheckRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.Character || request.Char)
    @endpoint()
    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.EndLine)
    @isAboveZero((request: any) => request.EndLine)
    @isNotNull((request: any) => request.EndColumn)
    @isAboveZero((request: any) => request.EndColumn)
    @endpoint()
    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.WordToComplete)
    @endpoint()
    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.Filter)
    @endpoint()
    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public gotofile(request?: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.HighlightResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.AssemblyName)
    @isNotNull((request: any) => request.TypeName)
    @endpoint()
    public metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.MetadataResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.ProjectPath)
    @isNotNull((request: any) => request.Search)
    @endpoint()
    public packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.ProjectPath)
    @endpoint()
    public packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.ProjectPath)
    @isNotNull((request: any) => request.Id)
    @endpoint()
    public packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.RenameTo)
    @endpoint()
    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RenameResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.SignatureHelp> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public stopserver(request: any, options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public checkalivestatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public checkreadystatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request)
    @endpoint()
    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Observable<boolean> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.Type)
    @isAboveZero((request: any) => request.Type)
    @endpoint()
    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse> { throw new Error("Implemented by decorator"); }
}

export class ClientEventsCore implements OmniSharp.Events {
    constructor(private _client: any) { }

    public get uniqueId() { return this._client.uniqueId; }

    @watchEvent public get projectAdded(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @watchEvent public get projectChanged(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @watchEvent public get projectRemoved(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @watchEvent public get error(): Observable<OmniSharp.Models.ErrorMessage> { throw new Error("Implemented by decorator"); }
    @watchEvent public get msBuildProjectDiagnostics(): Observable<OmniSharp.Models.MSBuildProjectDiagnostics> { throw new Error("Implemented by decorator"); }
    @watchEvent public get packageRestoreStarted(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @watchEvent public get packageRestoreFinished(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @watchEvent public get unresolvedDependencies(): Observable<OmniSharp.Models.UnresolvedDependenciesMessage> { throw new Error("Implemented by decorator"); }

    @reference public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { throw new Error("Implemented by decorator"); }
    @reference public get commands(): Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { throw new Error("Implemented by decorator"); }
    @reference public get state(): Observable<DriverState> { throw new Error("Implemented by decorator"); }
    @reference public get status(): Observable<OmnisharpClientStatus> { throw new Error("Implemented by decorator"); }
    @reference public get requests(): Observable<RequestContext<any>> { throw new Error("Implemented by decorator"); }
    @reference public get responses(): Observable<ResponseContext<any, any>> { throw new Error("Implemented by decorator"); }
    @reference public get errors(): Observable<CommandContext<any>> { throw new Error("Implemented by decorator"); }

    @watchCommand public get updatebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get changebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codecheck(): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatAfterKeystroke(): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatRange(): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codeformat(): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get autocomplete(): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findimplementations(): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findsymbols(): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findusages(): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get fixusings(): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotodefinition(): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotofile(): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotoregion(): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get highlight(): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get metadata(): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigateup(): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigatedown(): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesearch(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesource(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packageversion(): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get rename(): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get signatureHelp(): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get stopserver(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkalivestatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkreadystatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersastree(): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersasflat(): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get typelookup(): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get filesChanged(): Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get projects(): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get project(): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get getcodeactions(): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get runcodeaction(): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gettestcontext(): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error("Implemented by decorator"); }
}
