import * as OmniSharp from "../omnisharp-server";
import {Observable} from "rxjs";
import {ClientCore, ClientEventsCore} from "./client-core";
import {OmnisharpClientOptions} from "../enums";
import {isNotNull, isAboveZero, watchCommand, precondition, endpoint, fixup} from "../helpers/decorators";

export class ClientEvents extends ClientEventsCore implements OmniSharp.Events.V2 {
    @watchCommand public get updatebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get changebuffer(): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codecheck(): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatAfterKeystroke(): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get formatRange(): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get codeformat(): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get autocomplete(): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findimplementations(): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findsymbols(): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get findusages(): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get fixusings(): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotodefinition(): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotofile(): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gotoregion(): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get highlight(): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get metadata(): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigateup(): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get navigatedown(): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesearch(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packagesource(): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get packageversion(): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get rename(): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get signatureHelp(): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get stopserver(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkalivestatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get checkreadystatus(): Observable<OmniSharp.Context<any, boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersastree(): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get currentfilemembersasflat(): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get typelookup(): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get filesChanged(): Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get projects(): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get project(): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get getcodeactions(): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get runcodeaction(): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>> { throw new Error("Implemented by decorator"); }
    @watchCommand public get gettestcontext(): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error("Implemented by decorator"); }
}

export class Client extends ClientCore<ClientEvents> implements OmniSharp.Api.V2 {
    constructor(_options: OmnisharpClientOptions) {
        super(_options, c => new ClientEvents(c));
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
    public getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse> { throw new Error("Implemented by decorator"); }

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
    public runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.RunCodeActionResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Buffer)
    @endpoint()
    public updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.NewText)
    @isNotNull((request: any) => request.StartLine)
    @isAboveZero((request: any) => request.StartLine)
    @isNotNull((request: any) => request.StartColumn)
    @isAboveZero((request: any) => request.StartColumn)
    @isNotNull((request: any) => request.EndLine)
    @isAboveZero((request: any) => request.EndLine)
    @isNotNull((request: any) => request.EndColumn)
    @isAboveZero((request: any) => request.EndColumn)
    @endpoint()
    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public codecheck(request: OmniSharp.Models.CodeCheckRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.Character || request.Char)
    @endpoint()
    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.EndLine)
    @isAboveZero((request: any) => request.EndLine)
    @isNotNull((request: any) => request.EndColumn)
    @isAboveZero((request: any) => request.EndColumn)
    @endpoint()
    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.WordToComplete)
    @endpoint()
    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.Filter)
    @endpoint()
    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public gotofile(request?: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.HighlightResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.AssemblyName)
    @isNotNull((request: any) => request.TypeName)
    @endpoint()
    public metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.MetadataResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.ProjectPath)
    @isNotNull((request: any) => request.Search)
    @endpoint()
    public packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.ProjectPath)
    @endpoint()
    public packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.ProjectPath)
    @isNotNull((request: any) => request.Id)
    @endpoint()
    public packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.RenameTo)
    @endpoint()
    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RenameResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.SignatureHelp> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public stopserver(request: any, options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public checkalivestatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public checkreadystatus(options?: OmniSharp.RequestOptions) { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Observable<any> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @endpoint()
    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request)
    @endpoint()
    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Observable<boolean> { throw new Error("Implemented by decorator"); }

    @fixup
    @endpoint()
    public projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @endpoint()
    public project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }

    @fixup
    @isNotNull((request: any) => request.FileName)
    @isNotNull((request: any) => request.Line)
    @isAboveZero((request: any) => request.Line)
    @isNotNull((request: any) => request.Column)
    @isAboveZero((request: any) => request.Column)
    @isNotNull((request: any) => request.Type)
    @isAboveZero((request: any) => request.Type)
    @endpoint()
    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse> { throw new Error("Implemented by decorator"); }
}
