import {Observable, Subject, AsyncSubject, BehaviorSubject, Scheduler} from "rx";
import {extend, isObject, some, uniqueId, isArray, each, intersection, keys, filter} from "lodash";
import {IDriver, IStaticDriver, IDriverOptions, OmnisharpClientStatus, OmnisharpClientOptions} from "../interfaces";
import {Driver, DriverState} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "./contexts";

var normalCommands = [
    'findimplementations', 'findsymbols', 'findusages',
    'gotodefinition', 'gotofile', 'gotoregion', 'typelookup',
    'navigateup', 'navigatedown', 'projects', 'project'
];
var priorityCommands = [
    'updatebuffer', 'changebuffer', 'filesChanged'
];
var undeferredCommands = normalCommands.concat(priorityCommands);

var serverLineNumbers = [
    'Line', 'Column',
    'Start', 'End',
    'StartLine', 'StartColumn',
    'EndLine', 'EndColumn',
    'SelectionStartColumn', 'SelectionStartLine',
    'SelectionEndColumn', 'SelectionEndLine'
];

export class ClientBase implements IDriver {
    private _driver: IDriver;
    private _requestStream = new Subject<RequestContext<any>>();
    private _responseStream = new Subject<ResponseContext<any, any>>();
    private _statusStream: Rx.Observable<OmnisharpClientStatus>;
    private _errorStream = new Subject<CommandContext<any>>();
    private _customEvents = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();
    private _uniqueId = uniqueId("client");
    private _events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    protected _lowestIndexValue: number;

