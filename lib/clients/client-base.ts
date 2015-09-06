import {Observable, Subject, AsyncSubject, BehaviorSubject, Scheduler, CompositeDisposable} from "rx";
import {extend, isObject, some, uniqueId, isArray, each, intersection, keys, filter, isNumber, has, get, set, defaults} from "lodash";
import {IDriver, IStaticDriver, IDriverOptions, OmnisharpClientStatus, OmnisharpClientOptions} from "../interfaces";
import {Driver, DriverState} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "./contexts";
import {serverLineNumbers, serverLineNumberArrays} from "./response-handling";

var normalCommands = [
    'findimplementations', 'findsymbols',/*'findusages',*/
    'gotodefinition', 'gotofile', 'gotoregion', 'typelookup',
    'navigateup', 'navigatedown', 'projects', 'project',
    'autocomplete', 'getcodeactions', 'highlight', 'runcodeaction',
    'signatureHelp', 'packagesearch', 'packagesource', 'packageversion',
    'formatRange','codecheck'
];
var priorityCommands = [
    'updatebuffer', 'changebuffer', 'filesChanged', 'formatAfterKeystroke'
];
var undeferredCommands = normalCommands.concat(priorityCommands);

function flattenArguments(obj, prefix = '') {
    var result: any[] = [];
    each(obj, (value, key) => {
        if (isObject(value)) {
            result.push(...flattenArguments(value, `${prefix ? prefix + ':' : ''}${key[0].toUpperCase() + key.substr(1) }`));
            return
        }

        result.push(`--${prefix ? prefix + ':' : ''}${key[0].toUpperCase() + key.substr(1) }=${value}`);
    });

    return result;
}

export class ClientBase implements IDriver, OmniSharp.Events, Rx.IDisposable {
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

