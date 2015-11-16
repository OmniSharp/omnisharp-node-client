import {OmniSharp} from "../../omnisharp-server.d.ts";
import {Observable, Subject, BehaviorSubject, Scheduler, Subscriber} from "@reactivex/rxjs";
import {CompositeDisposable, IDisposable} from "../helpers/Disposable";
import {isObject, uniqueId, each, defaults, cloneDeep, memoize, keys} from "lodash";
import {IDriver, IStaticDriver, OmnisharpClientStatus, OmnisharpClientOptions} from "../interfaces";
import {Driver, DriverState} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import {serverLineNumbers, serverLineNumberArrays} from "../response-handling";
import {ensureClientOptions} from "../options";
import {watchEvent, reference} from "../decorators";
import {isPriorityCommand, isNormalCommand, isDeferredCommand} from "../helpers/prioritization";
import {PluginManager} from "../helpers/plugin-manager";
import {pausableBuffered} from "../helpers/pausableBuffered";

export class ClientBase<TEvents extends ClientEventsBase> implements IDriver, IDisposable {
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
    private _eventWatchers = new Map<string, Subject<CommandContext<any>>>();
    private _commandWatchers = new Map<string, Subject<ResponseContext<any, any>>>();
    private _disposable = new CompositeDisposable();
    private _plugins: PluginManager;

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }

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
    public get requests(): Observable<RequestContext<any>> { return this._requestStream; }

    private _enqueuedResponses: Observable<ResponseContext<any, any>>;
    public get responses(): Observable<ResponseContext<any, any>> { return this._enqueuedResponses; }
    public get errors(): Observable<CommandContext<any>> { return this._errorStream; }

    private _observe: TEvents;
    public get observe(): TEvents { return this._observe; }

    constructor(private _options: OmnisharpClientOptions, observableFactory: (client: ClientBase<TEvents>) => TEvents) {
        _options.driver = _options.driver || Driver.Stdio;
        ensureClientOptions(_options);
        const {driver} = _options;

        const driverModule = require("../drivers/" + Driver[driver].toLowerCase());
        const driverFactory: IStaticDriver = driverModule[keys(driverModule)[0]];
        this._driver = new driverFactory(_options);

        this._plugins = new PluginManager(_options.projectPath, _options.plugins);

        this._disposable.add(this._driver);
        this._disposable.add(this._requestStream);
        this._disposable.add(this._responseStream);
        this._disposable.add(this._errorStream);
        this._disposable.add(this._customEvents);

        this._enqueuedEvents = Observable.merge(this._customEvents, this._driver.events)
            .map(event => {
                if (isObject(event.Body)) {
                    Object.freeze(event.Body);
                }
                return Object.freeze(event);
            });

        this._enqueuedResponses = Observable.merge(
            this._responseStream,
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

        const status = Observable.merge(<Observable<any>>this._requestStream, <Observable<any>>this._responseStream);

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
            priorityRequests,
            priorityResponses,
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
            .debounceTime(120);

        // Keep deferred concurrency at a min of two, this lets us get around long running requests jamming the pipes.
        const deferredConcurrency = Math.max(Math.floor(this._options.concurrency / 4), 2);

        // These are operations that should wait until after
        // we have executed all the current priority commands
        // We also defer silent commands to this queue, as they are generally for "background" work
        const deferredQueue = pausableBuffered(this._requestStream.filter(isDeferredCommand), pauser)
            .map(request => this.handleResult(request))
            .merge(deferredConcurrency);

        // We just pass these operations through as soon as possible
        const normalQueue = pausableBuffered(this._requestStream.filter(isNormalCommand), pauser)
            .map(request => this.handleResult(request))
            .merge(this._options.concurrency);

        // We must wait for these commands
        // And these commands must run in order.
        const priorityQueue = this._requestStream
            .filter(isPriorityCommand)
            .do(() => priorityRequests.next((<any>priorityRequests).value + 1))
            .map(request => this.handleResult(request))
            .merge(this._options.concurrency)
            .do(() => priorityResponses.next((<any>priorityResponses).value + 1));

        this._disposable.add(Observable.merge(deferredQueue, normalQueue, priorityQueue).subscribe());
    }

    private handleResult(context: RequestContext<any>): Observable<ResponseContext<any, any>> {
        // TODO: Find a way to not repeat the same commands, if there are outstanding (timed out) requests.
        // In some cases for example find usages has taken over 30 seconds, so we shouldn"t hit the server with multiple of these requests (as we slam the cpU)
        const result = <Observable<ResponseContext<any, any>>>this._driver.request<any, any>(context.command, context.request);

        result.subscribe((data) => {
            this._responseStream.next(new ResponseContext(context, data));
        }, (error) => {
            this._errorStream.next(new CommandContext(context.command, error));
            this._responseStream.next(new ResponseContext(context, null, true));
            this._currentRequests.delete(context);
        }, () => {
            this._currentRequests.delete(context);
        });

        return result
            // This timeout doesn"t prevent the request from completing
            // It simply unblocks the queue, so we can continue to process items.
            .timeoutWith(this._options.concurrencyTimeout, Observable.empty<ResponseContext<any, any>>(), Scheduler.nextTick);
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
        if (this.currentState === DriverState.Connected || this.currentState === DriverState.Connecting) return;
        // Bootstrap plugins here

        this._currentRequests.clear();
        this._driver.connect();
    }

    public disconnect() {
        this._driver.disconnect();
    }

    public request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Observable<TResponse> {
        if (!options) options = <OmniSharp.RequestOptions>{};
        defaults(options, { oneBasedIndices: this._options.oneBasedIndices });

        // Handle disconnected requests
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            return Observable.create((response: Subscriber<TResponse>) => {
                this.state
                    .filter(z => z === DriverState.Connected)
                    .take(1)
                    .subscribe(z => {
                        this.request<TRequest, TResponse>(action, request, options)
                            .subscribe(x => response.next(x));
                    });
            });
        }

        const context = new RequestContext(this._uniqueId, action, request, options);
        this._requestStream.next(context);

        return context.getResponse<TResponse>(this._responseStream);
    }

    private setupObservers() {
        this._driver.events.subscribe(x => {
            if (this._eventWatchers.has(x.Event))
                this._eventWatchers.get(x.Event).next(x.Body);
        });

        this._enqueuedResponses.subscribe(x => {
            if (!x.silent && this._commandWatchers.has(x.command))
                this._commandWatchers.get(x.command).next(x);
        });
    }

    protected watchEvent = memoize(<TBody>(event: string): Observable<TBody> => {
        const subject = new Subject<CommandContext<any>>();
        this._eventWatchers.set(event, subject);
        this._disposable.add(subject);
        return <any>subject.share();
    });

    protected watchCommand = memoize((command: string): Observable<OmniSharp.Context<any, any>> => {
        const subject = new Subject<ResponseContext<any, any>>();
        this._commandWatchers.set(command.toLowerCase(), subject);
        this._disposable.add(subject);
        return subject.share();
    });

    private _fixups: Array<(action: string, request: any, options?: OmniSharp.RequestOptions) => void> = [];
    public registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void) {
        this._fixups.push(func);
    }

    /* tslint:disable:no-unused-variable */
    private _fixup<TRequest>(action: string, request: TRequest, options?: OmniSharp.RequestOptions) {
        each(this._fixups, f => f(action, request, options));
    }
    /* tslint:enable:no-unused-variable */
}

export class ClientEventsBase implements OmniSharp.Events {
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

    /* tslint:disable:no-unused-variable */
    private watchEvent(event: string): Observable<any> {
        return (<any>this._client).watchEvent(event);
    }

    private watchCommand(command: string): Observable<any> {
        return (<any>this._client).watchCommand(command);
    }
    /* tslint:enable:no-unused-variable */
}
