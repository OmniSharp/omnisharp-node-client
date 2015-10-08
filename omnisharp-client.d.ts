/// <reference path="./omnisharp-server.d.ts" />

declare module "omnisharp-client/candidate-finder" {
import { ILogger } from 'omnisharp-client/interfaces';
import { Observable } from "rx";
export function findCandidates(location: string, logger: ILogger): Observable<string[]>;

}


declare module "omnisharp-client/clients/client-base" {
import { Observable } from "rx";
import { IDriver, OmnisharpClientStatus, OmnisharpClientOptions } from "omnisharp-client/interfaces";
import { DriverState } from "omnisharp-client/enums";
import { RequestContext, ResponseContext, CommandContext } from "omnisharp-client/clients/contexts";
export class ClientBase implements IDriver, OmniSharp.Events, Rx.IDisposable {
    private _options;
    private _driver;
    private _requestStream;
    private _responseStream;
    private _statusStream;
    private _errorStream;
    private _customEvents;
    private _uniqueId;
    protected _lowestIndexValue: number;
    private _eventWatchers;
    private _commandWatchers;
    private _disposable;
    static fromClient<T extends ClientBase>(ctor: any, client: ClientBase): T;
    uniqueId: string;
    id: string;
    serverPath: string;
    projectPath: string;
    currentState: DriverState;
    private _enqueuedEvents;
    events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Rx.Observable<DriverState>;
    outstandingRequests: number;
    private _currentRequests;
    getCurrentRequests(): {
        command: string;
        sequence: string;
        silent: boolean;
        request: any;
        duration: number;
    }[];
    status: Rx.Observable<OmnisharpClientStatus>;
    requests: Rx.Observable<RequestContext<any>>;
    private _enqueuedResponses;
    responses: Rx.Observable<ResponseContext<any, any>>;
    errors: Rx.Observable<CommandContext<any>>;
    constructor(_options?: OmnisharpClientOptions);
    dispose(): void;
    private setupRequestStreams();
    private handleResult(context);
    static serverLineNumbers: string[];
    static serverLineNumberArrays: string[];
    log(message: string, logLevel?: string): void;
    connect(_options?: OmnisharpClientOptions): void;
    disconnect(): void;
    request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Rx.Observable<TResponse>;
    protected setupObservers(): void;
    protected watchEvent<TBody>(event: string): Observable<TBody>;
    protected watchCommand(command: string): Observable<OmniSharp.Context<any, any>>;
    projectAdded: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectChanged: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectRemoved: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    error: Rx.Observable<OmniSharp.Models.ErrorMessage>;
    msBuildProjectDiagnostics: Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    packageRestoreStarted: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    packageRestoreFinished: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    unresolvedDependencies: Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
}

}