    public static fromClient<T extends ClientBase>(ctor: any, client: ClientBase) {
        var v1: ClientBase = <any>new ctor(client._options);

        v1._driver = client._driver;
        v1._requestStream = client._requestStream;
        v1._responseStream = client._responseStream;
        v1._statusStream = client._statusStream;
        v1._errorStream = client._errorStream;
        v1._customEvents = client._customEvents;
        v1._uniqueId = client._uniqueId;
        v1._events = client._events;

        v1.setupObservers();

        return <T>v1;
    }

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }

    public get currentState() { return this._driver.currentState; }
    public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._events; }
    public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._driver.commands; }
    public get state(): Rx.Observable<DriverState> { return this._driver.state; }
    public get outstandingRequests() { return this._driver.outstandingRequests; }

    public get status(): Rx.Observable<OmnisharpClientStatus> { return this._statusStream; }
    public get requests(): Rx.Observable<RequestContext<any>> { return this._requestStream; }
    public get responses(): Rx.Observable<ResponseContext<any, any>> { return this._responseStream; }
    public get errors(): Rx.Observable<CommandContext<any>> { return this._errorStream; }

    constructor(private _options: OmnisharpClientOptions = {}) {
        var driver = _options.driver || Driver.Stdio;

        var driverFactory: IStaticDriver = require('../drivers/' + Driver[driver].toLowerCase());
        this._driver = new driverFactory(_options);
        this._events = Observable.merge(this._customEvents, this._driver.events)
            .map(event => {
                if (isObject(event.Body)) {
                    Object.freeze(event.Body);
                }
                return Object.freeze(event);
            })
            .share();

        this._lowestIndexValue = _options.oneBasedIndexes ? 1 : 0;

        var requestsPerSecond = this._requestStream
            .bufferWithTime(1000, 100)
            .select(x => x.length)
            .startWith(0);

        var responsesPerSecond = this._responseStream
            .bufferWithTime(1000, 100)
            .select(x => x.length)
            .startWith(0);

        var eventsPerSecond = this._driver.events
            .bufferWithTime(1000, 100)
            .select(x => x.length)
            .startWith(0);

        this._statusStream = Observable.combineLatest(
            requestsPerSecond,
            responsesPerSecond,
            eventsPerSecond,
            (requests, responses, events) => <OmnisharpClientStatus> ({
                state: this._driver.currentState,
                requestsPerSecond: requests,
                responsesPerSecond: responses,
                eventsPerSecond: events,
                operationsPerSecond: requests + responses + events,
                outgoingRequests: this._driver.outstandingRequests,
                hasOutgoingRequests: this._driver.outstandingRequests > 0
            }))
            .delaySubscription(0)
        //.sample(200)
            .map(Object.freeze)
            .distinctUntilChanged()
            .share();

        if (this._options.debug) {
            this._responseStream.subscribe(Context => {
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
            });
        }

        this.setupRequestStreams();
        this.setupObservers();
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
            .subscribe(request => this.handleResult(request));

        // We just pass these operations through as soon as possible
        var normalQueue = this._requestStream
            .where(z => some(normalCommands, x => x === z.command))
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
            this._responseStream.onNext(new ResponseContext(context, this.responseMutator(data)));
        }, (error) => {
            this._errorStream.onNext(new CommandContext(context.command, error));
        });

        return result;
    }

    protected requestMutator(data: any) {
        // Assume one based indexes
        if (this._options.oneBasedIndexes)
            return data;

        if (isArray(data)) {
            each(data, item => this.requestMutator(item));
            return data;
        }

        var itemsToChange = intersection(serverLineNumbers, keys(data));
        each(itemsToChange, key => data[key] = data[key] + 1);
        each(filter(data, z => isArray(z) || isObject(z)), item => this.requestMutator(item));

        return data;
    }

    protected responseMutator(data: any) {
        // Assume one based indexes
        if (this._options.oneBasedIndexes)
            return data;

        if (isArray(data)) {
            each(data, item => this.responseMutator(item));
            return data;
        }

        var itemsToChange = intersection(serverLineNumbers, keys(data));
        each(itemsToChange, key => data[key] = data[key] - 1);
        each(filter(data, z => isArray(z) || isObject(z)), item => this.requestMutator(item));

        return data;
    }

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

        // Handle disconnected requests
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            var response = new AsyncSubject<TResponse>();

            var sub = this.state.where(z => z === DriverState.Connected).subscribe(z => {
                sub.dispose();
                this.request<TRequest, TResponse>(action, this.requestMutator(request), options).subscribe(z => response.onNext(z));
            });

            return response;
        }

        var Context = new RequestContext(this._uniqueId, action, this.requestMutator(request), options);
        this._requestStream.onNext(Context);

        return Context.getResponse<TResponse>(this._responseStream);
    }

    protected setupObservers() {
        this.projectAdded = this._driver.events.filter(z => z.Event === "ProjectAdded").map(z => <OmniSharp.Models.ProjectInformationResponse>z.Body).share();
        this.projectChanged = this._driver.events.filter(z => z.Event === "ProjectChanged").map(z => <OmniSharp.Models.ProjectInformationResponse>z.Body).share();
        this.projectRemoved = this._driver.events.filter(z => z.Event === "ProjectRemoved").map(z => <OmniSharp.Models.ProjectInformationResponse>z.Body).share();
        this.error = this._driver.events.filter(z => z.Event === "Error").map(z => <OmniSharp.Models.ErrorMessage>z.Body).share();
        this.msBuildProjectDiagnostics = this._driver.events.filter(z => z.Event === "MsBuildProjectDiagnostics").map(z => <OmniSharp.Models.MSBuildProjectDiagnostics>z.Body).share();
        this.packageRestoreStarted = this._driver.events.filter(z => z.Event === "PackageRestoreStarted").map(z => <OmniSharp.Models.PackageRestoreMessage>z.Body).share();
        this.packageRestoreFinished = this._driver.events.filter(z => z.Event === "PackageRestoreFinished").map(z => <OmniSharp.Models.PackageRestoreMessage>z.Body).share();
        this.unresolvedDependencies = this._driver.events.filter(z => z.Event === "UnresolvedDependencies").map(z => <OmniSharp.Models.UnresolvedDependenciesMessage>z.Body).share();
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
