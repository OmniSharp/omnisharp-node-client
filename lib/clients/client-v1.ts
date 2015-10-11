import {ClientBase, ClientEventsBase} from "./client-base";
import {OmnisharpClientOptions} from "../interfaces";
import {isNotNull, isAboveZero, watchCommand, endpoint} from "../decorators";

export class ClientEventsV1 extends ClientEventsBase implements OmniSharp.Events.V1 {
    @watchCommand public get updatebuffer(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get changebuffer(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get codecheck(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get formatAfterKeystroke(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get formatRange(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get codeformat(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get autocomplete(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get findimplementations(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get findsymbols(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get findusages(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get fixusings(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get gotodefinition(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get gotofile(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get gotoregion(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get highlight(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get metadata(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get navigateup(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get navigatedown(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get packagesearch(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get packagesource(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get packageversion(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get rename(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get signatureHelp(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get stopserver(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get checkalivestatus(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get checkreadystatus(): Rx.Observable<OmniSharp.Context<any, boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get currentfilemembersastree(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get currentfilemembersasflat(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get typelookup(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get filesChanged(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get projects(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get project(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get getcodeactions(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get runcodeaction(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get gettestcontext(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error('Implemented by decorator'); }
}

export class ClientV1 extends ClientBase<ClientEventsV1> implements OmniSharp.Api.V1 {
    constructor(_options: OmnisharpClientOptions) {
        super(_options, c => new ClientEventsV1(c));
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Buffer)
    @endpoint()
    public updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.NewText)
    @isNotNull(request => request.StartLine)
    @isAboveZero(request => request.StartLine)
    @isNotNull(request => request.StartColumn)
    @isAboveZero(request => request.StartColumn)
    @isNotNull(request => request.EndLine)
    @isAboveZero(request => request.EndLine)
    @isNotNull(request => request.EndColumn)
    @isAboveZero(request => request.EndColumn)
    @endpoint()
    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any> { throw new Error('Implemented by decorator'); }

    @endpoint()
    public codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.Character || request.Char)
    @endpoint()
    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.EndLine)
    @isAboveZero(request => request.EndLine)
    @isNotNull(request => request.EndColumn)
    @isAboveZero(request => request.EndColumn)
    @endpoint()
    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @endpoint()
    public codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.WordToComplete)
    @endpoint()
    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.Filter)
    @endpoint()
    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    public fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions) {

        return this.request<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>("fixusings", request, options);
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse> { throw new Error('Implemented by decorator'); }

    public gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("gotofile", request, options);
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @endpoint()
    public highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.HighlightResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.AssemblyName)
    @isNotNull(request => request.TypeName)
    @endpoint()
    public metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.MetadataResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.ProjectPath)
    @isNotNull(request => request.Search)
    @endpoint()
    public packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSearchResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.ProjectPath)
    @endpoint()
    public packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSourceResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.ProjectPath)
    @isNotNull(request => request.Id)
    @endpoint()
    public packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageVersionResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.RenameTo)
    @endpoint()
    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp> { throw new Error('Implemented by decorator'); }

    public stopserver(request: any, options?: OmniSharp.RequestOptions) {
        return this.request<any, boolean>("stopserver", request, options);
    }

    public checkalivestatus(options?: OmniSharp.RequestOptions) {
        return this.request<any, any>("checkalivestatus", {}, options);
    }

    public checkreadystatus(options?: OmniSharp.RequestOptions) {
        return this.request<any, any>("checkreadystatus", {}, options);
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @endpoint()
    public currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request)
    @endpoint()
    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Rx.Observable<boolean> { throw new Error('Implemented by decorator'); }

    @endpoint()
    public projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @endpoint()
    public project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.CodeAction)
    @isAboveZero(request => request.CodeAction)
    @endpoint()
    public runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.Type)
    @isAboveZero(request => request.Type)
    @endpoint()
    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse> { throw new Error('Implemented by decorator'); }
}
