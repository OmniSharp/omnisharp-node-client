import {Observable, Subject, AsyncSubject, BehaviorSubject, Scheduler, CompositeDisposable} from "rx";
import {extend, isObject, some, uniqueId, isArray, each, intersection, keys, filter, isNumber, has, get, set, defaults, cloneDeep, memoize} from "lodash";
import {IDriver, IStaticDriver, IDriverOptions, OmnisharpClientStatus, OmnisharpClientOptions} from "../interfaces";
import {Driver, DriverState} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import {serverLineNumbers, serverLineNumberArrays} from "../response-handling";
import {ensureClientOptions, flattenArguments} from "../options";
import {watchEvent, reference} from "../decorators";

(function() {
    // Temp code, remove with 4.0.0
    var Rx = require('rx');
    Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
        return new Rx.FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
    };
    var FlatMapObservable = Rx.FlatMapObservable = (function(__super__) {

        Rx.internals.inherits(FlatMapObservable, __super__);

        function FlatMapObservable(source, selector, resultSelector, thisArg) {
            this.resultSelector = Rx.helpers.isFunction(resultSelector) ? resultSelector : null;
            this.selector = Rx.internals.bindCallback(Rx.helpers.isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
            this.source = source;
            __super__.call(this);
        }

        FlatMapObservable.prototype.subscribeCore = function(o) {
            return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
        };

        Rx.internals.inherits(InnerObserver, Rx.internals.AbstractObserver);
        function InnerObserver(observer, selector, resultSelector, source) {
            this.i = 0;
            this.selector = selector;
            this.resultSelector = resultSelector;
            this.source = source;
            this.o = observer;
            Rx.internals.AbstractObserver.call(this);
        }

        InnerObserver.prototype._wrapResult = function(result, x, i) {
            return this.resultSelector ?
                result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
                result;
        };

        InnerObserver.prototype.next = function(x) {
            var i = this.i++;
            var result = Rx.internals.tryCatch(this.selector)(x, i, this.source);
            //if (result === errorObj) { return this.o.onError(result.e); }

            Rx.helpers.isPromise(result) && (result = Rx.Observable.fromPromise(result));
            (Rx.helpers.isArrayLike(result) || Rx.helpers.isIterable(result)) && (result = Rx.Observable.from(result));
            this.o.onNext(this._wrapResult(result, x, i));
        };

        InnerObserver.prototype.error = function(e) { this.o.onError(e); };

        InnerObserver.prototype.onCompleted = function() { this.o.onCompleted(); };

        return FlatMapObservable;

    } (Rx.ObservableBase));
})();


var {isPriorityCommand, isNormalCommand, isDeferredCommand} = (function() {
    var normalCommands = [
        'findimplementations', 'findsymbols', 'findusages',
        'gotodefinition', 'typelookup', 'navigateup',
        'navigatedown', 'getcodeactions', 'filesChanged',
        'runcodeaction', 'autocomplete', 'signatureHelp'
    ];
    var priorityCommands = [
        'updatebuffer', 'changebuffer', 'formatAfterKeystroke'
    ];

    var prioritySet = new Set<string>();
    var normalSet = new Set<string>();
    var deferredSet = new Set<string>();
    var undeferredSet = new Set<string>();

    each(normalCommands, x => {
        normalSet.add(x);
        undeferredSet.add(x);
    });

    each(priorityCommands, x => {
        prioritySet.add(x);
        undeferredSet.add(x);
    });

    var isPriorityCommand = (request: RequestContext<any>) => prioritySet.has(request.command);
    var isNormalCommand = (request: RequestContext<any>) => !isDeferredCommand(request) && normalSet.has(request.command);

    function isDeferredCommand(request: RequestContext<any>) {
        if (request.silent && !isPriorityCommand(request)) {
            return true;
        }

        if (deferredSet.has(request.command)) {
            return true;
        }

        if (undeferredSet.has(request.command)) {
            return false;
        }

        deferredSet.add(request.command);
        return true;
    }

    return { isPriorityCommand, isNormalCommand, isDeferredCommand };
})()

