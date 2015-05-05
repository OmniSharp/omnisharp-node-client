import {Observable, Subject} from "rx";
import {IDriver, IStaticDriver, IDriverOptions} from "./drivers";
import {assert} from "chai";
import {extend} from "lodash";

export enum Driver {
    Http,
    Stdio,
    //TODO: Websocket,
}

export enum DriverState {
    Disconnected,
    Connecting,
    Connected,
    Error,
}

export interface OmnisharpClientOptions extends IDriverOptions {
    driver?: Driver;
}

export interface OmnisharpClientStatus {
    state: DriverState;
    requestsPerSecond: number;
    responsesPerSecond: number;
    eventsPerSecond: number;
    operationsPerSecond: number;
    outgoingRequests: number;
    hasOutgoingRequests: boolean;
}

export class CommandWrapper<T> {
    constructor(public command: string, public value: T) { }
}

export class RequestWrapper<T> {
    constructor(public command: string, public request: T) { }
}

export class ResponseWrapper<TRequest, TResponse> {
    constructor(public command: string, public request: TRequest, public response: TResponse) { }
}

export interface Context<TRequest, TResponse> {
    request: TRequest;
    response: TResponse;
}

export class OmnisharpClient implements OmniSharp.Api, IDriver {
    private _driver: IDriver;
    private _requestStream = new Subject<RequestWrapper<any>>();
    private _responseStream = new Subject<ResponseWrapper<any, any>>();
    private _statusStream: Rx.Observable<OmnisharpClientStatus>;
    private _errorStream = new Subject<CommandWrapper<any>>();
    public get id() { return this._driver.id; }

    public get serverPath() { return this._driver.serverPath ; }
    public get projectPath() { return this._driver.projectPath; }

    constructor(private _options: OmnisharpClientOptions = {}) {
        var driver = _options.driver || Driver.Stdio;

        var driverFactory: IStaticDriver = require('./drivers/' + Driver[driver].toLowerCase());
        this._driver = new driverFactory(_options);

        var requestsPerSecond = this._requestStream
            .bufferWithTime(1000, 100)
            .select(x => x.length);

        var responsesPerSecond = this._responseStream
            .bufferWithTime(1000, 100)
            .select(x => x.length);

        var eventsPerSecond = this._driver.events
            .bufferWithTime(1000, 100)
            .select(x => x.length);

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
            .sample(100);

        this.setupObservers();
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

    public request<TRequest, TResponse>(action: string, request?: TRequest): Rx.Observable<TResponse> {
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            // Q: Should this throw?
            return Observable.throwError<TResponse>("Server is not connected");
        }
        var result = this._driver.request<TRequest, TResponse>(action, request);
        this._requestStream.onNext(new RequestWrapper(action, request));
        var sub = result.subscribe((data) => {
            sub.dispose();
            this._responseStream.onNext(new ResponseWrapper(action, request, data));
        }, (error) => {
                sub.dispose();
                this._errorStream.onNext(new CommandWrapper(action, error));
            });
        return result;
    }

