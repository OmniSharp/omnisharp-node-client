import {ClientBase} from "./client-base";
import {ClientV1} from "./client-v1";
import {assert} from "chai";
import {OmnisharpClientOptions} from "../interfaces";
import {defaults} from "lodash";

export class ClientV2 extends ClientBase implements OmniSharp.Api.V2, OmniSharp.Events.V2 {
    public v1: ClientV1;

    constructor(_options: OmnisharpClientOptions = {}) {
        super(_options);

        this.v1 = ClientBase.fromClient<ClientV1>(ClientV1, this);
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
    public observeGetcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    public observeRuncodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    public observeGettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;

    protected setupObservers() {
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
        this.observeGetcodeactions = observerStream.filter(z => z.isCommand("v2/getcodeactions")).share();
        this.observeRuncodeaction = observerStream.filter(z => z.isCommand("v2/runcodeaction")).share();
        this.observeGettestcontext = observerStream.filter(z => z.isCommand("gettestcontext")).share();
    }

    public getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        if (!request.Selection) {
            assert.isNotNull(request.Line, 'request.Line must not be null');
            (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Column, 'request.Column must not be null');
            (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        } else {
            assert.isNotNull(request.Selection.Start.Line, 'request.Selection.Start.Line must not be null');
            (<any>assert).isAbove(request.Selection.Start.Line, this._lowestIndexValue - 1, `request.Selection.Start.Line must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Selection.Start.Column, 'request.Selection.Start.Column must not be null');
            (<any>assert).isAbove(request.Selection.Start.Column, this._lowestIndexValue - 1, `request.Selection.Start.Column must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Selection.End.Line, 'request.Selection.End.Line must not be null');
            (<any>assert).isAbove(request.Selection.End.Line, this._lowestIndexValue - 1, `request.Selection.End.Line must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Selection.End.Column, 'request.Selection.End.Column must not be null');
            (<any>assert).isAbove(request.Selection.End.Column, this._lowestIndexValue - 1, `request.Selection.End.Column must be greater than or equal to ${this._lowestIndexValue}`);
        }

        return this.request<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>("getcodeactions", request, options);
    }

    public getcodeactionsPromise(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions) {
        return this.getcodeactions(request, options).toPromise();
    }

    public runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse> {
        assert.isNotNull(request.FileName, 'request.FileName must not be null');
        assert.isNotNull(request.Identifier, 'request.Identifier must not be null');
        if (!request.Selection) {
            assert.isNotNull(request.Line, 'request.Line must not be null');
            (<any>assert).isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Column, 'request.Column must not be null');
            (<any>assert).isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        } else {
            assert.isNotNull(request.Selection.Start.Line, 'request.Selection.Start.Line must not be null');
            (<any>assert).isAbove(request.Selection.Start.Line, this._lowestIndexValue - 1, `request.Selection.Start.Line must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Selection.Start.Column, 'request.Selection.Start.Column must not be null');
            (<any>assert).isAbove(request.Selection.Start.Column, this._lowestIndexValue - 1, `request.Selection.Start.Column must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Selection.End.Line, 'request.Selection.End.Line must not be null');
            (<any>assert).isAbove(request.Selection.End.Line, this._lowestIndexValue - 1, `request.Selection.End.Line must be greater than or equal to ${this._lowestIndexValue}`);
            assert.isNotNull(request.Selection.End.Column, 'request.Selection.End.Column must not be null');
            (<any>assert).isAbove(request.Selection.End.Column, this._lowestIndexValue - 1, `request.Selection.End.Column must be greater than or equal to ${this._lowestIndexValue}`);
        }

        return this.request<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>("runcodeaction", request, options);
    }

    public runcodeactionPromise(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions) {
        return this.runcodeaction(request, options).toPromise();
    }

    public updatebuffer: typeof ClientV1.prototype.updatebuffer;
    public updatebufferPromise: typeof ClientV1.prototype.updatebufferPromise;

    public changebuffer: typeof ClientV1.prototype.changebuffer;
    public changebufferPromise: typeof ClientV1.prototype.changebufferPromise;

    public codecheck: typeof ClientV1.prototype.codecheck;
    public codecheckPromise: typeof ClientV1.prototype.codecheckPromise;

    public formatAfterKeystroke: typeof ClientV1.prototype.formatAfterKeystroke;
    public formatAfterKeystrokePromise: typeof ClientV1.prototype.formatAfterKeystrokePromise;

    public formatRange: typeof ClientV1.prototype.formatRange;
    public formatRangePromise: typeof ClientV1.prototype.formatRangePromise;

    public codeformat: typeof ClientV1.prototype.codeformat;
    public codeformatPromise: typeof ClientV1.prototype.codeformatPromise;

    public autocomplete: typeof ClientV1.prototype.autocomplete;
    public autocompletePromise: typeof ClientV1.prototype.autocompletePromise;

    public findimplementations: typeof ClientV1.prototype.findimplementations;
    public findimplementationsPromise: typeof ClientV1.prototype.findimplementationsPromise;

    public findsymbols: typeof ClientV1.prototype.findsymbols;
    public findsymbolsPromise: typeof ClientV1.prototype.findsymbolsPromise;

    public findusages: typeof ClientV1.prototype.findusages;
    public findusagesPromise: typeof ClientV1.prototype.findusagesPromise;

    public gotodefinition: typeof ClientV1.prototype.gotodefinition;
    public gotodefinitionPromise: typeof ClientV1.prototype.gotodefinitionPromise;

    public navigateup: typeof ClientV1.prototype.navigateup;
    public navigateupPromise: typeof ClientV1.prototype.navigateupPromise;

    public gotofile: typeof ClientV1.prototype.gotofile;
    public gotofilePromise: typeof ClientV1.prototype.gotofilePromise;

    public gotoregion: typeof ClientV1.prototype.gotoregion;
    public gotoregionPromise: typeof ClientV1.prototype.gotoregionPromise;

    public navigatedown: typeof ClientV1.prototype.navigatedown;
    public navigatedownPromise: typeof ClientV1.prototype.navigatedownPromise;

    public rename: typeof ClientV1.prototype.rename;
    public renamePromise: typeof ClientV1.prototype.renamePromise;

    public signatureHelp: typeof ClientV1.prototype.signatureHelp;
    public signatureHelpPromise: typeof ClientV1.prototype.signatureHelpPromise;

    public checkalivestatus: typeof ClientV1.prototype.checkalivestatus;
    public checkalivestatusPromise: typeof ClientV1.prototype.checkalivestatusPromise;

    public checkreadystatus: typeof ClientV1.prototype.checkreadystatus;
    public checkreadystatusPromise: typeof ClientV1.prototype.checkreadystatusPromise;

    public currentfilemembersastree: typeof ClientV1.prototype.currentfilemembersastree;
    public currentfilemembersastreePromise: typeof ClientV1.prototype.currentfilemembersastreePromise;

    public currentfilemembersasflat: typeof ClientV1.prototype.currentfilemembersasflat;
    public currentfilemembersasflatPromise: typeof ClientV1.prototype.currentfilemembersasflatPromise;

    public typelookup: typeof ClientV1.prototype.typelookup;
    public typelookupPromise: typeof ClientV1.prototype.typelookupPromise;

    public filesChanged: typeof ClientV1.prototype.filesChanged;
    public filesChangedPromise: typeof ClientV1.prototype.filesChangedPromise;

    public projects: typeof ClientV1.prototype.projects;
    public projectsPromise: typeof ClientV1.prototype.projectsPromise;

    public project: typeof ClientV1.prototype.project;
    public projectPromise: typeof ClientV1.prototype.projectPromise;

    public gettestcontext: typeof ClientV1.prototype.gettestcontext;
    public gettestcontextPromise: typeof ClientV1.prototype.gettestcontextPromise;
}

defaults(ClientV2.prototype, ClientV1.prototype);
