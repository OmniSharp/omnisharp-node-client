import {OmniSharp} from "../omnisharp-server";
import {ClientBase, ClientEventsBase} from "./client-base";
import {ClientV1} from "./client-v1";
import {OmnisharpClientOptions} from "../interfaces";
import {isNotNull, isAboveZero, watchCommand, precondition, endpoint, inheritProperties, fixup} from "../decorators";

export class ClientEventsV2 extends ClientEventsBase implements OmniSharp.Events.V2 {
    @watchCommand public get updatebuffer(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get changebuffer(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codecheck(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatAfterKeystroke(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatRange(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codeformat(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get autocomplete(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findimplementations(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findsymbols(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findusages(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get fixusings(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotodefinition(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotofile(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotoregion(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get highlight(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get metadata(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigateup(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigatedown(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesearch(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesource(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packageversion(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get rename(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get signatureHelp(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get stopserver(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkalivestatus(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkreadystatus(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersastree(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersasflat(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get typelookup(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get filesChanged(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get projects(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get project(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get getcodeactions(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get runcodeaction(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gettestcontext(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error("Implemented by decorator"); }
}

export class ClientV2 extends ClientBase<ClientEventsV2> implements OmniSharp.Api.V2 {
    constructor(_options: OmnisharpClientOptions) {
        super(_options, c => new ClientEventsV2(c));
    }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @precondition((request: any) => !request.Selection,
        isNotNull((request: any) => request.Line),
        isAboveZero((request: any) => request.Line),
        isNotNull((request: any) => request.Column),
        isAboveZero((request: any) => request.Column))
    @precondition((request: any) => !!request.Selection,
        isNotNull((request: any) => request.Selection.Start.Line),
        isAboveZero((request: any) => request.Selection.Start.Line),
        isNotNull((request: any) => request.Selection.Start.Column),
        isAboveZero((request: any) => request.Selection.Start.Column),
        isNotNull((request: any) => request.Selection.End.Line),
        isAboveZero((request: any) => request.Selection.End.Line),
        isNotNull((request: any) => request.Selection.End.Column),
        isAboveZero((request: any) => request.Selection.End.Column))
    @endpoint(2)
    public getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Identifier)
    @precondition((request: any) => !request.Selection,
        isNotNull((request: any) => request.Line),
        isAboveZero((request: any) => request.Line),
        isNotNull((request: any) => request.Column),
        isAboveZero((request: any) => request.Column))
    @precondition((request: any) => request.Selection,
        isNotNull((request: any) => request.Selection.Start.Line),
        isAboveZero((request: any) => request.Selection.Start.Line),
        isNotNull((request: any) => request.Selection.Start.Column),
        isAboveZero((request: any) => request.Selection.Start.Column),
        isNotNull((request: any) => request.Selection.End.Line),
        isAboveZero((request: any) => request.Selection.End.Line),
        isNotNull((request: any) => request.Selection.End.Column),
        isAboveZero((request: any) => request.Selection.End.Column))
    @endpoint(2)
    public runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse> { throw new Error("Implemented by decorator"); }

    public updatebuffer: typeof ClientV1.prototype.updatebuffer;
    public changebuffer: typeof ClientV1.prototype.changebuffer;
    public codecheck: typeof ClientV1.prototype.codecheck;
    public formatAfterKeystroke: typeof ClientV1.prototype.formatAfterKeystroke;
    public formatRange: typeof ClientV1.prototype.formatRange;
    public codeformat: typeof ClientV1.prototype.codeformat;
    public autocomplete: typeof ClientV1.prototype.autocomplete;
    public findimplementations: typeof ClientV1.prototype.findimplementations;
    public findsymbols: typeof ClientV1.prototype.findsymbols;
    public findusages: typeof ClientV1.prototype.findusages;
    public fixusings: typeof ClientV1.prototype.fixusings;
    public gotodefinition: typeof ClientV1.prototype.gotodefinition;
    public gotofile: typeof ClientV1.prototype.gotofile;
    public gotoregion: typeof ClientV1.prototype.gotoregion;
    public highlight: typeof ClientV1.prototype.highlight;
    public metadata: typeof ClientV1.prototype.metadata;
    public navigateup: typeof ClientV1.prototype.navigateup;
    public navigatedown: typeof ClientV1.prototype.navigatedown;
    public packagesearch: typeof ClientV1.prototype.packagesearch;
    public packagesource: typeof ClientV1.prototype.packagesource;
    public packageversion: typeof ClientV1.prototype.packageversion;
    public rename: typeof ClientV1.prototype.rename;
    public signatureHelp: typeof ClientV1.prototype.signatureHelp;
    public stopserver: typeof ClientV1.prototype.stopserver;
    public checkalivestatus: typeof ClientV1.prototype.checkalivestatus;
    public checkreadystatus: typeof ClientV1.prototype.checkreadystatus;
    public currentfilemembersastree: typeof ClientV1.prototype.currentfilemembersastree;
    public currentfilemembersasflat: typeof ClientV1.prototype.currentfilemembersasflat;
    public typelookup: typeof ClientV1.prototype.typelookup;
    public filesChanged: typeof ClientV1.prototype.filesChanged;
    public projects: typeof ClientV1.prototype.projects;
    public project: typeof ClientV1.prototype.project;
    public gettestcontext: typeof ClientV1.prototype.gettestcontext;
}

inheritProperties(ClientV1, ClientV2);