export class ClientBase<TEvents extends ClientEventsBase> implements IDriver, Rx.IDisposable {
    private _driver: IDriver;
    private _requestStream = new Subject<RequestContext<any>>();
    private _responseStream = new Subject<ResponseContext<any, any>>();
    private _statusStream: Rx.Observable<OmnisharpClientStatus>;
    private _errorStream = new Subject<CommandContext<any>>();
    private _customEvents = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();
    private _uniqueId = uniqueId("client");
    protected _lowestIndexValue: number;
    private _eventWatchers = new Map<string, Subject<CommandContext<any>>>();
    private _commandWatchers = new Map<string, Subject<ResponseContext<any, any>>>();
    private _disposable = new CompositeDisposable();

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }

    public get currentState() { return this._driver.currentState; }
    private _enqueuedEvents: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._enqueuedEvents; }
    public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._driver.commands; }
    public get state(): Rx.Observable<DriverState> { return this._driver.state; }

    public get outstandingRequests() { return this._currentRequests.size; }

    private _currentRequests = new Set<RequestContext<any>>();
    public getCurrentRequests() {
        var response: {
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

    public get status(): Rx.Observable<OmnisharpClientStatus> { return this._statusStream; }
    public get requests(): Rx.Observable<RequestContext<any>> { return this._requestStream; }

    private _enqueuedResponses: Rx.Observable<ResponseContext<any, any>>;
    public get responses(): Rx.Observable<ResponseContext<any, any>> { return this._enqueuedResponses; }
    public get errors(): Rx.Observable<CommandContext<any>> { return this._errorStream; }

    private _observe: TEvents;
    public get observe(): TEvents { return this._observe; }

    constructor(private _options: OmnisharpClientOptions, observableFactory: (client: ClientBase<TEvents>) => TEvents) {
        _options.driver = _options.driver || Driver.Stdio;
        ensureClientOptions(_options);
        var {driver, statusSampleTime, responseSampleTime, concurrency, timeout, concurrencyTimeout} = _options;

        var driverFactory: IStaticDriver = require('../drivers/' + Driver[driver].toLowerCase());
        this._driver = new driverFactory(_options);

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
                .map(packet => new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, 'command'), packet.Body)));

        this._lowestIndexValue = _options.oneBasedIndices ? 1 : 0;

        this._disposable.add(this._requestStream.subscribe(x => this._currentRequests.add(x)));

        var getStatusValues = () => <OmnisharpClientStatus>({
            state: this._driver.currentState,
            outgoingRequests: this.outstandingRequests,
            hasOutgoingRequests: this.outstandingRequests > 0
        });

        this.setupRequestStreams();
        this.setupObservers();

        var status = Observable.merge(<Observable<any>>this._requestStream, <Observable<any>>this._responseStream);

        this._statusStream = status
            .delay(10)
            .map(getStatusValues)
            .distinctUntilChanged()
            .map(Object.freeze)
            .share();

        this._observe = observableFactory(this);

        if (this._options.debug) {
            this._disposable.add(this._responseStream.subscribe(Context => {
                // log our complete response time
                this._customEvents.onNext({
                    Event: "log",
                    Body: {
                        Message: `/${Context.command}  ${Context.responseTime}ms (round trip)`,
                        LogLevel: "INFORMATION"
                    },
                    Seq: -1,
                    Type: "log"
                })
            }));
        }
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this.disconnect();
        this._disposable.dispose();
    }

    private setupRequestStreams() {
        var priorityRequests = new BehaviorSubject(0), priorityResponses = new BehaviorSubject(0);

        var pauser = Observable.combineLatest(
            priorityRequests,
            priorityResponses,
            (requests, responses) => {
                if (requests > 0 && responses === requests) {
                    priorityRequests.onNext(0);
                    priorityResponses.onNext(0);
                    return true;
                } else if (requests > 0) {
                    return false;
                }

                return true;
            })
            .startWith(true)
            .debounce(120);

        // Keep deferred concurrency at a min of two, this lets us get around long running requests jamming the pipes.
        var deferredConcurrency = Math.max(Math.floor(this._options.concurrency / 4), 2);

        // These are operations that should wait until after
        // we have executed all the current priority commands
        // We also defer silent commands to this queue, as they are generally for "background" work
        var deferredQueue = this._requestStream
            .where(isDeferredCommand)
            .pausableBuffered(pauser)
            .map(request => Observable.defer(() => this.handleResult(request)))
            .merge(deferredConcurrency);

        // We just pass these operations through as soon as possible
        var normalQueue = this._requestStream
            .where(isNormalCommand)
            .pausableBuffered(pauser)
            .map(request => Observable.defer(() => this.handleResult(request)))
            .merge(this._options.concurrency);

        // We must wait for these commands
        // And these commands must run in order.
        var priorityQueueController = this._requestStream
            .where(isPriorityCommand)
            .doOnNext(() => priorityRequests.onNext(priorityRequests.getValue() + 1))
            .controlled();

        var priorityQueue = priorityQueueController
            .map(request => Observable.defer(() => this.handleResult(request))
                .tapOnCompleted(() => {
                    priorityResponses.onNext(priorityResponses.getValue() + 1);
                    priorityQueueController.request(1);
                })
            )
            .merge(this._options.concurrency);

        this._disposable.add(Observable.merge(deferredQueue, normalQueue, priorityQueue).subscribe());
        // We need to have a pending request to catch the first one coming in.
        priorityQueueController.request(1);
    }

    private handleResult(context: RequestContext<any>): Observable<ResponseContext<any, any>> {
        // TODO: Find a way to not repeat the same commands, if there are outstanding (timed out) requests.
        // In some cases for example find usages has taken over 30 seconds, so we shouldn't hit the server with multiple of these requests (as we slam the cpU)
        var result = <Observable<ResponseContext<any, any>>>this._driver.request<any, any>(context.command, context.request);

        result.subscribe((data) => {
            !this._responseStream.isDisposed && this._responseStream.onNext(new ResponseContext(context, data));
        }, (error) => {
            !this._errorStream.isDisposed && this._errorStream.onNext(new CommandContext(context.command, error));
            !this._responseStream.isDisposed && this._responseStream.onNext(new ResponseContext(context, null, true));
            this._currentRequests.delete(context);
        }, () => {
            this._currentRequests.delete(context);
        });

        return result
            // This timeout doesn't prevent the request from completing
            // It simply unblocks the queue, so we can continue to process items.
            .timeout(this._options.concurrencyTimeout, Scheduler.timeout)
            .onErrorResumeNext(Observable.empty<ResponseContext<any, any>>());
    }

    public static serverLineNumbers = serverLineNumbers;
    public static serverLineNumberArrays = serverLineNumberArrays;

    public log(message: string, logLevel?: string) {
        // log our complete response time
        this._customEvents.onNext({
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

        this._currentRequests.clear();
        this._driver.connect();
    }

    public disconnect() {
        this._driver.disconnect();
    }

    public request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Rx.Observable<TResponse> {
        if (!options) options = <OmniSharp.RequestOptions>{};
        defaults(options, { oneBasedIndices: this._options.oneBasedIndices });

        // Handle disconnected requests
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            var response = new AsyncSubject<TResponse>();

            var sub = this.state.where(z => z === DriverState.Connected).subscribe(z => {
                sub.dispose();
                this.request<TRequest, TResponse>(action, request, options).subscribe(z => response.onNext(z));
            });

            return response;
        }

        var Context = new RequestContext(this._uniqueId, action, request, options);
        this._requestStream.onNext(Context);

        return Context.getResponse<TResponse>(this._responseStream);
    }

    private setupObservers() {
        this._driver.events.subscribe(x => {
            if (this._eventWatchers.has(x.Event))
                this._eventWatchers.get(x.Event).onNext(x.Body);
        });

        this._enqueuedResponses.subscribe(x => {
            if (!x.silent && this._commandWatchers.has(x.command))
                this._commandWatchers.get(x.command).onNext(x);
        });
    }

    protected watchEvent = memoize(<TBody>(event: string): Observable<TBody> => {
        var subject = new Subject<CommandContext<any>>();
        this._eventWatchers.set(event, subject);
        this._disposable.add(subject);
        return <any>subject.share();
    });

    protected watchCommand = memoize((command: string): Observable<OmniSharp.Context<any, any>> => {
        var subject = new Subject<ResponseContext<any, any>>();
        this._commandWatchers.set(command.toLowerCase(), subject);
        this._disposable.add(subject);
        return subject.share();
    });

    private _fixups: Array<(action: string, request: any, options?: OmniSharp.RequestOptions) => void> = [];
    public registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void) {
        this._fixups.push(func);
    }

    private _fixup<TRequest>(action: string, request: TRequest, options?: OmniSharp.RequestOptions) {
        each(this._fixups, f => f(action, request, options));
    }
}