declare module "omnisharp-client/clients/client-v1" {
import { ClientBase } from "omnisharp-client/clients/client-base";
import { OmnisharpClientOptions } from "omnisharp-client/interfaces";
export class ClientV1 extends ClientBase implements OmniSharp.Api.V1, OmniSharp.Events.V1 {
    constructor(_options?: OmnisharpClientOptions);
    observeUpdatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    observeChangebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    observeCodecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeFormatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    observeFormatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    observeCodeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    observeAutocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    observeFindimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeFindsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    observeFindusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    observeFixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    observeGotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    observeGotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeGotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeHighlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    observeMetadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    observeNavigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    observeNavigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    observePackagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    observePackagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    observePackageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    observeRename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    observeSignatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    observeStopserver: Rx.Observable<OmniSharp.Context<any, boolean>>;
    observeCheckalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    observeCheckreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    observeCurrentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    observeCurrentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    observeTypelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    observeFilesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    observeProjects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    observeProject: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    observeGetcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    observeRuncodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    observeGettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    protected setupObservers(): void;
    updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    updatebufferPromise(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<any>;
    changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<any>;
    codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    codecheckPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
    formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
    formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
    formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
    formatRangePromise(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
    codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
    codeformatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.CodeFormatResponse>;
    autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
    autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.AutoCompleteResponse[]>;
    findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    findimplementationsPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
    findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
    findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    findusagesPromise(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
    fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FixUsingsResponse>;
    fixusingsPromise(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.FixUsingsResponse>;
    gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    gotodefinitionPromise(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<any>;
    navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
    navigateupPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
    gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    gotofilePromise(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
    gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    gotoregionPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
    highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.HighlightResponse>;
    highlightPromise(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.HighlightResponse>;
    metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.MetadataResponse>;
    metadataPromise(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.MetadataResponse>;
    navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
    navigatedownPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
    packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSearchResponse>;
    packagesearchPromise(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.PackageSearchResponse>;
    packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSourceResponse>;
    packagesourcePromise(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.PackageSourceResponse>;
    packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageVersionResponse>;
    packageversionPromise(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.PackageVersionResponse>;
    rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse>;
    renamePromise(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.RenameResponse>;
    signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp>;
    signatureHelpPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.SignatureHelp>;
    stopserver(request: any, options?: OmniSharp.RequestOptions): Rx.Observable<boolean>;
    stopserverPromise(request: any, options?: OmniSharp.RequestOptions): Rx.IPromise<boolean>;
    checkalivestatus(options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    checkalivestatusPromise(options?: OmniSharp.RequestOptions): Rx.IPromise<any>;
    checkreadystatus(options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    checkreadystatusPromise(options?: OmniSharp.RequestOptions): Rx.IPromise<any>;
    currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    currentfilemembersastreePromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<any>;
    currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    currentfilemembersasflatPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<any>;
    typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
    typelookupPromise(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.TypeLookupResponse>;
    filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Rx.Observable<boolean>;
    filesChangedPromise(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Rx.IPromise<boolean>;
    projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
    projectsPromise(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.WorkspaceInformationResponse>;
    project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectPromise(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.ProjectInformationResponse>;
    getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
    getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.GetCodeActionsResponse>;
    runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
    runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.RunCodeActionResponse>;
    gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
    gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.GetTestCommandResponse>;
}

}


declare module "omnisharp-client/clients/client-v2" {
import { ClientBase } from "omnisharp-client/clients/client-base";
import { ClientV1 } from "omnisharp-client/clients/client-v1";
import { OmnisharpClientOptions } from "omnisharp-client/interfaces";
export class ClientV2 extends ClientBase implements OmniSharp.Api.V2, OmniSharp.Events.V2 {
    v1: ClientV1;
    constructor(_options?: OmnisharpClientOptions);
    observeUpdatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    observeChangebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    observeCodecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeFormatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    observeFormatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    observeCodeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    observeAutocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    observeFindimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeFindsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    observeFindusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    observeFixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    observeGotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    observeGotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeGotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    observeHighlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    observeMetadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    observeNavigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    observeNavigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    observePackagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    observePackagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    observePackageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    observeRename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    observeSignatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    observeStopserver: Rx.Observable<OmniSharp.Context<any, boolean>>;
    observeCheckalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    observeCheckreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    observeCurrentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    observeCurrentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    observeTypelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    observeFilesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    observeProjects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    observeProject: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    observeGetcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    observeRuncodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    observeGettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    protected setupObservers(): void;
    getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
    getcodeactionsPromise(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.V2.GetCodeActionsResponse>;
    runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse>;
    runcodeactionPromise(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Rx.IPromise<OmniSharp.Models.V2.RunCodeActionResponse>;
    updatebuffer: typeof ClientV1.prototype.updatebuffer;
    updatebufferPromise: typeof ClientV1.prototype.updatebufferPromise;
    changebuffer: typeof ClientV1.prototype.changebuffer;
    changebufferPromise: typeof ClientV1.prototype.changebufferPromise;
    codecheck: typeof ClientV1.prototype.codecheck;
    codecheckPromise: typeof ClientV1.prototype.codecheckPromise;
    formatAfterKeystroke: typeof ClientV1.prototype.formatAfterKeystroke;
    formatAfterKeystrokePromise: typeof ClientV1.prototype.formatAfterKeystrokePromise;
    formatRange: typeof ClientV1.prototype.formatRange;
    formatRangePromise: typeof ClientV1.prototype.formatRangePromise;
    codeformat: typeof ClientV1.prototype.codeformat;
    codeformatPromise: typeof ClientV1.prototype.codeformatPromise;
    autocomplete: typeof ClientV1.prototype.autocomplete;
    autocompletePromise: typeof ClientV1.prototype.autocompletePromise;
    findimplementations: typeof ClientV1.prototype.findimplementations;
    findimplementationsPromise: typeof ClientV1.prototype.findimplementationsPromise;
    findsymbols: typeof ClientV1.prototype.findsymbols;
    findsymbolsPromise: typeof ClientV1.prototype.findsymbolsPromise;
    findusages: typeof ClientV1.prototype.findusages;
    findusagesPromise: typeof ClientV1.prototype.findusagesPromise;
    fixusings: typeof ClientV1.prototype.fixusings;
    fixusingsPromise: typeof ClientV1.prototype.fixusingsPromise;
    gotodefinition: typeof ClientV1.prototype.gotodefinition;
    gotodefinitionPromise: typeof ClientV1.prototype.gotodefinitionPromise;
    gotofile: typeof ClientV1.prototype.gotofile;
    gotofilePromise: typeof ClientV1.prototype.gotofilePromise;
    gotoregion: typeof ClientV1.prototype.gotoregion;
    gotoregionPromise: typeof ClientV1.prototype.gotoregionPromise;
    highlight: typeof ClientV1.prototype.highlight;
    highlightPromise: typeof ClientV1.prototype.highlightPromise;
    metadata: typeof ClientV1.prototype.metadata;
    metadataPromise: typeof ClientV1.prototype.metadataPromise;
    navigateup: typeof ClientV1.prototype.navigateup;
    navigateupPromise: typeof ClientV1.prototype.navigateupPromise;
    navigatedown: typeof ClientV1.prototype.navigatedown;
    navigatedownPromise: typeof ClientV1.prototype.navigatedownPromise;
    packagesearch: typeof ClientV1.prototype.packagesearch;
    packagesearchPromise: typeof ClientV1.prototype.packagesearchPromise;
    packagesource: typeof ClientV1.prototype.packagesource;
    packagesourcePromise: typeof ClientV1.prototype.packagesourcePromise;
    packageversion: typeof ClientV1.prototype.packageversion;
    packageversionPromise: typeof ClientV1.prototype.packageversionPromise;
    rename: typeof ClientV1.prototype.rename;
    renamePromise: typeof ClientV1.prototype.renamePromise;
    signatureHelp: typeof ClientV1.prototype.signatureHelp;
    signatureHelpPromise: typeof ClientV1.prototype.signatureHelpPromise;
    stopserver: typeof ClientV1.prototype.stopserver;
    stopserverPromise: typeof ClientV1.prototype.stopserverPromise;
    checkalivestatus: typeof ClientV1.prototype.checkalivestatus;
    checkalivestatusPromise: typeof ClientV1.prototype.checkalivestatusPromise;
    checkreadystatus: typeof ClientV1.prototype.checkreadystatus;
    checkreadystatusPromise: typeof ClientV1.prototype.checkreadystatusPromise;
    currentfilemembersastree: typeof ClientV1.prototype.currentfilemembersastree;
    currentfilemembersastreePromise: typeof ClientV1.prototype.currentfilemembersastreePromise;
    currentfilemembersasflat: typeof ClientV1.prototype.currentfilemembersasflat;
    currentfilemembersasflatPromise: typeof ClientV1.prototype.currentfilemembersasflatPromise;
    typelookup: typeof ClientV1.prototype.typelookup;
    typelookupPromise: typeof ClientV1.prototype.typelookupPromise;
    filesChanged: typeof ClientV1.prototype.filesChanged;
    filesChangedPromise: typeof ClientV1.prototype.filesChangedPromise;
    projects: typeof ClientV1.prototype.projects;
    projectsPromise: typeof ClientV1.prototype.projectsPromise;
    project: typeof ClientV1.prototype.project;
    projectPromise: typeof ClientV1.prototype.projectPromise;
    gettestcontext: typeof ClientV1.prototype.gettestcontext;
    gettestcontextPromise: typeof ClientV1.prototype.gettestcontextPromise;
}

}


declare module "omnisharp-client/clients/composite-client-base" {
import { ReplaySubject, Observable, CompositeDisposable, Disposable } from "rx";
import { ClientBase } from "omnisharp-client/clients/client-base";
import { DriverState } from "omnisharp-client/enums";
import { OmnisharpClientStatus } from "omnisharp-client/interfaces";
import { RequestContext, ResponseContext, CommandContext } from "omnisharp-client/clients/contexts";
export class ObservationClientBase<C extends ClientBase> implements OmniSharp.Events, Rx.IDisposable {
    private clients;
    protected _disposable: CompositeDisposable;
    private _clientDisposable;
    protected _clientsSubject: ReplaySubject<C[]>;
    projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectRemoved: Observable<OmniSharp.Models.ProjectInformationResponse>;
    error: Observable<OmniSharp.Models.ErrorMessage>;
    msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
    packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
    unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Rx.Observable<DriverState>;
    status: Rx.Observable<OmnisharpClientStatus>;
    requests: Rx.Observable<RequestContext<any>>;
    responses: Rx.Observable<ResponseContext<any, any>>;
    errors: Rx.Observable<CommandContext<any>>;
    constructor(clients?: C[]);
    dispose(): void;
    protected makeMergeObserable<T>(selector: (client: C) => Observable<T>): Observable<T>;
    observe<T>(selector: (client: C) => Observable<T>): Observable<T>;
    private onNext;
    add(client: C): Disposable;
}
export class CombinationClientBase<C extends ClientBase> implements OmniSharp.Aggregate.Events, Rx.IDisposable {
    private clients;
    protected _disposable: CompositeDisposable;
    private _clientDisposable;
    _clientsSubject: ReplaySubject<C[]>;
    projectAdded: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    projectChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    projectRemoved: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    error: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
    msBuildProjectDiagnostics: Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
    packageRestoreStarted: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    packageRestoreFinished: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    unresolvedDependencies: Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;
    state: Rx.Observable<OmniSharp.CombinationKey<DriverState>[]>;
    status: Rx.Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]>;
    constructor(clients?: C[]);
    dispose(): void;
    protected makeCombineObserable<T>(selector: (client: C) => Observable<T>): Observable<{
        key: string;
        value: T;
    }[]>;
    observe<T>(selector: (client: C) => Observable<T>): Observable<{
        key: string;
        value: T;
    }[]>;
    private onNext;
    add(client: C): Disposable;
}

}


declare module "omnisharp-client/clients/composite-client-v1" {
import { Observable } from "rx";
import { ClientV1 } from "omnisharp-client/clients/client-v1";
import { ObservationClientBase, CombinationClientBase } from "omnisharp-client/clients/composite-client-base";
export class ObservationClientV1<T extends ClientV1> extends ObservationClientBase<T> implements OmniSharp.Events.V1 {
    observeUpdatebuffer: typeof ClientV1.prototype.observeUpdatebuffer;
    observeChangebuffer: typeof ClientV1.prototype.observeChangebuffer;
    observeCodecheck: typeof ClientV1.prototype.observeCodecheck;
    observeFormatAfterKeystroke: typeof ClientV1.prototype.observeFormatAfterKeystroke;
    observeFormatRange: typeof ClientV1.prototype.observeFormatRange;
    observeCodeformat: typeof ClientV1.prototype.observeCodeformat;
    observeAutocomplete: typeof ClientV1.prototype.observeAutocomplete;
    observeFindimplementations: typeof ClientV1.prototype.observeFindimplementations;
    observeFindsymbols: typeof ClientV1.prototype.observeFindsymbols;
    observeFindusages: typeof ClientV1.prototype.observeFindusages;
    observeGotodefinition: typeof ClientV1.prototype.observeGotodefinition;
    observeGotofile: typeof ClientV1.prototype.observeGotofile;
    observeGotoregion: typeof ClientV1.prototype.observeGotoregion;
    observeHighlight: typeof ClientV1.prototype.observeHighlight;
    observeMetadata: typeof ClientV1.prototype.observeMetadata;
    observeNavigateup: typeof ClientV1.prototype.observeNavigateup;
    observeNavigatedown: typeof ClientV1.prototype.observeNavigatedown;
    observePackagesearch: typeof ClientV1.prototype.observePackagesearch;
    observePackagesource: typeof ClientV1.prototype.observePackagesource;
    observePackageversion: typeof ClientV1.prototype.observePackageversion;
    observeRename: typeof ClientV1.prototype.observeRename;
    observeSignatureHelp: typeof ClientV1.prototype.observeSignatureHelp;
    observeCheckalivestatus: typeof ClientV1.prototype.observeCheckalivestatus;
    observeCheckreadystatus: typeof ClientV1.prototype.observeCheckreadystatus;
    observeCurrentfilemembersastree: typeof ClientV1.prototype.observeCurrentfilemembersastree;
    observeCurrentfilemembersasflat: typeof ClientV1.prototype.observeCurrentfilemembersasflat;
    observeTypelookup: typeof ClientV1.prototype.observeTypelookup;
    observeFilesChanged: typeof ClientV1.prototype.observeFilesChanged;
    observeProjects: typeof ClientV1.prototype.observeProjects;
    observeProject: typeof ClientV1.prototype.observeProject;
    observeGetcodeactions: typeof ClientV1.prototype.observeGetcodeactions;
    observeRuncodeaction: typeof ClientV1.prototype.observeRuncodeaction;
    observeGettestcontext: typeof ClientV1.prototype.observeGettestcontext;
    constructor(clients?: T[]);
}
export class CombinationClientV1<T extends ClientV1> extends CombinationClientBase<T> implements OmniSharp.Events.Aggregate.V1 {
    observeUpdatebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    observeChangebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    observeCodecheck: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeFormatAfterKeystroke: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>[]>;
    observeFormatRange: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    observeCodeformat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
    observeAutocomplete: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    observeFindimplementations: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeFindsymbols: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    observeFindusages: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    observeGotodefinition: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    observeGotofile: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeGotoregion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeHighlight: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    observeMetadata: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    observeNavigateup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    observeNavigatedown: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    observePackagesearch: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    observePackagesource: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    observePackageversion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    observeRename: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    observeSignatureHelp: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
    observeCheckalivestatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    observeCheckreadystatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    observeCurrentfilemembersastree: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
    observeCurrentfilemembersasflat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
    observeTypelookup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    observeFilesChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>[]>;
    observeProjects: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    observeProject: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
    observeGetcodeactions: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
    observeRuncodeaction: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
    observeGettestcontext: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    constructor(clients?: T[]);
}

}


declare module "omnisharp-client/clients/composite-client-v2" {
import { Observable } from "rx";
import { ClientV1 } from "omnisharp-client/clients/client-v1";
import { ClientV2 } from "omnisharp-client/clients/client-v2";
import { ObservationClientV1 } from "omnisharp-client/clients/composite-client-v1";
import { ObservationClientBase, CombinationClientBase } from "omnisharp-client/clients/composite-client-base";
export class ObservationClientV2<T extends ClientV2> extends ObservationClientBase<T> implements OmniSharp.Events.V2 {
    v1: ObservationClientV1<ClientV1>;
    observeUpdatebuffer: typeof ClientV2.prototype.observeUpdatebuffer;
    observeChangebuffer: typeof ClientV2.prototype.observeChangebuffer;
    observeCodecheck: typeof ClientV2.prototype.observeCodecheck;
    observeFormatAfterKeystroke: typeof ClientV2.prototype.observeFormatAfterKeystroke;
    observeFormatRange: typeof ClientV2.prototype.observeFormatRange;
    observeCodeformat: typeof ClientV2.prototype.observeCodeformat;
    observeAutocomplete: typeof ClientV2.prototype.observeAutocomplete;
    observeFindimplementations: typeof ClientV2.prototype.observeFindimplementations;
    observeFindsymbols: typeof ClientV2.prototype.observeFindsymbols;
    observeFindusages: typeof ClientV2.prototype.observeFindusages;
    observeGotodefinition: typeof ClientV2.prototype.observeGotodefinition;
    observeGotofile: typeof ClientV2.prototype.observeGotofile;
    observeGotoregion: typeof ClientV2.prototype.observeGotoregion;
    observeHighlight: typeof ClientV2.prototype.observeHighlight;
    observeMetadata: typeof ClientV1.prototype.observeMetadata;
    observeNavigateup: typeof ClientV2.prototype.observeNavigateup;
    observeNavigatedown: typeof ClientV2.prototype.observeNavigatedown;
    observePackagesearch: typeof ClientV2.prototype.observePackagesearch;
    observePackagesource: typeof ClientV1.prototype.observePackagesource;
    observePackageversion: typeof ClientV2.prototype.observePackageversion;
    observeRename: typeof ClientV2.prototype.observeRename;
    observeSignatureHelp: typeof ClientV2.prototype.observeSignatureHelp;
    observeCheckalivestatus: typeof ClientV2.prototype.observeCheckalivestatus;
    observeCheckreadystatus: typeof ClientV2.prototype.observeCheckreadystatus;
    observeCurrentfilemembersastree: typeof ClientV2.prototype.observeCurrentfilemembersastree;
    observeCurrentfilemembersasflat: typeof ClientV2.prototype.observeCurrentfilemembersasflat;
    observeTypelookup: typeof ClientV2.prototype.observeTypelookup;
    observeFilesChanged: typeof ClientV2.prototype.observeFilesChanged;
    observeProjects: typeof ClientV2.prototype.observeProjects;
    observeProject: typeof ClientV2.prototype.observeProject;
    observeGetcodeactions: typeof ClientV2.prototype.observeGetcodeactions;
    observeRuncodeaction: typeof ClientV2.prototype.observeRuncodeaction;
    observeGettestcontext: typeof ClientV2.prototype.observeGettestcontext;
    constructor(clients?: T[]);
}
export class CombinationClientV2<T extends ClientV2> extends CombinationClientBase<T> implements OmniSharp.Events.Aggregate.V2 {
    observeUpdatebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    observeChangebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    observeCodecheck: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeFormatAfterKeystroke: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>[]>;
    observeFormatRange: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    observeCodeformat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
    observeAutocomplete: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    observeFindimplementations: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeFindsymbols: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    observeFindusages: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    observeGotodefinition: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    observeGotofile: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeGotoregion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    observeHighlight: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    observeMetadata: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    observeNavigateup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    observeNavigatedown: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    observePackagesearch: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    observePackagesource: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    observePackageversion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    observeRename: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    observeSignatureHelp: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
    observeCheckalivestatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    observeCheckreadystatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    observeCurrentfilemembersastree: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
    observeCurrentfilemembersasflat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
    observeTypelookup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    observeFilesChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>[]>;
    observeProjects: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    observeProject: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
    observeGetcodeactions: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
    observeRuncodeaction: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
    observeGettestcontext: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    constructor(clients?: T[]);
}

}


declare module "omnisharp-client/clients/contexts" {
import { Observable } from "rx";
export class CommandContext<T> {
    command: string;
    value: T;
    constructor(command: string, value: T);
}
export class RequestContext<T> {
    clientId: any;
    command: string;
    request: T;
    sequence: string;
    time: Date;
    silent: boolean;
    oneBasedIndices: boolean;
    isCommand(command: string): boolean;
    constructor(clientId: any, command: string, request: T, {silent, oneBasedIndices}: OmniSharp.RequestOptions, sequence?: string);
    getResponse<TResponse>(stream: Observable<ResponseContext<T, TResponse>>): Observable<TResponse>;
}
export class ResponseContext<TRequest, TResponse> {
    clientId: string;
    request: TRequest;
    response: TResponse;
    command: string;
    sequence: string;
    time: Date;
    responseTime: number;
    silent: boolean;
    isCommand(command: string): boolean;
    constructor({clientId, request, command, sequence, time, silent, oneBasedIndices}: RequestContext<any>, response: TResponse);
}

}


declare module "omnisharp-client/clients/response-handling" {
export var serverLineNumbers: string[];
export var serverLineNumberArrays: string[];
export function requestMutator(data: any): any;
export function responseMutator(data: any): any;

}


declare module "omnisharp-client/enums" {
export enum Driver {
    Http = 0,
    Stdio = 1,
}
export enum DriverState {
    Disconnected = 0,
    Connecting = 1,
    Connected = 2,
    Error = 3,
}

}


declare module "omnisharp-client/interfaces" {
import {DriverState, Driver} from "omnisharp-client/enums";
import {RequestContext, ResponseContext, CommandContext} from "omnisharp-client/clients/contexts";

export interface IStaticDriver {
    new (options: IDriverOptions): IDriver;
}

export interface ILogger {
    log(...values: any[]);
    error(...values: any[]);
}

export interface IDriverOptions {
    projectPath?: string;
    remote?: boolean;
    debug?: boolean; // Start the debug server? (Run from source, to attach with a debug host like VS)
    serverPath?: string; // Start a given server, perhaps in a different directory.
    findProject?: boolean; // Should try and find the project using the project finder
    logger?: ILogger;
    timeout?: number; // timeout in seconds
    additionalArguments?: string[];
}

export interface IDriver extends Rx.IDisposable {
    id: string;
    connect({projectPath}: IDriverOptions);
    currentState: DriverState;
    events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Rx.Observable<DriverState>;
    outstandingRequests: number;
    disconnect();
    serverPath: string;
    projectPath: string;
    request<TRequest, TResponse>(command: string, request?: TRequest): Rx.Observable<TResponse>;
}

export interface OmnisharpClientOptions extends IDriverOptions {
    driver?: Driver;
    oneBasedIndices?: boolean;
    statusSampleTime?: number;
    responseSampleTime?: number;
    concurrency?: number;
    concurrencyTimeout?: number;
    omnisharp?: {
        dnx?: {
            alias?: string;
            projects?: string;
            enablePackageRestore?: string;
            packageRestoreTimeout?: number;
        };
        formattingOptions?: {
            newLine?: string;
            useTabs?: boolean;
            tabSize?: number;
        }
    }
}

export interface OmnisharpClientStatus {
    state: DriverState;
    outgoingRequests: number;
    hasOutgoingRequests: boolean;
}

export module Omnisharp {
    interface Events {
        events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Rx.Observable<DriverState>;
        status: Rx.Observable<OmnisharpClientStatus>;
        requests: Rx.Observable<RequestContext<any>>;
        responses: Rx.Observable<ResponseContext<any, any>>;
        errors: Rx.Observable<CommandContext<any>>;
    }
}

}


declare module "omnisharp-client" {
export { findCandidates as candidateFinder } from "omnisharp-client/candidate-finder";
export { ClientV1 as OmnisharpClientV1 } from 'omnisharp-client/clients/client-v1';
export { ClientV2 as OmnisharpClientV2 } from 'omnisharp-client/clients/client-v2';
export { ObservationClientV1 as OmnisharpObservationClientV1, CombinationClientV1 as OmnisharpCombinationClientV1 } from 'omnisharp-client/clients/composite-client-v1';
export { ObservationClientV2 as OmnisharpObservationClientV2, CombinationClientV2 as OmnisharpCombinationClientV2 } from 'omnisharp-client/clients/composite-client-v2';
export { Driver, DriverState } from "omnisharp-client/enums";
export { IDriver, OmnisharpClientOptions, OmnisharpClientStatus } from "omnisharp-client/interfaces";

}


declare module "omnisharp-client/omnisharp-path" {
export var omnisharpLocation: any;

}


declare module "omnisharp-client/project-finder" {
import { ILogger } from 'omnisharp-client/interfaces';
export function findProject(location: string, logger: ILogger): string;

}


declare module "omnisharp-client/queue" {
export var enqueue: (cb: Function) => void;

}


declare module "omnisharp-client/stdio/child" {

}
