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
    totalPerSecond: number;
    outgoingRequests: number;
    hasOutgoingRequests: boolean;
}

export class OmnisharpServer implements OmniSharp.Api, IDriver {
    private _driver: IDriver;
    private _requestStream = new Subject<any>();
    private _responseStream = new Subject<any>();
    private _statusStream: Observable<OmnisharpServerStatus>;

    constructor(private _options: OmnisharpServerOptions) {
        if (!_options.driver) _options.driver = Driver.Stdio;

        // Lazy load driver
        var driverFactory: IStaticDriver = require('./drivers/' + Driver[_options.driver].toLowerCase());
        this._driver = new driverFactory(_options);

        var requestsPerSecond = this._requestStream
            .windowWithTime(1000, 100)
            .count();

        var responsesPerSecond = this._responseStream
            .windowWithTime(1000, 100)
            .count();

        var eventsPerSecond = this._driver.events
            .windowWithTime(1000, 100)
            .count();

        var totalPerSecond = Observable.combineLatest(
            requestsPerSecond, responsesPerSecond, eventsPerSecond,
            function(requests, responses, events) {
                return requests + responses + events;
            });

        this._statusStream = Observable.combineLatest(
            requestsPerSecond,
            responsesPerSecond,
            eventsPerSecond,
            (requests, responses, events) => ({
                state: this._driver.currentState,
                requestsPerSecond: requests,
                responsesPerSecond: responses,
                eventsPerSecond: events,
                totalPerSecond: requests + responses + events,
                outgoingRequests: this._driver.outstandingRequests,
                hasOutgoingRequests: this._driver.outstandingRequests > 0
            }));
    }

    public connect() {
        this._driver.connect();
    }
    public disconnect() {
        this._driver.disconnect();
    }

    public get currentState() { return this._driver.currentState; }
    public get events() { return this._driver.events; }
    public get commands() { return this._driver.commands; }
    public get state() { return this._driver.state; }
    public get outstandingRequests() { return this._driver.outstandingRequests; }

    public get status() { return this._statusStream; }
    public get requests(): Observable<any> { return this._requestStream; }
    public get responses(): Observable<any> { return this._responseStream; }

    public request<TRequest, TResponse>(action: string, request?: TRequest): Observable<TResponse> {
        if (this.currentState !== DriverState.Connected) {
            // Q: Should this throw?
            return Observable.throwError<TResponse>("Server is not connected");
        }
        var result = this._driver.request<TRequest, TResponse>(action, request);
        this._requestStream.onNext(request);
        var sub = result.subscribe((data) => {
            sub.dispose();
            this._responseStream.onNext(data);
        });
        return result;
    }

    public updatebuffer(request: OmniSharp.Models.Request): Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Buffer, 'request.Buffer must not be null');

        return this.request<OmniSharp.Models.Request, any>("updatebuffer", request);
    }

    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Observable<any> {
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

    public codecheck(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.QuickFixResponse> {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("codecheck", request);
    }

    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.Character || request.Char, 'request.Character || request.Char must not be null');

        return this.request<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>("formatAfterKeystroke", request);
    }

    public formatRange(request: OmniSharp.Models.FormatRangeRequest): Observable<OmniSharp.Models.FormatRangeResponse> {
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

    public codeformat(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.CodeFormatResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>("codeformat", request);
    }

    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Observable<OmniSharp.Models.AutoCompleteResponse[]> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.WordToComplete, 'request.WordToComplete must not be null');

        return this.request<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>("autocomplete", request);
    }

    public findimplementations(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("findimplementations", request);
    }

    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Observable<OmniSharp.Models.QuickFixResponse> {
        // This isn't technically required... but looks like the server will get all symbols then...
        // Not sure if that is useful to us or not.
        assert.isNotNull(request.Filter, 'request.Filter must not be null');

        return this.request<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>("findsymbols", request);
    }

    public findusages(request: OmniSharp.Models.FindUsagesRequest): Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>("findusages", request);
    }

    public gotodefinition(request: OmniSharp.Models.Request): Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, any>("gotodefinition", request);
    }

    public navigateup(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigateup", request);
    }

    public navigatedown(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigatedown", request);
    }


    public rename(request: OmniSharp.Models.RenameRequest): Observable<OmniSharp.Models.RenameResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');
        assert.isNotNull(request.RenameTo, 'request.RenameTo must not be null');

        return this.request<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>("rename", request);
    }

    public signatureHelp(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.SignatureHelp> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        assert.isAbove(request.Line, 0, 'request.Line must be greater than 0.');
        assert.isNotNull(request.Column, 'request.Column must not be null');
        assert.isAbove(request.Column, 0, 'request.Column must be greater than 0.');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>("signatureHelp", request);
    }

    public checkalivestatus(): Observable<boolean> {
        return this.request<any, any>("checkalivestatus");
    }

    public checkreadystatus(): Observable<boolean> {
        return this.request<any, any>("checkreadystatus");
    }

    public currentfilemembersastree(request: OmniSharp.Models.Request): Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersastree", request);
    }

    public currentfilemembersasflat(request: OmniSharp.Models.Request): Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersasflat", request);
    }

    public typelookup(request: OmniSharp.Models.TypeLookupRequest): Observable<any> {
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
