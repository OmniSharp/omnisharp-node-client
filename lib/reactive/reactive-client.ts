import * as OmniSharp from '../omnisharp-server';
import { Observable, Subject, AsyncSubject, BehaviorSubject, Subscription } from 'rxjs';
import { IDisposable, CompositeDisposable } from 'ts-disposables';
import { keys, bind, uniqueId, each, defaults, cloneDeep } from 'lodash';
import { IReactiveDriver, IDriverOptions, OmnisharpClientStatus, ReactiveClientOptions, InternalReactiveClientOptions } from '../enums';
import { DriverState, Runtime } from '../enums';
import { RequestContext, ResponseContext, CommandContext } from '../contexts';
import { ensureClientOptions } from '../options';
import { isPriorityCommand, isNormalCommand, isDeferredCommand } from '../helpers/prioritization';
import { createObservable } from '../operators/create';
import { getPreconditions } from '../helpers/preconditions';
import { reference, setEventOrResponse, getInternalValue, request, response, event } from '../helpers/decorators';

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

export class ReactiveClient implements IReactiveDriver, IDisposable {
    private _driver: IReactiveDriver;
    private _requestStream = new Subject<RequestContext<any>>();
    private _responseStream = new Subject<ResponseContext<any, any>>();
    private _responseStreams = new Map<string, Subject<ResponseContext<any, any>>>();
    private _statusStream: Observable<OmnisharpClientStatus>;
    private _errorStream = new Subject<CommandContext<any>>();
    private _uniqueId = uniqueId('client');
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

    private _options: InternalReactiveClientOptions & IDriverOptions;

