import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import "../reactive-client-base";
import "../reactive-observation-client";
import "../reactive-combination-client";

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        listen(path: "/v2/getteststartinfo"): Observable<OmniSharp.Context<any, any>>;
        listen(path: "/v2/runtest"): Observable<OmniSharp.Context<any, any>>;
        listen(path: "/autocomplete"): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        listen(path: "/changebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        listen(path: "/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/codeformat"): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
        listen(path: "/close"): Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
        listen(path: "/open"): Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
        listen(path: "/filesChanged"): Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
        listen(path: "/findimplementations"): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/findsymbols"): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/findusages"): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/fixusings"): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        listen(path: "/formatAfterKeystroke"): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        listen(path: "/formatRange"): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        listen(path: "/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        listen(path: "/gotodefinition"): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        listen(path: "/gotofile"): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/gotoregion"): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/highlight"): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        listen(path: "/currentfilemembersasflat"): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
        listen(path: "/currentfilemembersastree"): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
        listen(path: "/metadata"): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        listen(path: "/navigatedown"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
        listen(path: "/navigateup"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
        listen(path: "/packagesearch"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        listen(path: "/packagesource"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        listen(path: "/packageversion"): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        listen(path: "/rename"): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        listen(path: "/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        listen(path: "/signatureHelp"): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
        listen(path: "/gettestcontext"): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        listen(path: "/typelookup"): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        listen(path: "/updatebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
        listen(path: "/v2/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
        listen(path: "/v2/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
        listen(path: "/v2/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
        listen(path: "/project"): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
        listen(path: "/projects"): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        listen(path: "/checkalivestatus"): Observable<OmniSharp.Context<any, boolean>>;
        listen(path: "/checkreadystatus"): Observable<OmniSharp.Context<any, boolean>>;
        listen(path: "/stopserver"): Observable<OmniSharp.Context<any, boolean>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        listen(path: "/v2/getteststartinfo"): Observable<OmniSharp.Context<any, any>>;
        listen(path: "/v2/runtest"): Observable<OmniSharp.Context<any, any>>;
        listen(path: "/autocomplete"): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        listen(path: "/changebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        listen(path: "/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/codeformat"): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
        listen(path: "/close"): Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
        listen(path: "/open"): Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
        listen(path: "/filesChanged"): Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
        listen(path: "/findimplementations"): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/findsymbols"): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/findusages"): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/fixusings"): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        listen(path: "/formatAfterKeystroke"): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        listen(path: "/formatRange"): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        listen(path: "/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        listen(path: "/gotodefinition"): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        listen(path: "/gotofile"): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/gotoregion"): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
        listen(path: "/highlight"): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        listen(path: "/currentfilemembersasflat"): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
        listen(path: "/currentfilemembersastree"): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
        listen(path: "/metadata"): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        listen(path: "/navigatedown"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
        listen(path: "/navigateup"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
        listen(path: "/packagesearch"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        listen(path: "/packagesource"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        listen(path: "/packageversion"): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        listen(path: "/rename"): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        listen(path: "/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        listen(path: "/signatureHelp"): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
        listen(path: "/gettestcontext"): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        listen(path: "/typelookup"): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        listen(path: "/updatebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
        listen(path: "/v2/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
        listen(path: "/v2/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
        listen(path: "/v2/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
        listen(path: "/project"): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
        listen(path: "/projects"): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        listen(path: "/checkalivestatus"): Observable<OmniSharp.Context<any, boolean>>;
        listen(path: "/checkreadystatus"): Observable<OmniSharp.Context<any, boolean>>;
        listen(path: "/stopserver"): Observable<OmniSharp.Context<any, boolean>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        listen(path: "/v2/getteststartinfo"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, any>>[]>;
        listen(path: "/v2/runtest"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, any>>[]>;
        listen(path: "/autocomplete"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        listen(path: "/changebuffer"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        listen(path: "/codecheck"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        listen(path: "/codeformat"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
        listen(path: "/close"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>[]>;
        listen(path: "/open"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>[]>;
        listen(path: "/filesChanged"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
        listen(path: "/findimplementations"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        listen(path: "/findsymbols"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        listen(path: "/findusages"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        listen(path: "/fixusings"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
        listen(path: "/formatAfterKeystroke"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        listen(path: "/formatRange"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        listen(path: "/getcodeactions"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
        listen(path: "/gotodefinition"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
        listen(path: "/gotofile"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        listen(path: "/gotoregion"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        listen(path: "/highlight"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        listen(path: "/currentfilemembersasflat"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
        listen(path: "/currentfilemembersastree"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
        listen(path: "/metadata"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
        listen(path: "/navigatedown"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
        listen(path: "/navigateup"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
        listen(path: "/packagesearch"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
        listen(path: "/packagesource"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
        listen(path: "/packageversion"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
        listen(path: "/rename"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        listen(path: "/runcodeaction"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
        listen(path: "/signatureHelp"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
        listen(path: "/gettestcontext"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        listen(path: "/typelookup"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        listen(path: "/updatebuffer"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
        listen(path: "/v2/codecheck"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>[]>;
        listen(path: "/v2/getcodeactions"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
        listen(path: "/v2/runcodeaction"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
        listen(path: "/project"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
        listen(path: "/projects"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        listen(path: "/checkalivestatus"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
        listen(path: "/checkreadystatus"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
        listen(path: "/stopserver"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    }
}

