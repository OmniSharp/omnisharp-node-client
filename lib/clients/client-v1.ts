import {ClientBase} from "./client-base";
import {OmnisharpClientOptions} from "../interfaces";
import {isNotNull, isAboveZero, watchCommand, endpoint} from "../decorators";

export class ClientV1 extends ClientBase implements OmniSharp.Api.V1, OmniSharp.Events.V1 {
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
    @watchCommand public get observeGetcodeactions(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeRuncodeaction(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>> { throw new Error('Implemented by decorator'); }
    @watchCommand public get observeGettestcontext(): Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>> { throw new Error('Implemented by decorator'); }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Buffer)
    @endpoint()
    public updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable< any> { throw new Error('Implemented by decorator'); }

    public updatebufferPromise(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions) {
        return this.updatebuffer(request, options).toPromise();
    }

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
    public changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable< any> { throw new Error('Implemented by decorator'); }

    public changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions) {
        return this.changebuffer(request, options).toPromise();
    }

    @endpoint()
    public codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    public codecheckPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.codecheck(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.Character || request.Char)
    @endpoint()
    public formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.FormatRangeResponse> { throw new Error('Implemented by decorator'); }

    public formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions) {
        return this.formatAfterKeystroke(request, options).toPromise();
    }

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
    public formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.FormatRangeResponse> { throw new Error('Implemented by decorator'); }

    public formatRangePromise(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions) {
        return this.formatRange(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.CodeFormatResponse> { throw new Error('Implemented by decorator'); }

    public codeformatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.codeformat(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.WordToComplete)
    @endpoint()
    public autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.AutoCompleteResponse[]> { throw new Error('Implemented by decorator'); }

    public autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions) {
        return this.autocomplete(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    public findimplementationsPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.findimplementations(request, options).toPromise();
    }

    @isNotNull(request => request.Filter)
    @endpoint()
    public findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    public findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions) {
        return this.findsymbols(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    public findusagesPromise(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions) {
        return this.findusages(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    public fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions) {

        return this.request<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>("fixusings", request, options);
    }

    public fixusingsPromise(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions) {
        return this.fixusings(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Rx.Observable< any> { throw new Error('Implemented by decorator'); }

    public gotodefinitionPromise(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions) {
        return this.gotodefinition(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.NavigateResponse> { throw new Error('Implemented by decorator'); }

    public navigateupPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.navigateup(request, options).toPromise();
    }

    public gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.request<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>("gotofile", request, options);
    }

    public gotofilePromise(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotofile(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.QuickFixResponse> { throw new Error('Implemented by decorator'); }

    public gotoregionPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.gotofile(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.HighlightResponse> { throw new Error('Implemented by decorator'); }

    public highlightPromise(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions) {
        return this.highlight(request, options).toPromise();
    }

    @isNotNull(request => request.AssemblyName)
    @isNotNull(request => request.TypeName)
    @endpoint()
    public metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.MetadataResponse> { throw new Error('Implemented by decorator'); }

    public metadataPromise(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions) {
        return this.metadata(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.NavigateResponse> { throw new Error('Implemented by decorator'); }

    public navigatedownPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.navigatedown(request, options).toPromise();
    }

    // 'packagesearch'
    @isNotNull(request => request.ProjectPath)
    @isNotNull(request => request.Search)
    @endpoint()
    public packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSearchResponse> { throw new Error('Implemented by decorator'); }

    public packagesearchPromise(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions) {
        return this.packagesearch(request, options).toPromise();
    }

    // 'packagesource'
    @isNotNull(request => request.ProjectPath)
    @endpoint()
    public packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSourceResponse> { throw new Error('Implemented by decorator'); }

    public packagesourcePromise(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions) {
        return this.packagesource(request, options).toPromise();
    }

    // 'packageversion'
    @isNotNull(request => request.ProjectPath)
    @isNotNull(request => request.Id)
    @endpoint()
    public packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageVersionResponse> { throw new Error('Implemented by decorator'); }

    public packageversionPromise(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions) {
        return this.packageversion(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.RenameTo)
    @endpoint()
    public rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.RenameResponse> { throw new Error('Implemented by decorator'); }

    public renamePromise(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions) {
        return this.rename(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.SignatureHelp> { throw new Error('Implemented by decorator'); }

    public signatureHelpPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.signatureHelp(request, options).toPromise();
    }

    public stopserver(request: any, options?: OmniSharp.RequestOptions) {
        return this.request<any, boolean>("stopserver", request, options);
    }

    public stopserverPromise(request: any, options?: OmniSharp.RequestOptions) {
        return this.stopserver(request, options).toPromise();
    }

    public checkalivestatus(options?: OmniSharp.RequestOptions) {
        return this.request<any, any>("checkalivestatus", {}, options);
    }

    public checkalivestatusPromise(options?: OmniSharp.RequestOptions) {
        return this.checkalivestatus(options).toPromise();
    }

    public checkreadystatus(options?: OmniSharp.RequestOptions) {
        return this.request<any, any>("checkreadystatus", {}, options);
    }

    public checkreadystatusPromise(options?: OmniSharp.RequestOptions) {
        return this.checkreadystatus(options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< any> { throw new Error('Implemented by decorator'); }

    public currentfilemembersastreePromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.currentfilemembersastree(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< any> { throw new Error('Implemented by decorator'); }

    public currentfilemembersasflatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.currentfilemembersasflat(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.TypeLookupResponse> { throw new Error('Implemented by decorator'); }

    public typelookupPromise(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions) {
        return this.typelookup(request, options).toPromise();
    }

    @isNotNull(request => request)
    @endpoint()
    public filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Rx.Observable< boolean> { throw new Error('Implemented by decorator'); }

    public filesChangedPromise(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions) {
        return this.filesChanged(request, options).toPromise();
    }

    @endpoint()
    public projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.WorkspaceInformationResponse> { throw new Error('Implemented by decorator'); }

    public projectsPromise(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions) {
        return this.projects(options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @endpoint()
    public project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.ProjectInformationResponse> { throw new Error('Implemented by decorator'); }

    public projectPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions) {
        return this.project(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @endpoint()
    public getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.GetCodeActionsResponse> { throw new Error('Implemented by decorator'); }

    public getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions) {
        return this.getcodeactions(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.CodeAction)
    @isAboveZero(request => request.CodeAction)
    @endpoint()
    public runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.RunCodeActionResponse> { throw new Error('Implemented by decorator'); }

    public runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions) {
        return this.runcodeaction(request, options).toPromise();
    }

    @isNotNull(request => request.FileName)
    @isNotNull(request => request.Line)
    @isAboveZero(request => request.Line)
    @isNotNull(request => request.Column)
    @isAboveZero(request => request.Column)
    @isNotNull(request => request.Type)
    @isAboveZero(request => request.Type)
    @endpoint()
    public gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Rx.Observable< OmniSharp.Models.GetTestCommandResponse> { throw new Error('Implemented by decorator'); }

    public gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions) {
        return this.gettestcontext(request, options).toPromise();
    }
}
