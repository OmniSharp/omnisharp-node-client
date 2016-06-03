import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import * as preconditions from "../../helpers/preconditions";

declare module "../reactive-client-base" {
    interface ReactiveClient {
        request(path: "/autocomplete", request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        request(path: "/changebuffer", request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Observable<any>;
        request(path: "/codecheck", request: OmniSharp.Models.CodeCheckRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        request(path: "/codeformat", request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse>;
        request(path: "/close", request: OmniSharp.Models.FileCloseRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileCloseResponse>;
        request(path: "/open", request: OmniSharp.Models.FileOpenRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileOpenResponse>;
        request(path: "/filesChanged", request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FilesChangedResponse>;
        request(path: "/findimplementations", request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        request(path: "/findsymbols", request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        request(path: "/findusages", request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        request(path: "/fixusings", request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse>;
        request(path: "/formatAfterKeystroke", request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
        request(path: "/formatRange", request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
        request(path: "/getcodeactions", request: OmniSharp.Models.GetCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetCodeActionsResponse>;
        request(path: "/gotodefinition", request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GotoDefinitionResponse>;
        request(path: "/gotofile", request: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        request(path: "/gotoregion", request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        request(path: "/highlight", request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.HighlightResponse>;
        request(path: "/currentfilemembersasflat", request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFix[]>;
        request(path: "/currentfilemembersastree", request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileMemberTree>;
        request(path: "/metadata", request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.MetadataResponse>;
        request(path: "/navigatedown", request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
        request(path: "/navigateup", request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
        request(path: "/packagesearch", request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse>;
        request(path: "/packagesource", request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse>;
        request(path: "/packageversion", request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse>;
        request(path: "/rename", request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RenameResponse>;
        request(path: "/runcodeaction", request: OmniSharp.Models.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RunCodeActionResponse>;
        request(path: "/signatureHelp", request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.SignatureHelp>;
        request(path: "/gettestcontext", request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse>;
        request(path: "/typelookup", request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse>;
        request(path: "/updatebuffer", request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Observable<any>;
        request(path: "/v2/codecheck", request: OmniSharp.Models.V2.CodeCheckRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.CodeCheckResponse>;
        request(path: "/v2/getcodeactions", request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
        request(path: "/v2/runcodeaction", request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.RunCodeActionResponse>;
        request(path: "/project", request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse>;
        request(path: "/projects", request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        request(path: "/checkalivestatus", options?: OmniSharp.RequestOptions): Observable<boolean>;
        request(path: "/checkreadystatus", options?: OmniSharp.RequestOptions): Observable<boolean>;
        request(path: "/stopserver", options?: OmniSharp.RequestOptions): Observable<boolean>;
    }
}
