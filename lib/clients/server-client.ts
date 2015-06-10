import {Observable, Subject, AsyncSubject, BehaviorSubject, Scheduler} from "rx";
import {extend, isObject, some, uniqueId} from "lodash";
import {assert} from "chai";
//import {extend, uniqueId, some, endsWith, isObject, clone} from "lodash";
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

interface Context<TRequest, TResponse> extends OmniSharp.Context<TRequest, TResponse> {}

export class ServerClient implements OmniSharp.Api, OmniSharp.Events, IDriver {
    private _driver: IDriver;
    private _requestStream = new Subject<RequestContext<any>>();
    private _responseStream = new Subject<ResponseContext<any, any>>();
    private _statusStream: Rx.Observable<OmnisharpClientStatus>;
    private _errorStream = new Subject<CommandContext<any>>();
    private _customEvents = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();

    private _uniqueId = uniqueId("client");
    public get uniqueId() { return this._uniqueId; }

    public static DriverState = DriverState;

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }

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

    private handleResult(Context: RequestContext<any>) {
        var result = this._driver.request<any, any>(Context.command, Context.request);

        result.subscribe((data) => {
            this._responseStream.onNext(new ResponseContext(Context, data));
        }, (error) => {
            this._errorStream.onNext(new CommandContext(Context.command, error));
        });

        return result;
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
                this.request<TRequest, TResponse>(action, request, options).subscribe(z => response.onNext(z));
            });

            return response;
        }

        var Context = new RequestContext(this._uniqueId, action, request, options);
        this._requestStream.onNext(Context);

        return Context.getResponse<TResponse>(this._responseStream);
    }

    public get currentState() { return this._driver.currentState; }
    private _events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._events; }
    public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._driver.commands; }
    public get state(): Rx.Observable<DriverState> { return this._driver.state; }
    public get outstandingRequests() { return this._driver.outstandingRequests; }

    public get status(): Rx.Observable<OmnisharpClientStatus> { return this._statusStream; }
    public get requests(): Rx.Observable<RequestContext<any>> { return this._requestStream; }
    public get responses(): Rx.Observable<ResponseContext<any, any>> { return this._responseStream; }
    public get errors(): Rx.Observable<CommandContext<any>> { return this._errorStream; }

    private setupObservers() {
        var observerStream = this._responseStream.filter(z => !z.silent);
        this.observeUpdatebuffer = observerStream.filter(z => z.isCommand("updatebuffer")).share();
        this.observeChangebuffer = observerStream.filter(z => z.isCommand("changebuffer")).share();
        this.observeCodecheck = observerStream.filter(z => z.isCommand("codecheck")).share();
        this.observeFormatAfterKeystroke = observerStream.filter(z => z.isCommand("formatafterkeystroke")).share();
        this.observeFormatRange = observerStream.filter(z => z.isCommand("formatrange")).share();
        this.observeCodeformat = observerStream.filter(z => z.isCommand("codeformat")).share();
        this.observeAutocomplete = observerStream.filter(z => z.isCommand("autocomplete")).share();
        this.observeFindimplementations = observerStream.filter(z => z.isCommand("findimplementations")).share();
        this.observeFindsymbols = observerStream.filter(z => z.isCommand("findsymbols")).share();
        this.observeFindusages = observerStream.filter(z => z.isCommand("findusages")).share();
        this.observeGotodefinition = observerStream.filter(z => z.isCommand("gotodefinition")).share();
        this.observeNavigateup = observerStream.filter(z => z.isCommand("navigateup")).share();
        this.observeNavigatedown = observerStream.filter(z => z.isCommand("navigatedown")).share();
        this.observeRename = observerStream.filter(z => z.isCommand("rename")).share();
        this.observeSignatureHelp = observerStream.filter(z => z.isCommand("signaturehelp")).share();
        this.observeCheckalivestatus = observerStream.filter(z => z.isCommand("checkalivestatus")).share();
        this.observeCheckreadystatus = observerStream.filter(z => z.isCommand("checkreadystatus")).share();
        this.observeCurrentfilemembersastree = observerStream.filter(z => z.isCommand("currentfilemembersastree")).share();
        this.observeCurrentfilemembersasflat = observerStream.filter(z => z.isCommand("currentfilemembersasflat")).share();
        this.observeTypelookup = observerStream.filter(z => z.isCommand("typelookup")).share();
        this.observeFilesChanged = observerStream.filter(z => z.isCommand("fileschanged")).share();
        this.observeProjects = observerStream.filter(z => z.isCommand("projects")).share();
        this.observeProject = observerStream.filter(z => z.isCommand("project")).share();
        this.observeGetcodeactions = observerStream.filter(z => z.isCommand("getcodeactions")).share();
        this.observeRuncodeaction = observerStream.filter(z => z.isCommand("runcodeaction")).share();
        this.observeGettestcontext = observerStream.filter(z => z.isCommand("gettestcontext")).share();

        this.projectAdded = this._driver.events.filter(z => z.Event === "ProjectAdded").map(z => <OmniSharp.Models.ProjectInformationResponse>z.Body).share();
        this.projectChanged = this._driver.events.filter(z => z.Event === "ProjectChanged").map(z => <OmniSharp.Models.ProjectInformationResponse>z.Body).share();
        this.projectRemoved = this._driver.events.filter(z => z.Event === "ProjectRemoved").map(z => <OmniSharp.Models.ProjectInformationResponse>z.Body).share();
        this.error = this._driver.events.filter(z => z.Event === "Error").map(z => <OmniSharp.Models.ErrorMessage>z.Body).share();
        this.msBuildProjectDiagnostics = this._driver.events.filter(z => z.Event === "MsBuildProjectDiagnostics").map(z => <OmniSharp.Models.MSBuildProjectDiagnostics>z.Body).share();
        this.packageRestoreStarted = this._driver.events.filter(z => z.Event === "PackageRestoreStarted").map(z => <OmniSharp.Models.PackageRestoreMessage>z.Body).share();
        this.packageRestoreFinished = this._driver.events.filter(z => z.Event === "PackageRestoreFinished").map(z => <OmniSharp.Models.PackageRestoreMessage>z.Body).share();
        this.unresolvedDependencies = this._driver.events.filter(z => z.Event === "UnresolvedDependencies").map(z => <OmniSharp.Models.UnresolvedDependenciesMessage>z.Body).share();
    }

    public updatebuffer(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Buffer, 'request.Buffer must not be null');

        return this.request<OmniSharp.Models.Request, any>("updatebuffer", request, options);
    }

    public updatebufferPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.updatebuffer(request, options).toPromise();
    }

    public observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.NewText, 'request.NewText must not be null');
        assert.isNotNull(request.StartLine, 'request.StartLine must not be null');
        (<any>assert).isAbove(request.StartLine, 0, 'request.StartLine must be greater than 0.');
        assert.isNotNull(request.StartColumn, 'request.StartColumn must not be null');
        (<any>assert).isAbove(request.StartColumn, 0, 'request.StartColumn must be greater than 0.');
        assert.isNotNull(request.EndLine, 'request.EndLine must not be null');
        (<any>assert).isAbove(request.EndLine, 0, 'request.EndLine must be greater than 0.');
        assert.isNotNull(request.EndColumn, 'request.EndColumn must not be null');
        (<any>assert).isAbove(request.EndColumn, 0, 'request.EndColumn must be greater than 0.');

        return this.request<OmniSharp.Models.ChangeBufferRequest, any>("changebuffer", request, options);
    }

    public changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions) {
        return this.changebuffer(request, options).toPromise();
    }

    public observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("codecheck", request, options);
    }

    public codecheckPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.codecheck(request, options).toPromise();
    }

    public observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;

    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.Character || request.Char, 'request.Character || request.Char must not be null');

        return this.request<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>("formatAfterKeystroke", request, options);
    }

    public formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions) {
        return this.formatAfterKeystroke(request, options).toPromise();
    }

    public observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;

    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.EndLine, 'request.EndLine must not be null');
        (<any>assert).isAbove(request.EndLine, 0, 'request.EndLine must be greater than 0.');
        assert.isNotNull(request.EndColumn, 'request.EndColumn must not be null');
        (<any>assert).isAbove(request.EndColumn, 0, 'request.EndColumn must be greater than 0.');

        return this.request<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>("formatRange", request, options);
    }

    public formatRangePromise(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions) {
        return this.formatRange(request, options).toPromise();
    }

    public observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;

    public codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>("codeformat", request, options);
    }

    public codeformatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.codeformat(request, options).toPromise();
    }

    public observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;

    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.WordToComplete, 'request.WordToComplete must not be null');

        return this.request<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>("autocomplete", request, options);
    }

    public autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions) {
        return this.autocomplete(request, options).toPromise();
    }

    public observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;

    public findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("findimplementations", request, options);
    }

    public findimplementationsPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.findimplementations(request, options).toPromise();
    }

    public observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;

    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        // This isn't technically required... but looks like the server will get all symbols then...
        // Not sure if that is useful to us or not.
        assert.isNotNull(request.Filter, 'request.Filter must not be null');

        return this.request<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>("findsymbols", request, options);
    }

    public findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions) {
        return this.findsymbols(request, options).toPromise();
    }

    public observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;

    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>("findusages", request, options);
    }

    public findusagesPromise(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions) {
        return this.findusages(request, options).toPromise();
    }

    public observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;

    public gotodefinition(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, any>("gotodefinition", request, options);
    }

    public gotodefinitionPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotodefinition(request, options).toPromise();
    }

    public observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigateup", request, options);
    }

    public gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("gotofile", request, options);
    }

    public gotofilePromise(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotofile(request, options).toPromise();
    }

    public observeGotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;

    public gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("gotoregion", request, options);
    }

    public gotoregionPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotofile(request, options).toPromise();
    }

    public observeGotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;

    public navigateupPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.navigateup(request, options).toPromise();
    }

    public observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;

    public navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigatedown", request, options);
    }

    public navigatedownPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.navigatedown(request, options).toPromise();
    }

    public observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;


    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.RenameTo, 'request.RenameTo must not be null');

        return this.request<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>("rename", request, options);
    }

    public renamePromise(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions) {
        return this.rename(request, options).toPromise();
    }

    public observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;

    public signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>("signatureHelp", request, options);
    }

    public signatureHelpPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.signatureHelp(request, options).toPromise();
    }

    public observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;

    public checkalivestatus(options?: OmniSharp.RequestOptions): Rx.Observable<boolean> {
        return this.request<any, any>("checkalivestatus", {}, options);
    }

    public checkalivestatusPromise(options?: OmniSharp.RequestOptions) {
        return this.checkalivestatus(options).toPromise();
    }

    public observeCheckalivestatus: Rx.Observable<Context<any, boolean>>;

    public checkreadystatus(options?: OmniSharp.RequestOptions): Rx.Observable<boolean> {
        return this.request<any, any>("checkreadystatus", {}, options);
    }

    public checkreadystatusPromise(options?: OmniSharp.RequestOptions) {
        return this.checkreadystatus(options).toPromise();
    }

    public observeCheckreadystatus: Rx.Observable<Context<any, boolean>>;

    public currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersastree", request, options);
    }

    public currentfilemembersastreePromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.currentfilemembersastree(request, options).toPromise();
    }

    public observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersasflat", request, options);
    }

    public currentfilemembersasflatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.currentfilemembersasflat(request, options).toPromise();
    }

    public observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>("typelookup", request, options);
    }

    public typelookupPromise(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions) {
        return this.typelookup(request, options).toPromise();
    }

    public observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;

    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Rx.Observable<boolean> {
        assert.isNotNull(request, 'request must not be null');
        return this.request<OmniSharp.Models.Request[], boolean>("filesChanged", request, options);
    }

    public filesChangedPromise(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions) {
        return this.filesChanged(request, options).toPromise();
    }

    public observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;

    public projects(options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse> {
        return this.request<any, OmniSharp.Models.WorkspaceInformationResponse>("projects", {}, options);
    }

    public projectsPromise(options?: OmniSharp.RequestOptions) {
        return this.projects(options).toPromise();
    }

    public observeProjects: Rx.Observable<Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>;

    public project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>("project", request, options);
    }

    public projectPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.project(request, options).toPromise();
    }

    public observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;

    public getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>("getcodeactions", request, options);
    }

    public getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions) {
        return this.getcodeactions(request, options).toPromise();
    }

    public observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;

    public runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.CodeAction, 'request.CodeAction must not be null');
        (<any>assert).isAbove(request.CodeAction, -1, 'request.CodeAction must be greater than -1.');

        return this.request<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>("runcodeaction", request, options);
    }

    public runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions) {
        return this.runcodeaction(request, options).toPromise();
    }

    public observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;

    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.Type, 'request.Type must not be null');
        (<any>assert).isAbove(request.Type, -1, 'request.Type must be greater than -1.');

        return this.request<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>("gettestcontext", request, options);
    }

    public gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions) {
        return this.gettestcontext(request, options).toPromise();
    }

    public observeGettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;


    public projectAdded: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectChanged: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectRemoved: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public error: Rx.Observable<OmniSharp.Models.ErrorMessage>;
    public msBuildProjectDiagnostics: Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    public packageRestoreStarted: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    public packageRestoreFinished: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    public unresolvedDependencies: Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;

}
