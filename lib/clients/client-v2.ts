import {ClientBase} from "./client-base";
import {ClientV1} from "./client-v1";
import {OmnisharpClientOptions} from "../interfaces";
import {defaults} from "lodash";

function isNotNull<T>(value: T, errorText: string) {
    if (value === null || value === undefined) {
        throw new Error(errorText);
    }
}

function isAbove(value: number, minValue: number, errorText: string) {
    if (value === null || value === undefined) {
        return;
    }
    if (value <= minValue) {
        throw new Error(errorText);
    }
}

export class ClientV2 extends ClientBase implements OmniSharp.Api.V2, OmniSharp.Events.V2 {
    public v1: ClientV1;

    constructor(_options: OmnisharpClientOptions = {}) {
        super(_options);

        this.v1 = ClientBase.fromClient<ClientV1>(ClientV1, this);
    }

    public observeUpdatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    public observeChangebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    public observeCodecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFormatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    public observeFormatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    public observeCodeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    public observeAutocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    public observeFindimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFindsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeFindusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeFixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    public observeGotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    public observeGotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeGotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeHighlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    public observeMetadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    public observeNavigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeNavigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observePackagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    public observePackagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    public observePackageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    public observeRename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    public observeSignatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    public observeStopserver: Rx.Observable<OmniSharp.Context<any, boolean>>;
    public observeCheckalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    public observeCheckreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    public observeCurrentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    public observeCurrentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    public observeTypelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    public observeFilesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    public observeProjects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    public observeProject: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    public observeGetcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    public observeRuncodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    public observeGettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;

    protected setupObservers() {
        (<any>ClientBase).prototype.setupObservers.call(this);

        this.observeUpdatebuffer = this.watchCommand("updatebuffer");
        this.observeChangebuffer = this.watchCommand("changebuffer");
        this.observeCodecheck = this.watchCommand("codecheck");
        this.observeFormatAfterKeystroke = this.watchCommand("formatafterkeystroke");
        this.observeFormatRange = this.watchCommand("formatrange");
        this.observeCodeformat = this.watchCommand("codeformat");
        this.observeAutocomplete = this.watchCommand("autocomplete");
        this.observeFindimplementations = this.watchCommand("findimplementations");
        this.observeFindsymbols = this.watchCommand("findsymbols");
        this.observeFindusages = this.watchCommand("findusages");
        this.observeFixusings = this.watchCommand("fixusings");
        this.observeGotodefinition = this.watchCommand("gotodefinition");
        this.observeGotofile = this.watchCommand("gotofile");
        this.observeGotoregion = this.watchCommand("gotoregion");
        this.observeHighlight = this.watchCommand("highlight");
        this.observeMetadata = this.watchCommand("metadata");
        this.observeNavigateup = this.watchCommand("navigateup");
        this.observeNavigatedown = this.watchCommand("navigatedown");
        this.observePackagesearch = this.watchCommand("packagesearch");
        this.observePackagesource = this.watchCommand("packagesource");
        this.observePackageversion = this.watchCommand("packageversion");
        this.observeRename = this.watchCommand("rename");
        this.observeSignatureHelp = this.watchCommand("signaturehelp");
        this.observeStopserver = this.watchCommand("stopserver");
        this.observeCheckalivestatus = this.watchCommand("checkalivestatus");
        this.observeCheckreadystatus = this.watchCommand("checkreadystatus");
        this.observeCurrentfilemembersastree = this.watchCommand("currentfilemembersastree");
        this.observeCurrentfilemembersasflat = this.watchCommand("currentfilemembersasflat");
        this.observeTypelookup = this.watchCommand("typelookup");
        this.observeFilesChanged = this.watchCommand("fileschanged");
        this.observeProjects = this.watchCommand("projects");
        this.observeProject = this.watchCommand("project");
        this.observeGetcodeactions = this.watchCommand("v2/getcodeactions");
        this.observeRuncodeaction = this.watchCommand("v2/runcodeaction");
        this.observeGettestcontext = this.watchCommand("gettestcontext");
    }

