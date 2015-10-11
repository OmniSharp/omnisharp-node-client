import {ClientBase} from "./client-base";
import {ClientV1} from "./client-v1";
import {OmnisharpClientOptions} from "../interfaces";
import * as _ from "lodash";
import {isNotNull, isAboveZero, watchCommand, precondition, endpoint, inheritProperties} from "../decorators";

export class ClientV2 extends ClientBase implements OmniSharp.Api.V2, OmniSharp.Events.V2 {
    constructor(_options: OmnisharpClientOptions = {}) {
        super(_options);
    }

    @watchCommand public get observeUpdatebuffer(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeChangebuffer(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeCodecheck(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeFormatAfterKeystroke(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeFormatRange(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeCodeformat(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeAutocomplete(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeFindimplementations(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeFindsymbols(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeFindusages(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeFixusings(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeGotodefinition(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeGotofile(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeGotoregion(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeHighlight(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeMetadata(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeNavigateup(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeNavigatedown(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observePackagesearch(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observePackagesource(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observePackageversion(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeRename(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeSignatureHelp(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeStopserver(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeCheckalivestatus(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeCheckreadystatus(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeCurrentfilemembersastree(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeCurrentfilemembersasflat(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeTypelookup(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeFilesChanged(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeProjects(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeProject(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeGetcodeactions(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeRuncodeaction(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeGettestcontext(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @precondition(request => !request.Selection,
        isNotNull(request => request.Line),
        isAboveZero(request => request.Line),
        isNotNull(request => request.Column),
        isAboveZero(request => request.Column))
    @precondition(request => !!request.Selection,
        isNotNull(request => request.Selection.Start.Line),
        isAboveZero(request => request.Selection.Start.Line),
        isNotNull(request => request.Selection.Start.Column),
        isAboveZero(request => request.Selection.Start.Column),
        isNotNull(request => request.Selection.End.Line),
        isAboveZero(request => request.Selection.End.Line),
        isNotNull(request => request.Selection.End.Column),
        isAboveZero(request => request.Selection.End.Column))
    @endpoint(2)
    public getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse> { throw new Error('Implemented by decorator'); }

    public getcodeactionsPromise(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions) {
        return this.getcodeactions(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Identifier)
    @precondition(request => !request.Selection,
        isNotNull(request => request.Line),
        isAboveZero(request => request.Line),
        isNotNull(request => request.Column),
        isAboveZero(request => request.Column))
    @precondition(request => request.Selection,
        isNotNull(request => request.Selection.Start.Line),
        isAboveZero(request => request.Selection.Start.Line),
        isNotNull(request => request.Selection.Start.Column),
        isAboveZero(request => request.Selection.Start.Column),
        isNotNull(request => request.Selection.End.Line),
        isAboveZero(request => request.Selection.End.Line),
        isNotNull(request => request.Selection.End.Column),
        isAboveZero(request => request.Selection.End.Column))
    @endpoint(2)
    public runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse> { throw new Error('Implemented by decorator'); }

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

inheritProperties(ClientV1, ClientV2);
