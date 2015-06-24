import {ClientBase} from "./client-base";
import {assert} from "chai";
import {OmnisharpClientOptions} from "../interfaces";

export class ClientV1 extends ClientBase implements OmniSharp.Api.V1, OmniSharp.Events.V1 {
    constructor(_options: OmnisharpClientOptions = {}) {
        super(_options);
    }

    public observeUpdatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeChangebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeCodecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFormatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    public observeFormatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    public observeCodeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    public observeAutocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    public observeFindimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFindsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeFindusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeGotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeGotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeGotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeNavigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeNavigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeRename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    public observeSignatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    public observeCheckalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    public observeCheckreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    public observeCurrentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeCurrentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeTypelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    public observeFilesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    public observeProjects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>;
    public observeProject: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    public observeGetcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    public observeRuncodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    public observeGettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;

    protected setupObservers() {
        (<any>ClientBase).prototype.setupObservers.call(this);

        var observerStream = this.responses.filter(z => !z.silent);
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
    }

    public updatebuffer(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Buffer, 'request.Buffer must not be null');

        return this.request<OmniSharp.Models.Request, any>("updatebuffer", request, options);
    }

    public updatebufferPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.updatebuffer(request, options).toPromise();
    }

    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.NewText, 'request.NewText must not be null');
        assert.isNotNull(request.StartLine, 'request.StartLine must not be null');
        (<any>assert).isAbove(request.StartLine, this._lowestIndexValue - 1, `request.StartLine must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.StartColumn, 'request.StartColumn must not be null');
        (<any>assert).isAbove(request.StartColumn, this._lowestIndexValue - 1, `request.StartColumn must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.EndLine, 'request.EndLine must not be null');
        (<any>assert).isAbove(request.EndLine, this._lowestIndexValue - 1, `request.EndLine must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.EndColumn, 'request.EndColumn must not be null');
        (<any>assert).isAbove(request.EndColumn, this._lowestIndexValue - 1, `request.EndColumn must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.ChangeBufferRequest, any>("changebuffer", request, options);
    }

    public changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions) {
        return this.changebuffer(request, options).toPromise();
    }

    public codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("codecheck", request, options);
    }

    public codecheckPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.codecheck(request, options).toPromise();
    }

    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Character || request.Char, 'request.Character || request.Char must not be null');

        return this.request<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>("formatAfterKeystroke", request, options);
    }

    public formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions) {
        return this.formatAfterKeystroke(request, options).toPromise();
    }

    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.EndLine, 'request.EndLine must not be null');
        (<any>assert).isAbove(request.EndLine, this._lowestIndexValue - 1, `request.EndLine must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.EndColumn, 'request.EndColumn must not be null');
        (<any>assert).isAbove(request.EndColumn, this._lowestIndexValue - 1, `request.EndColumn must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>("formatRange", request, options);
    }

    public formatRangePromise(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions) {
        return this.formatRange(request, options).toPromise();
    }

    public codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>("codeformat", request, options);
    }

    public codeformatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.codeformat(request, options).toPromise();
    }

    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.WordToComplete, 'request.WordToComplete must not be null');

        return this.request<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>("autocomplete", request, options);
    }

    public autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions) {
        return this.autocomplete(request, options).toPromise();
    }

    public findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("findimplementations", request, options);
    }

    public findimplementationsPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.findimplementations(request, options).toPromise();
    }

    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        // This isn't technically required... but looks like the server will get all symbols then...
        // Not sure if that is useful to us or not.
        assert.isNotNull(request.Filter, 'request.Filter must not be null');

        return this.request<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>("findsymbols", request, options);
    }

    public findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions) {
        return this.findsymbols(request, options).toPromise();
    }

    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>("findusages", request, options);
    }

    public findusagesPromise(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions) {
        return this.findusages(request, options).toPromise();
    }

    public gotodefinition(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.Request, any>("gotodefinition", request, options);
    }

    public gotodefinitionPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotodefinition(request, options).toPromise();
    }

    public navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigateup", request, options);
    }

    public navigateupPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.navigateup(request, options).toPromise();
    }

    public gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("gotofile", request, options);
    }

    public gotofilePromise(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotofile(request, options).toPromise();
    }

    public gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("gotoregion", request, options);
    }

    public gotoregionPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotofile(request, options).toPromise();
    }

    public navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>("navigatedown", request, options);
    }

    public navigatedownPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.navigatedown(request, options).toPromise();
    }

    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.RenameTo, 'request.RenameTo must not be null');

        return this.request<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>("rename", request, options);
    }

    public renamePromise(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions) {
        return this.rename(request, options).toPromise();
    }

    public signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>("signatureHelp", request, options);
    }

    public signatureHelpPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.signatureHelp(request, options).toPromise();
    }

    public checkalivestatus(options?: OmniSharp.RequestOptions): Rx.Observable<boolean> {
        return this.request<any, any>("checkalivestatus", {}, options);
    }

    public checkalivestatusPromise(options?: OmniSharp.RequestOptions) {
        return this.checkalivestatus(options).toPromise();
    }

    public checkreadystatus(options?: OmniSharp.RequestOptions): Rx.Observable<boolean> {
        return this.request<any, any>("checkreadystatus", {}, options);
    }

    public checkreadystatusPromise(options?: OmniSharp.RequestOptions) {
        return this.checkreadystatus(options).toPromise();
    }

    public currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersastree", request, options);
    }

    public currentfilemembersastreePromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.currentfilemembersastree(request, options).toPromise();
    }

    public currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, any>("currentfilemembersasflat", request, options);
    }

    public currentfilemembersasflatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.currentfilemembersasflat(request, options).toPromise();
    }

    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>("typelookup", request, options);
    }

    public typelookupPromise(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions) {
        return this.typelookup(request, options).toPromise();
    }

    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Rx.Observable<boolean> {
        assert.isNotNull(request, 'request must not be null');
        return this.request<OmniSharp.Models.Request[], boolean>("filesChanged", request, options);
    }

    public filesChangedPromise(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions) {
        return this.filesChanged(request, options).toPromise();
    }

    public projects(options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse> {
        return this.request<any, OmniSharp.Models.WorkspaceInformationResponse>("projects", {}, options);
    }

    public projectsPromise(options?: OmniSharp.RequestOptions) {
        return this.projects(options).toPromise();
    }

    public project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');

        return this.request<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>("project", request, options);
    }

    public projectPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.project(request, options).toPromise();
    }

    public getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>("getcodeactions", request, options);
    }

    public getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions) {
        return this.getcodeactions(request, options).toPromise();
    }

    public runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.CodeAction, 'request.CodeAction must not be null');
        (<any>assert).isAbove(request.CodeAction, this._lowestIndexValue - 1, `request.CodeAction must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>("runcodeaction", request, options);
    }

    public runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions) {
        return this.runcodeaction(request, options).toPromise();
    }

    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Line, 'request.Line must not be null');
        (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Column, 'request.Column must not be null');
        (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        assert.isNotNull(request.Type, 'request.Type must not be null');
        (<any>assert).isAbove(request.Type, this._lowestIndexValue - 1, `request.Type must be greater than or equal to ${this._lowestIndexValue}`);

        return this.request<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>("gettestcontext", request, options);
    }

    public gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions) {
        return this.gettestcontext(request, options).toPromise();
    }
}

// Hack to workaround issue with ts.transpile not working correctly
(function(Client: any) {
    Client.setupObservers = Client.prototype.setupObservers;
})(ClientV1);
