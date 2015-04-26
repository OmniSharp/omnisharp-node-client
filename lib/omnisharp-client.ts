import {Observable, Subject} from "rx";
import {Driver, IDriver, IStaticDriver, IDriverOptions, DriverState} from "./drivers";
import {assert} from "chai";

export interface OmnisharpServerOptions extends IDriverOptions {
    driver?: Driver;
}

export interface OmnisharpServerStatus {
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

export class OmnisharpClient implements OmniSharp.Api, IDriver {
    private _driver: IDriver;
    private _requestStream = new Subject<CommandWrapper<any>>();
    private _responseStream = new Subject<CommandWrapper<any>>();
    private _statusStream: Rx.Observable<OmnisharpServerStatus>;

    constructor(private _options: OmnisharpServerOptions) {
        if (!_options.driver) _options.driver = Driver.Stdio;

        // Lazy load driver
        var driverFactory: IStaticDriver = require('./drivers/' + Driver[_options.driver].toLowerCase());

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
            (requests, responses, events) => <OmnisharpServerStatus> ({
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

    public connect() {
        this._driver.connect();
        var that = this;
    }

    public disconnect() {
        this._driver.disconnect();
    }

    public get currentState() { return this._driver.currentState; }
    public get events(): Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._driver.events; }
    public get commands(): Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { return this._driver.commands; }
    public get state(): Rx.Observable<DriverState> { return this._driver.state; }
    public get outstandingRequests() { return this._driver.outstandingRequests; }

    public get status(): Rx.Observable<OmnisharpServerStatus> { return this._statusStream; }
    public get requests(): Rx.Observable<CommandWrapper<any>> { return this._requestStream; }
    public get responses(): Rx.Observable<CommandWrapper<any>> { return this._responseStream; }

    private setupObservers() {
        this.observeUpdatebuffer = this._responseStream.where(z => z.command == "updatebuffer").map<any>(z => z.value);
        this.observeChangebuffer = this._responseStream.where(z => z.command == "changebuffer").map<any>(z => z.value);
        this.observeCodecheck = this._responseStream.where(z => z.command == "codecheck").map<OmniSharp.Models.QuickFixResponse>(z => z.value);
        this.observeFormatAfterKeystroke = this._responseStream.where(z => z.command == "formatafterkeystroke").map<OmniSharp.Models.FormatRangeResponse>(z => z.value);
        this.observeFormatRange = this._responseStream.where(z => z.command == "formatrange").map<OmniSharp.Models.FormatRangeResponse>(z => z.value);
        this.observeCodeformat = this._responseStream.where(z => z.command == "codeformat").map<OmniSharp.Models.CodeFormatResponse>(z => z.value);
        this.observeAutocomplete = this._responseStream.where(z => z.command == "autocomplete").map<OmniSharp.Models.AutoCompleteResponse[]>(z => z.value);
        this.observeFindimplementations = this._responseStream.where(z => z.command == "findimplementations").map<OmniSharp.Models.QuickFixResponse>(z => z.value);
        this.observeFindsymbols = this._responseStream.where(z => z.command == "findsymbols").map<OmniSharp.Models.QuickFixResponse>(z => z.value);
        this.observeFindusages = this._responseStream.where(z => z.command == "findusages").map<OmniSharp.Models.QuickFixResponse>(z => z.value);
        this.observeGotodefinition = this._responseStream.where(z => z.command == "gotodefinition").map<any>(z => z.value);
        this.observeNavigateup = this._responseStream.where(z => z.command == "navigateup").map<OmniSharp.Models.NavigateResponse>(z => z.value);
        this.observeNavigatedown = this._responseStream.where(z => z.command == "navigatedown").map<OmniSharp.Models.NavigateResponse>(z => z.value);
        this.observeRename = this._responseStream.where(z => z.command == "rename").map<OmniSharp.Models.RenameResponse>(z => z.value);
        this.observeSignatureHelp = this._responseStream.where(z => z.command == "signaturehelp").map<OmniSharp.Models.SignatureHelp>(z => z.value);
        this.observeCheckalivestatus = this._responseStream.where(z => z.command == "checkalivestatus").map<boolean>(z => z.value);
        this.observeCheckreadystatus = this._responseStream.where(z => z.command == "checkreadystatus").map<boolean>(z => z.value);
        this.observeCurrentfilemembersastree = this._responseStream.where(z => z.command == "currentfilemembersastree").map<any>(z => z.value);
        this.observeCurrentfilemembersasflat = this._responseStream.where(z => z.command == "currentfilemembersasflat").map<any>(z => z.value);
        this.observeTypelookup = this._responseStream.where(z => z.command == "typelookup").map<any>(z => z.value);
        this.observeFilesChanged = this._responseStream.where(z => z.command == "fileschanged").map<boolean>(z => z.value);
        this.observeProjects = this._responseStream.where(z => z.command == "projects").map<OmniSharp.Models.WorkspaceInformationResponse>(z => z.value);
        this.observeProject = this._responseStream.where(z => z.command == "project").map<OmniSharp.Models.ProjectInformationResponse>(z => z.value);
        this.observeGetcodeactions = this._responseStream.where(z => z.command == "getcodeactions").map<OmniSharp.Models.GetCodeActionsResponse>(z => z.value);
        this.observeRuncodeaction = this._responseStream.where(z => z.command == "runcodeaction").map<OmniSharp.Models.RunCodeActionResponse>(z => z.value);
        this.observeGettestcontext = this._responseStream.where(z => z.command == "gettestcontext").map<OmniSharp.Models.GetTestCommandResponse>(z => z.value);
    }

    public observeUpdatebuffer: Rx.Observable<any>;
    public observeChangebuffer: Rx.Observable<any>;
    public observeCodecheck: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    public observeFormatAfterKeystroke: Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
    public observeFormatRange: Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
    public observeCodeformat: Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
    public observeAutocomplete: Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
    public observeFindimplementations: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    public observeFindsymbols: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    public observeFindusages: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    public observeGotodefinition: Rx.Observable<any>;
    public observeNavigateup: Rx.Observable<OmniSharp.Models.NavigateResponse>;
    public observeNavigatedown: Rx.Observable<OmniSharp.Models.NavigateResponse>;
    public observeRename: Rx.Observable<OmniSharp.Models.RenameResponse>;
    public observeSignatureHelp: Rx.Observable<OmniSharp.Models.SignatureHelp>;
    public observeCheckalivestatus: Rx.Observable<boolean>;
    public observeCheckreadystatus: Rx.Observable<boolean>;
    public observeCurrentfilemembersastree: Rx.Observable<any>;
    public observeCurrentfilemembersasflat: Rx.Observable<any>;
    public observeTypelookup: Rx.Observable<any>;
    public observeFilesChanged: Rx.Observable<boolean>;
    public observeProjects: Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
    public observeProject: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public observeGetcodeactions: Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
    public observeRuncodeaction: Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
    public observeGettestcontext: Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;


    public request<TRequest, TResponse>(action: string, request?: TRequest): Rx.Observable<TResponse> {
        if (this.currentState !== DriverState.Connected) {
            // Q: Should this throw?
            return Observable.throwError<TResponse>("Server is not connected");
        }
        var result = this._driver.request<TRequest, TResponse>(action, request);
        this._requestStream.onNext(new CommandWrapper(action, request));
        var sub = result.subscribe((data) => {
            sub.dispose();
            this._responseStream.onNext(new CommandWrapper(action, data));
        });
        return result;
    }

    public updatebuffer(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Buffer, 'request.Buffer must not be null');

        return this.request<OmniSharp.Models.Request, any>("updatebuffer", request);
    }

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

    public codecheck(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("codecheck", request);
    }

    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.Character || request.Char, 'request.Character || request.Char must not be null');