    constructor(_options: ReactiveClientOptions) {
        _options.driver = _options.driver || ((options: IDriverOptions) => {
            const item = require('../drivers/stdio');
            const driverFactory = item[keys(item)[0]];
            return new driverFactory(this._options);
        });

        this._options = <any>defaults(_options, <IDriverOptions>{
            projectPath: '',
            onState: bind(this._stateStream.next, this._stateStream),
            onEvent: bind(this._eventsStream.next, this._eventsStream),
            onCommand: (packet) => {
                const response = new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, 'command'), packet.Body);
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
                    Event: 'log',
                    Body: {
                        Message: `/${context.command}  ${context.responseTime}ms (round trip)`,
                        LogLevel: 'INFORMATION'
                    },
                    Seq: -1,
                    Type: 'log'
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
            }
        }, () => {
            this._currentRequests.delete(context);
            if (complete) {
                complete();
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
            Event: 'log',
            Body: {
                Message: message,
                LogLevel: logLevel ? logLevel.toUpperCase() : 'INFORMATION'
            },
            Seq: -1,
            Type: 'log'
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

    public request<TRequest, TResponse>(action: string, request?: TRequest, options?: OmniSharp.RequestOptions): Observable<TResponse> {
        let conditions = getPreconditions(action);
        if (conditions) { each(conditions, x => x(request)); }

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

        const context = new RequestContext(this._uniqueId, action, request!, options);
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

        return this._responseStreams.get(key)!;
    }

    private _fixup<TRequest>(action: string, request: TRequest, options?: OmniSharp.RequestOptions) {
        each(this._fixups, f => f(action, request, options));
    }
}

export interface ReactiveClient extends OmniSharp.Api.V2 { }

export class ReactiveClientEvents {
    constructor(private _client: ReactiveClient) { }

    public get uniqueId() { return this._client.uniqueId; }

    public listen(key: string): Observable<any> {
        const value = getInternalValue(this, key);
        if (!value) {
            return setEventOrResponse(this, key);
        }
        return value;
    }
}

export interface ReactiveClientEvents extends OmniSharp.Events.V2, OmniSharp.Events {
    /*readonly*/ events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    /*readonly*/ commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    /*readonly*/ state: Observable<DriverState>;
    /*readonly*/ status: Observable<OmnisharpClientStatus>;
    /*readonly*/ requests: Observable<RequestContext<any>>;
    /*readonly*/ responses: Observable<ResponseContext<any, any>>;
    /*readonly*/ errors: Observable<CommandContext<any>>;
}

reference(ReactiveClientEvents.prototype, 'events', 'events');
reference(ReactiveClientEvents.prototype, 'commands', 'commands');
reference(ReactiveClientEvents.prototype, 'state', 'state');
reference(ReactiveClientEvents.prototype, 'status', 'status');
reference(ReactiveClientEvents.prototype, 'requests', 'requests');
reference(ReactiveClientEvents.prototype, 'responses', 'responses');
reference(ReactiveClientEvents.prototype, 'errors', 'errors');


// <#GENERATED />
request(ReactiveClient.prototype, "getteststartinfo");
request(ReactiveClient.prototype, "runtest");
request(ReactiveClient.prototype, "autocomplete");
request(ReactiveClient.prototype, "changebuffer");
request(ReactiveClient.prototype, "codecheck");
request(ReactiveClient.prototype, "codeformat");
request(ReactiveClient.prototype, "diagnostics");
request(ReactiveClient.prototype, "close");
request(ReactiveClient.prototype, "open");
request(ReactiveClient.prototype, "filesChanged");
request(ReactiveClient.prototype, "findimplementations");
request(ReactiveClient.prototype, "findsymbols");
request(ReactiveClient.prototype, "findusages");
request(ReactiveClient.prototype, "fixusings");
request(ReactiveClient.prototype, "formatAfterKeystroke");
request(ReactiveClient.prototype, "formatRange");
request(ReactiveClient.prototype, "getcodeactions");
request(ReactiveClient.prototype, "gotodefinition");
request(ReactiveClient.prototype, "gotofile");
request(ReactiveClient.prototype, "gotoregion");
request(ReactiveClient.prototype, "highlight");
request(ReactiveClient.prototype, "currentfilemembersasflat");
request(ReactiveClient.prototype, "currentfilemembersastree");
request(ReactiveClient.prototype, "metadata");
request(ReactiveClient.prototype, "navigatedown");
request(ReactiveClient.prototype, "navigateup");
request(ReactiveClient.prototype, "packagesearch");
request(ReactiveClient.prototype, "packagesource");
request(ReactiveClient.prototype, "packageversion");
request(ReactiveClient.prototype, "rename");
request(ReactiveClient.prototype, "runcodeaction");
request(ReactiveClient.prototype, "signatureHelp");
request(ReactiveClient.prototype, "gettestcontext");
request(ReactiveClient.prototype, "typelookup");
request(ReactiveClient.prototype, "updatebuffer");
request(ReactiveClient.prototype, "project");
request(ReactiveClient.prototype, "projects");
request(ReactiveClient.prototype, "checkalivestatus");
request(ReactiveClient.prototype, "checkreadystatus");
request(ReactiveClient.prototype, "stopserver");
response(ReactiveClientEvents.prototype, "getteststartinfo", "/v2/getteststartinfo");
response(ReactiveClientEvents.prototype, "runtest", "/v2/runtest");
response(ReactiveClientEvents.prototype, "autocomplete", "/autocomplete");
response(ReactiveClientEvents.prototype, "changebuffer", "/changebuffer");
response(ReactiveClientEvents.prototype, "codecheck", "/codecheck");
response(ReactiveClientEvents.prototype, "codeformat", "/codeformat");
response(ReactiveClientEvents.prototype, "diagnostics", "/diagnostics");
response(ReactiveClientEvents.prototype, "close", "/close");
response(ReactiveClientEvents.prototype, "open", "/open");
response(ReactiveClientEvents.prototype, "filesChanged", "/filesChanged");
response(ReactiveClientEvents.prototype, "findimplementations", "/findimplementations");
response(ReactiveClientEvents.prototype, "findsymbols", "/findsymbols");
response(ReactiveClientEvents.prototype, "findusages", "/findusages");
response(ReactiveClientEvents.prototype, "fixusings", "/fixusings");
response(ReactiveClientEvents.prototype, "formatAfterKeystroke", "/formatAfterKeystroke");
response(ReactiveClientEvents.prototype, "formatRange", "/formatRange");
response(ReactiveClientEvents.prototype, "getcodeactions", "/v2/getcodeactions");
response(ReactiveClientEvents.prototype, "gotodefinition", "/gotodefinition");
response(ReactiveClientEvents.prototype, "gotofile", "/gotofile");
response(ReactiveClientEvents.prototype, "gotoregion", "/gotoregion");
response(ReactiveClientEvents.prototype, "highlight", "/highlight");
response(ReactiveClientEvents.prototype, "currentfilemembersasflat", "/currentfilemembersasflat");
response(ReactiveClientEvents.prototype, "currentfilemembersastree", "/currentfilemembersastree");
response(ReactiveClientEvents.prototype, "metadata", "/metadata");
response(ReactiveClientEvents.prototype, "navigatedown", "/navigatedown");
response(ReactiveClientEvents.prototype, "navigateup", "/navigateup");
response(ReactiveClientEvents.prototype, "packagesearch", "/packagesearch");
response(ReactiveClientEvents.prototype, "packagesource", "/packagesource");
response(ReactiveClientEvents.prototype, "packageversion", "/packageversion");
response(ReactiveClientEvents.prototype, "rename", "/rename");
response(ReactiveClientEvents.prototype, "runcodeaction", "/v2/runcodeaction");
response(ReactiveClientEvents.prototype, "signatureHelp", "/signatureHelp");
response(ReactiveClientEvents.prototype, "gettestcontext", "/gettestcontext");
response(ReactiveClientEvents.prototype, "typelookup", "/typelookup");
response(ReactiveClientEvents.prototype, "updatebuffer", "/updatebuffer");
response(ReactiveClientEvents.prototype, "project", "/project");
response(ReactiveClientEvents.prototype, "projects", "/projects");
response(ReactiveClientEvents.prototype, "checkalivestatus", "/checkalivestatus");
response(ReactiveClientEvents.prototype, "checkreadystatus", "/checkreadystatus");
response(ReactiveClientEvents.prototype, "stopserver", "/stopserver");
event(ReactiveClientEvents.prototype, "projectAdded");
event(ReactiveClientEvents.prototype, "projectChanged");
event(ReactiveClientEvents.prototype, "projectRemoved");
event(ReactiveClientEvents.prototype, "error");
event(ReactiveClientEvents.prototype, "diagnostic");
event(ReactiveClientEvents.prototype, "msBuildProjectDiagnostics");
event(ReactiveClientEvents.prototype, "packageRestoreStarted");
event(ReactiveClientEvents.prototype, "packageRestoreFinished");
event(ReactiveClientEvents.prototype, "unresolvedDependencies");