    public static fromClient<T extends ClientBase>(ctor: any, client: ClientBase) {
        var v1: ClientBase = <any>new ctor(client._options);

        v1._driver = client._driver;
        v1._requestStream = client._requestStream;
        v1._responseStream = client._responseStream;
        v1._statusStream = client._statusStream;
        v1._errorStream = client._errorStream;
        v1._customEvents = client._customEvents;
        v1._uniqueId = client._uniqueId;
        v1._disposable = client._disposable;

        v1.setupObservers();

        return <T>v1;
    }

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }

    public get currentState() { return this._driver.currentState; }
    private _enqueuedEvents: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._enqueuedEvents; }
    public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._driver.commands; }
    public get state(): Rx.Observable<DriverState> { return this._driver.state; }
    public get outstandingRequests() { return this._driver.outstandingRequests; }

    public get status(): Rx.Observable<OmnisharpClientStatus> { return this._statusStream; }
    public get requests(): Rx.Observable<RequestContext<any>> { return this._requestStream; }

    private _enqueuedResponses: Rx.Observable<ResponseContext<any, any>>;
    public get responses(): Rx.Observable<ResponseContext<any, any>> { return this._enqueuedResponses; }
    public get errors(): Rx.Observable<CommandContext<any>> { return this._errorStream; }

    constructor(private _options: OmnisharpClientOptions = {}) {
        var driver = _options.driver || Driver.Stdio;
        var statusSampleTime = _options.statusSampleTime || (_options.statusSampleTime = 500);
        var responseSampleTime = _options.responseSampleTime || (_options.responseSampleTime = 200);
        var responseConcurrency = _options.responseConcurrency || (_options.responseConcurrency = 4);

        _options.additionalArguments = flattenArguments(_options.omnisharp || {});

        var driverFactory: IStaticDriver = require('../drivers/' + Driver[driver].toLowerCase());
        this._driver = new driverFactory(_options);

        this._disposable.add(this._driver);
        this._disposable.add(this._requestStream);
        this._disposable.add(this._responseStream);
        this._disposable.add(this._errorStream);
        this._disposable.add(this._customEvents);

        var ee = Observable.merge(this._customEvents, this._driver.events)
            .map(event => {
                if (isObject(event.Body)) {
                    Object.freeze(event.Body);
                }
                return Object.freeze(event);
            });

        this._enqueuedEvents = ee
            .window(ee.throttle(responseSampleTime), () => Observable.timer(responseSampleTime))
            .merge(responseConcurrency);


        var er = Observable.merge(
            this._responseStream,
            this._driver.commands
                .map(packet => new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, 'command'), packet.Body)));

        this._enqueuedResponses = er
            .window(er.throttle(responseSampleTime), () => Observable.timer(responseSampleTime))
            .merge(responseConcurrency);

        this._lowestIndexValue = _options.oneBasedIndices ? 1 : 0;

        var getStatusValues = () => <OmnisharpClientStatus>({
            state: this._driver.currentState,
            outgoingRequests: this._driver.outstandingRequests,
            hasOutgoingRequests: this._driver.outstandingRequests > 0
        });

        var status = Observable.merge(<Observable<any>>this._requestStream, <Observable<any>>this._responseStream)
            .map(() => getStatusValues());
        var tstatus = status.throttle(statusSampleTime).share();

        this._statusStream = Observable.merge(status, tstatus)
            .buffer(tstatus, () => Observable.timer(statusSampleTime))
            .map(x => x.length > 0 ? (x[x.length - 1]) : getStatusValues())
            .distinctUntilChanged()
            .map(Object.freeze)
            .share();

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

        this.setupRequestStreams();
        this.setupObservers();
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

        // These are operations that should wait until after
        // we have executed all the current priority commands
        var deferredQueue = this._requestStream
            .where(z => !some(undeferredCommands, x => x === z.command))
            .pausableBuffered(pauser)
            .map(x => Observable.just(x))
            .merge(Math.max(Math.floor(this._options.responseConcurrency / 2), 1))
            .subscribe(request => this.handleResult(request));

        // We just pass these operations through as soon as possible
        var normalQueue = this._requestStream
            .where(z => some(normalCommands, x => x === z.command))
            .map(x => Observable.just(x))
            .merge(this._options.responseConcurrency)
            .subscribe(request => this.handleResult(request))

        // We must wait for these commands
        // And these commands must run in order.
        var priorityQueue = this._requestStream
            .where(z => some(priorityCommands, x => x === z.command))
            .doOnNext(() => priorityRequests.onNext(priorityRequests.getValue() + 1))
            .controlled();

        priorityQueue
            .map(request => this.handleResult(request))
            .subscribe(response => {
                response
                    .subscribeOnCompleted(() => {
                        priorityResponses.onNext(priorityResponses.getValue() + 1)
                        priorityQueue.request(1);
                    });
            });

        // We need to have a pending request to catch the first one coming in.
        priorityQueue.request(1);
    }

    private handleResult(context: RequestContext<any>) {
        var result = this._driver.request<any, any>(context.command, context.request);

        result.subscribe((data) => {
            this._responseStream.onNext(new ResponseContext(context, data));
        }, (error) => {
            this._errorStream.onNext(new CommandContext(context.command, error));
        });

        return result;
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

    public connect(_options?: OmnisharpClientOptions) {
        // There is no return from error for this client
        if (this.currentState === DriverState.Error) return;
        if (this.currentState === DriverState.Connected || this.currentState === DriverState.Connecting) return;

        if (_options && _options.omnisharp) {
            _options.additionalArguments = flattenArguments(_options.omnisharp || {});
        }

        var driver = this._options.driver;
        extend(this._options, _options || {});
        this._options.driver = driver;
        this._driver.connect(this._options);
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

    protected setupObservers() {
        this._driver.events.subscribe(x => {
            if (this._eventWatchers.has(x.Event))
                this._eventWatchers.get(x.Event).onNext(x.Body);
        });

        this._enqueuedResponses.subscribe(x => {
            if (!x.silent && this._commandWatchers.has(x.command))
                this._commandWatchers.get(x.command).onNext(x);
        });

        this.projectAdded = this.watchEvent<OmniSharp.Models.ProjectInformationResponse>("ProjectAdded");
        this.projectChanged = this.watchEvent<OmniSharp.Models.ProjectInformationResponse>("ProjectChanged");
        this.projectRemoved = this.watchEvent<OmniSharp.Models.ProjectInformationResponse>("ProjectRemoved");
        this.error = this.watchEvent<OmniSharp.Models.ErrorMessage>("ProjectRemoved");
        this.msBuildProjectDiagnostics = this.watchEvent<OmniSharp.Models.MSBuildProjectDiagnostics>("MsBuildProjectDiagnostics");
        this.packageRestoreStarted = this.watchEvent<OmniSharp.Models.PackageRestoreMessage>("PackageRestoreStarted");
        this.packageRestoreFinished = this.watchEvent<OmniSharp.Models.PackageRestoreMessage>("PackageRestoreFinished");
        this.unresolvedDependencies = this.watchEvent<OmniSharp.Models.UnresolvedDependenciesMessage>("UnresolvedDependencies");
    }

    protected watchEvent<TBody>(event: string): Observable<TBody> {
        var subject = new Subject<CommandContext<any>>();
        this._eventWatchers.set(event, subject);
        this._disposable.add(subject);
        return <any>subject.asObservable().share();
    }

    protected watchCommand(command: string): Observable<OmniSharp.Context<any, any>> {
        var subject = new Subject<ResponseContext<any, any>>();
        this._commandWatchers.set(command, subject);
        this._disposable.add(subject);
        return subject.asObservable().share();
    }

    public projectAdded: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectChanged: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectRemoved: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public error: Rx.Observable<OmniSharp.Models.ErrorMessage>;
    public msBuildProjectDiagnostics: Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    public packageRestoreStarted: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    public packageRestoreFinished: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    public unresolvedDependencies: Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;

}