        return this.request<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>("formatAfterKeystroke", request);
    }

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

    public codeformat(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.CodeFormatResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>("codeformat", request);
    }

    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.WordToComplete, 'request.WordToComplete must not be null');

        return this.request<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>("autocomplete", request);
    }

    public findimplementations(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("findimplementations", request);
    }

    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        // This isn't technically required... but looks like the server will get all symbols then...
        // Not sure if that is useful to us or not.
        assert.isNotNull(request.Filter, 'request.Filter must not be null');

        return this.request<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>("findsymbols", request);
    }

    public findusages(request: OmniSharp.Models.FindUsagesRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>("findusages", request);
    }

    public gotodefinition(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, any>("gotodefinition", request);
    }

    public navigateup(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigateup", request);
    }

    public navigatedown(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigatedown", request);
    }


    public rename(request: OmniSharp.Models.RenameRequest): Rx.Observable<OmniSharp.Models.RenameResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.RenameTo, 'request.RenameTo must not be null');

        return this.request<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>("rename", request);
    }

    public signatureHelp(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.SignatureHelp> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>("signatureHelp", request);
    }

    public checkalivestatus(): Rx.Observable<boolean> {
        return this.request<any, any>("checkalivestatus");
    }

    public checkreadystatus(): Rx.Observable<boolean> {
        return this.request<any, any>("checkreadystatus");
    }

    public currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersastree", request);
    }

    public currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersasflat", request);
    }

    public typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.TypeLookupRequest, any>("typelookup", request);
    }

    public filesChanged(request: OmniSharp.Models.Request[]): Rx.Observable<boolean> {
        assert.isNotNull(request, 'request must not be null');
        return this.request<OmniSharp.Models.Request[], boolean>("filesChanged", request);
    }

    public projects(): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse> {
        return this.request<any, OmniSharp.Models.WorkspaceInformationResponse>("projects");
    }

    public project(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>("project", request);
    }

    public getcodeactions(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>("getcodeactions", request);
    }

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
}
