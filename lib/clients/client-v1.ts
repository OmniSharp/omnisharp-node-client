import {OmniSharp} from "../../omnisharp-server.d.ts";
import {Observable} from "@reactivex/rxjs";
import {ClientBase, ClientEventsBase} from "./client-base";
import {OmnisharpClientOptions} from "../interfaces";
import {isNotNull, isAboveZero, watchCommand, endpoint, fixup} from "../decorators";

export class ClientEventsV1 extends ClientEventsBase implements OmniSharp.Events.V1 {
    @watchCommand public get updatebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get changebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codecheck(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatAfterKeystroke(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatRange(): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codeformat(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get autocomplete(): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findimplementations(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findsymbols(): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findusages(): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get fixusings(): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotodefinition(): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotofile(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotoregion(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get highlight(): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get metadata(): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigateup(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigatedown(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesearch(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesource(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packageversion(): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get rename(): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get signatureHelp(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get stopserver(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkalivestatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkreadystatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersastree(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersasflat(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get typelookup(): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get filesChanged(): Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get projects(): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get project(): Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get getcodeactions(): Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get runcodeaction(): Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gettestcontext(): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error("Implemented by decorator"); }
}

export class ClientV1 extends ClientBase<ClientEventsV1> implements OmniSharp.Api.V1 {
    constructor(_options: OmnisharpClientOptions) {
        super(_options, c => new ClientEventsV1(c));
    }

    @fixup
    @isNotNull((request: OmniSharp.Models.UpdateBufferRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.UpdateBufferRequest) => request.Buffer)
    @endpoint()
    public updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.ChangeBufferRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.ChangeBufferRequest) => request.NewText)
    @isNotNull((request: OmniSharp.Models.ChangeBufferRequest) => request.StartLine)
    @isAboveZero((request: OmniSharp.Models.ChangeBufferRequest) => request.StartLine)
    @isNotNull((request: OmniSharp.Models.ChangeBufferRequest) => request.StartColumn)
    @isAboveZero((request: OmniSharp.Models.ChangeBufferRequest) => request.StartColumn)
    @isNotNull((request: OmniSharp.Models.ChangeBufferRequest) => request.EndLine)
    @isAboveZero((request: OmniSharp.Models.ChangeBufferRequest) => request.EndLine)
    @isNotNull((request: OmniSharp.Models.ChangeBufferRequest) => request.EndColumn)
    @isAboveZero((request: OmniSharp.Models.ChangeBufferRequest) => request.EndColumn)
    @endpoint()
    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.FormatAfterKeystrokeRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.FormatAfterKeystrokeRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.FormatAfterKeystrokeRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.FormatAfterKeystrokeRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.FormatAfterKeystrokeRequest) => request.Column)
    @isNotNull((request: OmniSharp.Models.FormatAfterKeystrokeRequest) => request.Character || request.Char)
    @endpoint()
    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.FormatRangeRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.FormatRangeRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.FormatRangeRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.FormatRangeRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.FormatRangeRequest) => request.Column)
    @isNotNull((request: OmniSharp.Models.FormatRangeRequest) => request.EndLine)
    @isAboveZero((request: OmniSharp.Models.FormatRangeRequest) => request.EndLine)
    @isNotNull((request: OmniSharp.Models.FormatRangeRequest) => request.EndColumn)
    @isAboveZero((request: OmniSharp.Models.FormatRangeRequest) => request.EndColumn)
    @endpoint()
    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @endpoint()
    public codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.AutoCompleteRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.AutoCompleteRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.AutoCompleteRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.AutoCompleteRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.AutoCompleteRequest) => request.Column)
    @isNotNull((request: OmniSharp.Models.AutoCompleteRequest) => request.WordToComplete)
    @endpoint()
    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @isNotNull((request: OmniSharp.Models.Request) => request.Line)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Line)
    @isNotNull((request: OmniSharp.Models.Request) => request.Column)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Column)
    @endpoint()
    public findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.FindSymbolsRequest) => request.Filter)
    @endpoint()
    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.FindUsagesRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.FindUsagesRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.FindUsagesRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.FindUsagesRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.FindUsagesRequest) => request.Column)
    @endpoint()
    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.FixUsingsRequest) => request.FileName)
    public fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions) {

        return this.request<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>("fixusings", request, options);
    }

    @fixup
    @isNotNull((request: OmniSharp.Models.GotoDefinitionRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.GotoDefinitionRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.GotoDefinitionRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.GotoDefinitionRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.GotoDefinitionRequest) => request.Column)
    @endpoint()
    public gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @isNotNull((request: OmniSharp.Models.Request) => request.Line)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Line)
    @isNotNull((request: OmniSharp.Models.Request) => request.Column)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Column)
    @endpoint()
    public navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("gotofile", request, options);
    }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @endpoint()
    public gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.HighlightRequest) => request.FileName)
    @endpoint()
    public highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.HighlightResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.MetadataRequest) => request.AssemblyName)
    @isNotNull((request: OmniSharp.Models.MetadataRequest) => request.TypeName)
    @endpoint()
    public metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.MetadataResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @isNotNull((request: OmniSharp.Models.Request) => request.Line)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Line)
    @isNotNull((request: OmniSharp.Models.Request) => request.Column)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Column)
    @endpoint()
    public navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.PackageSearchRequest) => request.ProjectPath)
    @isNotNull((request: OmniSharp.Models.PackageSearchRequest) => request.Search)
    @endpoint()
    public packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.PackageSourceRequest) => request.ProjectPath)
    @endpoint()
    public packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.PackageVersionRequest) => request.ProjectPath)
    @isNotNull((request: OmniSharp.Models.PackageVersionRequest) => request.Id)
    @endpoint()
    public packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.RenameRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.RenameRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.RenameRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.RenameRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.RenameRequest) => request.Column)
    @isNotNull((request: OmniSharp.Models.RenameRequest) => request.RenameTo)
    @endpoint()
    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RenameResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @isNotNull((request: OmniSharp.Models.Request) => request.Line)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Line)
    @isNotNull((request: OmniSharp.Models.Request) => request.Column)
    @isAboveZero((request: OmniSharp.Models.Request) => request.Column)
    @endpoint()
    public signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.SignatureHelp> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public stopserver(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public checkalivestatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public checkreadystatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @endpoint()
    public currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @endpoint()
    public currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.TypeLookupRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.TypeLookupRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.TypeLookupRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.TypeLookupRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.TypeLookupRequest) => request.Column)
    @endpoint()
    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request[]) => request)
    @endpoint()
    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Observable<boolean> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.Request) => request.FileName)
    @endpoint()
    public project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.CodeActionRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.CodeActionRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.CodeActionRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.CodeActionRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.CodeActionRequest) => request.Column)
    @endpoint()
    public getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetCodeActionsResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.CodeActionRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.CodeActionRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.CodeActionRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.CodeActionRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.CodeActionRequest) => request.Column)
    @isNotNull((request: OmniSharp.Models.CodeActionRequest) => request.CodeAction)
    @isAboveZero((request: OmniSharp.Models.CodeActionRequest) => request.CodeAction)
    @endpoint()
    public runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RunCodeActionResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: OmniSharp.Models.TestCommandRequest) => request.FileName)
    @isNotNull((request: OmniSharp.Models.TestCommandRequest) => request.Line)
    @isAboveZero((request: OmniSharp.Models.TestCommandRequest) => request.Line)
    @isNotNull((request: OmniSharp.Models.TestCommandRequest) => request.Column)
    @isAboveZero((request: OmniSharp.Models.TestCommandRequest) => request.Column)
    @isNotNull((request: OmniSharp.Models.TestCommandRequest) => request.Type)
    @isAboveZero((request: OmniSharp.Models.TestCommandRequest) => request.Type)
    @endpoint()
    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse> { throw new Error("Implemented by decorator"); }
}
