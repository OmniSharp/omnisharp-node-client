import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        observe(path: "/autocomplete"): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        observe(path: "/changebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        observe(path: "/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/codeformat"): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
        observe(path: "/close"): Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
        observe(path: "/open"): Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
        observe(path: "/filesChanged"): Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
        observe(path: "/findimplementations"): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/findsymbols"): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/findusages"): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/fixusings"): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        observe(path: "/formatAfterKeystroke"): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        observe(path: "/formatRange"): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        observe(path: "/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        observe(path: "/gotodefinition"): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        observe(path: "/gotofile"): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/gotoregion"): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/highlight"): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        observe(path: "/currentfilemembersasflat"): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
        observe(path: "/currentfilemembersastree"): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
        observe(path: "/metadata"): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        observe(path: "/navigatedown"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
        observe(path: "/navigateup"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
        observe(path: "/packagesearch"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        observe(path: "/packagesource"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        observe(path: "/packageversion"): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        observe(path: "/rename"): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        observe(path: "/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        observe(path: "/signatureHelp"): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
        observe(path: "/gettestcontext"): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        observe(path: "/typelookup"): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        observe(path: "/updatebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
        observe(path: "/v2/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
        observe(path: "/v2/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
        observe(path: "/v2/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
        observe(path: "/project"): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
        observe(path: "/projects"): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        observe(path: "/checkalivestatus"): Observable<OmniSharp.Context<any, boolean>>;
        observe(path: "/checkreadystatus"): Observable<OmniSharp.Context<any, boolean>>;
        observe(path: "/stopserver"): Observable<OmniSharp.Context<any, boolean>>;

    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        observe(path: "/autocomplete"): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        observe(path: "/changebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        observe(path: "/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/codeformat"): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
        observe(path: "/close"): Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
        observe(path: "/open"): Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
        observe(path: "/filesChanged"): Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
        observe(path: "/findimplementations"): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/findsymbols"): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/findusages"): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/fixusings"): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        observe(path: "/formatAfterKeystroke"): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        observe(path: "/formatRange"): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        observe(path: "/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        observe(path: "/gotodefinition"): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        observe(path: "/gotofile"): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/gotoregion"): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
        observe(path: "/highlight"): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        observe(path: "/currentfilemembersasflat"): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
        observe(path: "/currentfilemembersastree"): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
        observe(path: "/metadata"): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        observe(path: "/navigatedown"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
        observe(path: "/navigateup"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
        observe(path: "/packagesearch"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        observe(path: "/packagesource"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        observe(path: "/packageversion"): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        observe(path: "/rename"): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        observe(path: "/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        observe(path: "/signatureHelp"): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
        observe(path: "/gettestcontext"): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        observe(path: "/typelookup"): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        observe(path: "/updatebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
        observe(path: "/v2/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
        observe(path: "/v2/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
        observe(path: "/v2/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
        observe(path: "/project"): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
        observe(path: "/projects"): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        observe(path: "/checkalivestatus"): Observable<OmniSharp.Context<any, boolean>>;
        observe(path: "/checkreadystatus"): Observable<OmniSharp.Context<any, boolean>>;
        observe(path: "/stopserver"): Observable<OmniSharp.Context<any, boolean>>;

    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        observe(path: "/autocomplete"): Observable<CombinationKey<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        observe(path: "/changebuffer"): Observable<CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        observe(path: "/codecheck"): Observable<CombinationKey<Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        observe(path: "/codeformat"): Observable<CombinationKey<Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
        observe(path: "/close"): Observable<CombinationKey<Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>[]>;
        observe(path: "/open"): Observable<CombinationKey<Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>[]>;
        observe(path: "/filesChanged"): Observable<CombinationKey<Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
        observe(path: "/findimplementations"): Observable<CombinationKey<Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        observe(path: "/findsymbols"): Observable<CombinationKey<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        observe(path: "/findusages"): Observable<CombinationKey<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        observe(path: "/fixusings"): Observable<CombinationKey<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
        observe(path: "/formatAfterKeystroke"): Observable<CombinationKey<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        observe(path: "/formatRange"): Observable<CombinationKey<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        observe(path: "/getcodeactions"): Observable<CombinationKey<Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
        observe(path: "/gotodefinition"): Observable<CombinationKey<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
        observe(path: "/gotofile"): Observable<CombinationKey<Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        observe(path: "/gotoregion"): Observable<CombinationKey<Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        observe(path: "/highlight"): Observable<CombinationKey<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        observe(path: "/currentfilemembersasflat"): Observable<CombinationKey<Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
        observe(path: "/currentfilemembersastree"): Observable<CombinationKey<Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
        observe(path: "/metadata"): Observable<CombinationKey<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
        observe(path: "/navigatedown"): Observable<CombinationKey<Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
        observe(path: "/navigateup"): Observable<CombinationKey<Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
        observe(path: "/packagesearch"): Observable<CombinationKey<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
        observe(path: "/packagesource"): Observable<CombinationKey<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
        observe(path: "/packageversion"): Observable<CombinationKey<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
        observe(path: "/rename"): Observable<CombinationKey<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        observe(path: "/runcodeaction"): Observable<CombinationKey<Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
        observe(path: "/signatureHelp"): Observable<CombinationKey<Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
        observe(path: "/gettestcontext"): Observable<CombinationKey<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        observe(path: "/typelookup"): Observable<CombinationKey<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        observe(path: "/updatebuffer"): Observable<CombinationKey<Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
        observe(path: "/v2/codecheck"): Observable<CombinationKey<Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>[]>;
        observe(path: "/v2/getcodeactions"): Observable<CombinationKey<Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
        observe(path: "/v2/runcodeaction"): Observable<CombinationKey<Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
        observe(path: "/project"): Observable<CombinationKey<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
        observe(path: "/projects"): Observable<CombinationKey<Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        observe(path: "/checkalivestatus"): Observable<CombinationKey<Context<any, boolean>>[]>;
        observe(path: "/checkreadystatus"): Observable<CombinationKey<Context<any, boolean>>[]>;
        observe(path: "/stopserver"): Observable<CombinationKey<Context<any, boolean>>[]>;

    }
}

