import * as OmniSharp from "../../omnisharp-server";
import "../async-client-base";

declare module "../async-client-base" {
    interface AsyncClient {
        request(path: "/autocomplete", request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.AutoCompleteResponse[]>;
        request(path: "/changebuffer", request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
        request(path: "/codecheck", request: OmniSharp.Models.CodeCheckRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
        request(path: "/codeformat", request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.CodeFormatResponse>;
        request(path: "/close", request: OmniSharp.Models.FileCloseRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileCloseResponse>;
        request(path: "/open", request: OmniSharp.Models.FileOpenRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileOpenResponse>;
        request(path: "/filesChanged", request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FilesChangedResponse>;
        request(path: "/findimplementations", request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
        request(path: "/findsymbols", request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
        request(path: "/findusages", request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
        request(path: "/fixusings", request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FixUsingsResponse>;
        request(path: "/formatAfterKeystroke", request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
        request(path: "/formatRange", request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
        request(path: "/getcodeactions", request: OmniSharp.Models.GetCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GetCodeActionsResponse>;
        request(path: "/gotodefinition", request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GotoDefinitionResponse>;
        request(path: "/gotofile", request: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
        request(path: "/gotoregion", request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
        request(path: "/highlight", request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.HighlightResponse>;
        request(path: "/currentfilemembersasflat", request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFix[]>;
        request(path: "/currentfilemembersastree", request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileMemberTree>;
        request(path: "/metadata", request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.MetadataResponse>;
        request(path: "/navigatedown", request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
        request(path: "/navigateup", request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
        request(path: "/packagesearch", request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSearchResponse>;
        request(path: "/packagesource", request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSourceResponse>;
        request(path: "/packageversion", request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageVersionResponse>;
        request(path: "/rename", request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.RenameResponse>;
        request(path: "/runcodeaction", request: OmniSharp.Models.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.RunCodeActionResponse>;
        request(path: "/signatureHelp", request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.SignatureHelp>;
        request(path: "/gettestcontext", request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GetTestCommandResponse>;
        request(path: "/typelookup", request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.TypeLookupResponse>;
        request(path: "/updatebuffer", request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
        request(path: "/v2/codecheck", request: OmniSharp.Models.V2.CodeCheckRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.CodeCheckResponse>;
        request(path: "/v2/getcodeactions", request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.GetCodeActionsResponse>;
        request(path: "/v2/runcodeaction", request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.RunCodeActionResponse>;
        request(path: "/project", request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.ProjectInformationResponse>;
        request(path: "/projects", request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.WorkspaceInformationResponse>;
        request(path: "/checkalivestatus", options?: OmniSharp.RequestOptions): Promise<boolean>;
        request(path: "/checkreadystatus", options?: OmniSharp.RequestOptions): Promise<boolean>;
        request(path: "/stopserver", options?: OmniSharp.RequestOptions): Promise<boolean>;
    }
}