export class ClientEventsBase implements OmniSharp.Events {
    constructor(private _client: any) { }

    public get uniqueId() { return this._client.uniqueId }

    @watchEvent public get projectAdded(): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); }
    @watchEvent public get projectChanged(): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); }
    @watchEvent public get projectRemoved(): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); }
    @watchEvent public get error(): Rx.Observable<OmniSharp.Models.ErrorMessage> { throw new Error('Implemented by decorator'); }
    @watchEvent public get msBuildProjectDiagnostics(): Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics> { throw new Error('Implemented by decorator'); }
    @watchEvent public get packageRestoreStarted(): Rx.Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error('Implemented by decorator'); }
    @watchEvent public get packageRestoreFinished(): Rx.Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error('Implemented by decorator'); }
    @watchEvent public get unresolvedDependencies(): Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage> { throw new Error('Implemented by decorator'); }

    @reference public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { throw new Error("Implemented by decorator"); }
    @reference public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { throw new Error("Implemented by decorator"); }
    @reference public get state(): Rx.Observable<DriverState> { throw new Error("Implemented by decorator"); }
    @reference public get status(): Rx.Observable<OmnisharpClientStatus> { throw new Error("Implemented by decorator"); }
    @reference public get requests(): Rx.Observable<RequestContext<any>> { throw new Error("Implemented by decorator"); }
    @reference public get responses(): Rx.Observable<ResponseContext<any, any>> { throw new Error("Implemented by decorator"); }
    @reference public get errors(): Rx.Observable<CommandContext<any>> { throw new Error("Implemented by decorator"); }

    private watchEvent(event: string): Observable<any> {
        return (<any>this._client).watchEvent(event);
    }

    private watchCommand(command: string): Observable<any> {
        return (<any>this._client).watchCommand(command);
    }
}