    public getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse> {
        isNotNull(request.FileName, 'request.FileName must not be null');
        if (!request.Selection) {
            isNotNull(request.Line, 'request.Line must not be null');
            isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Column, 'request.Column must not be null');
            isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        } else {
            isNotNull(request.Selection.Start.Line, 'request.Selection.Start.Line must not be null');
            isAbove(request.Selection.Start.Line, this._lowestIndexValue - 1, `request.Selection.Start.Line must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Selection.Start.Column, 'request.Selection.Start.Column must not be null');
            isAbove(request.Selection.Start.Column, this._lowestIndexValue - 1, `request.Selection.Start.Column must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Selection.End.Line, 'request.Selection.End.Line must not be null');
            isAbove(request.Selection.End.Line, this._lowestIndexValue - 1, `request.Selection.End.Line must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Selection.End.Column, 'request.Selection.End.Column must not be null');
            isAbove(request.Selection.End.Column, this._lowestIndexValue - 1, `request.Selection.End.Column must be greater than or equal to ${this._lowestIndexValue}`);
        }

        return this.request<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>("v2/getcodeactions", request, options);
    }

    public getcodeactionsPromise(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions) {
        return this.getcodeactions(request, options).toPromise();
    }

    public runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse> {
        isNotNull(request.FileName, 'request.FileName must not be null');
        isNotNull(request.Identifier, 'request.Identifier must not be null');
        if (!request.Selection) {
            isNotNull(request.Line, 'request.Line must not be null');
            isAbove(request.Line, this._lowestIndexValue - 1, `request.Line must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Column, 'request.Column must not be null');
            isAbove(request.Column, this._lowestIndexValue - 1, `request.Column must be greater than or equal to ${this._lowestIndexValue}`);
        } else {
            isNotNull(request.Selection.Start.Line, 'request.Selection.Start.Line must not be null');
            isAbove(request.Selection.Start.Line, this._lowestIndexValue - 1, `request.Selection.Start.Line must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Selection.Start.Column, 'request.Selection.Start.Column must not be null');
            isAbove(request.Selection.Start.Column, this._lowestIndexValue - 1, `request.Selection.Start.Column must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Selection.End.Line, 'request.Selection.End.Line must not be null');
            isAbove(request.Selection.End.Line, this._lowestIndexValue - 1, `request.Selection.End.Line must be greater than or equal to ${this._lowestIndexValue}`);
            isNotNull(request.Selection.End.Column, 'request.Selection.End.Column must not be null');
            isAbove(request.Selection.End.Column, this._lowestIndexValue - 1, `request.Selection.End.Column must be greater than or equal to ${this._lowestIndexValue}`);
        }

        return this.request<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>("v2/runcodeaction", request, options);
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

    public fixusings: typeof ClientV1.prototype.fixusings;
    public fixusingsPromise: typeof ClientV1.prototype.fixusingsPromise;

    public gotodefinition: typeof ClientV1.prototype.gotodefinition;
    public gotodefinitionPromise: typeof ClientV1.prototype.gotodefinitionPromise;

    public gotofile: typeof ClientV1.prototype.gotofile;
    public gotofilePromise: typeof ClientV1.prototype.gotofilePromise;

    public gotoregion: typeof ClientV1.prototype.gotoregion;
    public gotoregionPromise: typeof ClientV1.prototype.gotoregionPromise;

    public highlight: typeof ClientV1.prototype.highlight;
    public highlightPromise: typeof ClientV1.prototype.highlightPromise;

    public metadata: typeof ClientV1.prototype.metadata;
    public metadataPromise: typeof ClientV1.prototype.metadataPromise;

    public navigateup: typeof ClientV1.prototype.navigateup;
    public navigateupPromise: typeof ClientV1.prototype.navigateupPromise;

    public navigatedown: typeof ClientV1.prototype.navigatedown;
    public navigatedownPromise: typeof ClientV1.prototype.navigatedownPromise;

    public packagesearch: typeof ClientV1.prototype.packagesearch;
    public packagesearchPromise: typeof ClientV1.prototype.packagesearchPromise;

    public packagesource: typeof ClientV1.prototype.packagesource;
    public packagesourcePromise: typeof ClientV1.prototype.packagesourcePromise;

    public packageversion: typeof ClientV1.prototype.packageversion;
    public packageversionPromise: typeof ClientV1.prototype.packageversionPromise;

    public rename: typeof ClientV1.prototype.rename;
    public renamePromise: typeof ClientV1.prototype.renamePromise;

    public signatureHelp: typeof ClientV1.prototype.signatureHelp;
    public signatureHelpPromise: typeof ClientV1.prototype.signatureHelpPromise;

    public stopserver: typeof ClientV1.prototype.stopserver;
    public stopserverPromise: typeof ClientV1.prototype.stopserverPromise;

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

// Hack to workaround issue with ts.transpile not working correctly
(function(Client: any) {
    Client.setupObservers = Client.prototype.setupObservers;
})(ClientV2);