    public get currentState() { return this._driver.currentState; }
    public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._driver.events; }
    public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._driver.commands; }
    public get state(): Rx.Observable<DriverState> { return this._driver.state; }
    public get outstandingRequests() { return this._driver.outstandingRequests; }

    public get status(): Rx.Observable<OmnisharpClientStatus> { return this._statusStream; }
    public get requests(): Rx.Observable<RequestWrapper<any>> { return this._requestStream; }
    public get responses(): Rx.Observable<ResponseWrapper<any, any>> { return this._responseStream; }
    public get errors(): Rx.Observable<CommandWrapper<any>> { return this._errorStream; }

    private setupObservers() {
        this.observeUpdatebuffer = this._responseStream.filter(z => z.command == "updatebuffer");
        this.observeChangebuffer = this._responseStream.filter(z => z.command == "changebuffer");
        this.observeCodecheck = this._responseStream.filter(z => z.command == "codecheck");
        this.observeFormatAfterKeystroke = this._responseStream.filter(z => z.command == "formatafterkeystroke");
        this.observeFormatRange = this._responseStream.filter(z => z.command == "formatrange");
        this.observeCodeformat = this._responseStream.filter(z => z.command == "codeformat");
        this.observeAutocomplete = this._responseStream.filter(z => z.command == "autocomplete");
        this.observeFindimplementations = this._responseStream.filter(z => z.command == "findimplementations");
        this.observeFindsymbols = this._responseStream.filter(z => z.command == "findsymbols");
        this.observeFindusages = this._responseStream.filter(z => z.command == "findusages");
        this.observeGotodefinition = this._responseStream.filter(z => z.command == "gotodefinition");
        this.observeNavigateup = this._responseStream.filter(z => z.command == "navigateup");
        this.observeNavigatedown = this._responseStream.filter(z => z.command == "navigatedown");
        this.observeRename = this._responseStream.filter(z => z.command == "rename");
        this.observeSignatureHelp = this._responseStream.filter(z => z.command == "signaturehelp");
        this.observeCheckalivestatus = this._responseStream.filter(z => z.command == "checkalivestatus");
        this.observeCheckreadystatus = this._responseStream.filter(z => z.command == "checkreadystatus")
        this.observeCurrentfilemembersastree = this._responseStream.filter(z => z.command == "currentfilemembersastree");
        this.observeCurrentfilemembersasflat = this._responseStream.filter(z => z.command == "currentfilemembersasflat");
        this.observeTypelookup = this._responseStream.filter(z => z.command == "typelookup");
        this.observeFilesChanged = this._responseStream.filter(z => z.command == "fileschanged");
        this.observeProjects = this._responseStream.filter(z => z.command == "projects");
        this.observeProject = this._responseStream.filter(z => z.command == "project");
        this.observeGetcodeactions = this._responseStream.filter(z => z.command == "getcodeactions");
        this.observeRuncodeaction = this._responseStream.filter(z => z.command == "runcodeaction");
        this.observeGettestcontext = this._responseStream.filter(z => z.command == "gettestcontext");
    }

    public updatebuffer(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Buffer, 'request.Buffer must not be null');

        return this.request<OmniSharp.Models.Request, any>("updatebuffer", request);
    }

    public updatebufferPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.updatebuffer(request).toPromise();
    }

    public observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.NewText, 'request.NewText must not be null');
        assert.isNotNull(request.StartLine, 'request.StartLine must not be null');
        assert.isAbove(request.StartLine, 0, 'request.StartLine must be greater than 0.');
        assert.isNotNull(request.StartColumn, 'request.StartColumn must not be null');
        assert.isAbove(request.StartColumn, 0, 'request.StartColumn must be greater than 0.');
        assert.isNotNull(request.EndLine, 'request.EndLine must not be null');
        assert.isAbove(request.EndLine, 0, 'request.EndLine must be greater than 0.');
        assert.isNotNull(request.EndColumn, 'request.EndColumn must not be null');
        assert.isAbove(request.EndColumn, 0, 'request.EndColumn must be greater than 0.');

        return this.request<OmniSharp.Models.ChangeBufferRequest, any>("changebuffer", request);
    }

    public changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest): Rx.IPromise<any> {
        return this.changebuffer(request).toPromise();
    }

    public observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public codecheck(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("codecheck", request);
    }

    public codecheckPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.codecheck(request).toPromise();
    }

    public observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;

    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.Character || request.Char, 'request.Character || request.Char must not be null');

        return this.request<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>("formatAfterKeystroke", request);
    }

    public formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.IPromise<any> {
        return this.formatAfterKeystroke(request).toPromise();
    }

    public observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;

    public formatRange(request: OmniSharp.Models.FormatRangeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.EndLine, 'request.EndLine must not be null');
        assert.isAbove(request.EndLine, 0, 'request.EndLine must be greater than 0.');
        assert.isNotNull(request.EndColumn, 'request.EndColumn must not be null');
        assert.isAbove(request.EndColumn, 0, 'request.EndColumn must be greater than 0.');

        return this.request<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>("formatRange", request);
    }

    public formatRangePromise(request: OmniSharp.Models.FormatRangeRequest): Rx.IPromise<any> {
        return this.formatRange(request).toPromise();
    }

    public observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;

    public codeformat(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.CodeFormatResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>("codeformat", request);
    }

    public codeformatPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.codeformat(request).toPromise();
    }

    public observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;

    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.WordToComplete, 'request.WordToComplete must not be null');

        return this.request<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>("autocomplete", request);
    }

    public autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest): Rx.IPromise<any> {
        return this.autocomplete(request).toPromise();
    }

    public observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;

    public findimplementations(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("findimplementations", request);
    }

    public findimplementationsPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.findimplementations(request).toPromise();
    }

    public observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;

    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        // This isn't technically required... but looks like the server will get all symbols then...
        // Not sure if that is useful to us or not.
        assert.isNotNull(request.Filter, 'request.Filter must not be null');

        return this.request<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>("findsymbols", request);
    }

    public findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest): Rx.IPromise<any> {
        return this.findsymbols(request).toPromise();
    }

    public observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;

    public findusages(request: OmniSharp.Models.FindUsagesRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>("findusages", request);
    }

    public findusagesPromise(request: OmniSharp.Models.FindUsagesRequest): Rx.IPromise<any> {
        return this.findusages(request).toPromise();
    }

    public observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;

    public gotodefinition(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, any>("gotodefinition", request);
    }

    public gotodefinitionPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.gotodefinition(request).toPromise();
    }

    public observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public navigateup(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigateup", request);
    }

    public navigateupPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.navigateup(request).toPromise();
    }

    public observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;

    public navigatedown(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigatedown", request);
    }

    public navigatedownPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.navigatedown(request).toPromise();
    }

    public observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;


    public rename(request: OmniSharp.Models.RenameRequest): Rx.Observable<OmniSharp.Models.RenameResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.RenameTo, 'request.RenameTo must not be null');

        return this.request<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>("rename", request);
    }

    public renamePromise(request: OmniSharp.Models.RenameRequest): Rx.IPromise<any> {
        return this.rename(request).toPromise();
    }

    public observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;

    public signatureHelp(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.SignatureHelp> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>("signatureHelp", request);
    }

    public signatureHelpPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.signatureHelp(request).toPromise();
    }

    public observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;

    public checkalivestatus(): Rx.Observable<boolean> {
        return this.request<any, any>("checkalivestatus");
    }

    public checkalivestatusPromise(): Rx.IPromise<any> {
        return this.checkalivestatus().toPromise();
    }

    public observeCheckalivestatus: Rx.Observable<Context<any, boolean>>;

    public checkreadystatus(): Rx.Observable<boolean> {
        return this.request<any, any>("checkreadystatus");
    }

    public checkreadystatusPromise(): Rx.IPromise<any> {
        return this.checkreadystatus().toPromise();
    }

    public observeCheckreadystatus: Rx.Observable<Context<any, boolean>>;

    public currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersastree", request);
    }

    public currentfilemembersastreePromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.currentfilemembersastree(request).toPromise();
    }

    public observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersasflat", request);
    }

    public currentfilemembersasflatPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.currentfilemembersasflat(request).toPromise();
    }

    public observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, any>>;

    public typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.TypeLookupRequest, any>("typelookup", request);
    }

    public typelookupPromise(request: OmniSharp.Models.TypeLookupRequest): Rx.IPromise<any> {
        return this.typelookup(request).toPromise();
    }

    public observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, any>>;

    public filesChanged(request: OmniSharp.Models.Request[]): Rx.Observable<boolean> {
        assert.isNotNull(request, 'request must not be null');
        return this.request<OmniSharp.Models.Request[], boolean>("filesChanged", request);
    }

    public filesChangedPromise(request: OmniSharp.Models.Request[]): Rx.IPromise<any> {
        return this.filesChanged(request).toPromise();
    }

    public observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;

    public projects(): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse> {
        return this.request<any, OmniSharp.Models.WorkspaceInformationResponse>("projects");
    }

    public projectsPromise(): Rx.IPromise<any> {
        return this.projects().toPromise();
    }

    public observeProjects: Rx.Observable<Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>;

    public project(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>("project", request);
    }

    public projectPromise(request: OmniSharp.Models.Request): Rx.IPromise<any> {
        return this.project(request).toPromise();
    }

    public observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;

    public getcodeactions(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>("getcodeactions", request);
    }

    public getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<any> {
        return this.getcodeactions(request).toPromise();
    }

    public observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;

    public runcodeaction(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.RunCodeActionResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.CodeAction, 'request.CodeAction must not be null');
        assert.isAbove(request.CodeAction, -1, 'request.CodeAction must be greater than -1.');

        return this.request<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>("runcodeaction", request);
    }

    public runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<any> {
        return this.runcodeaction(request).toPromise();
    }

    public observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;

    public gettestcontext(request: OmniSharp.Models.TestCommandRequest): Rx.Observable<OmniSharp.Models.GetTestCommandResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.Type, 'request.Type must not be null');
        assert.isAbove(request.Type, -1, 'request.Type must be greater than -1.');

        return this.request<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>("gettestcontext", request);
    }

    public gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest): Rx.IPromise<any> {
        return this.gettestcontext(request).toPromise();
    }

    public observeGettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;

}
