/// <reference path='./omnisharp-server.d.ts' />

declare module 'omnisharp-client/aggregate/composite-client-base' {
import { ReplaySubject, Observable } from '@reactivex/rxjs';
import { IDisposable, Disposable, CompositeDisposable } from 'omnisharp-client/helpers/Disposable';
import { DriverState } from 'omnisharp-client/enums';
import { OmnisharpClientStatus } from 'omnisharp-client/interfaces';
import { RequestContext, ResponseContext, CommandContext } from 'omnisharp-client/contexts';
export class ObservationClientBase<Client> implements OmniSharp.Events, IDisposable {
    private clients;
    protected _disposable: CompositeDisposable;
    private _clientDisposable;
    protected _clientsSubject: ReplaySubject<Client[]>;
    projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectRemoved: Observable<OmniSharp.Models.ProjectInformationResponse>;
    error: Observable<OmniSharp.Models.ErrorMessage>;
    msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
    packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
    unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Observable<DriverState>;
    status: Observable<OmnisharpClientStatus>;
    requests: Observable<RequestContext<any>>;
    responses: Observable<ResponseContext<any, any>>;
    errors: Observable<CommandContext<any>>;
    constructor(clients?: Client[]);
    dispose(): void;
    protected makeMergeObserable: <T>(selector: (client: Client) => Observable<T>) => Observable<T>;
    observe<T>(selector: (client: Client) => Observable<T>): Observable<T>;
    private next;
    add(client: Client): Disposable;
}
export class CombinationClientBase<Client> implements OmniSharp.Aggregate.Events, IDisposable {
    private clients;
    protected _disposable: CompositeDisposable;
    private _clientDisposable;
    _clientsSubject: ReplaySubject<Client[]>;
    projectAdded: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    projectChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    projectRemoved: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    error: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
    msBuildProjectDiagnostics: Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
    packageRestoreStarted: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    packageRestoreFinished: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    unresolvedDependencies: Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;
    state: Observable<OmniSharp.CombinationKey<DriverState>[]>;
    status: Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]>;
    constructor(clients?: Client[]);
    dispose(): void;
    protected makeAggregateObserable: <T>(selector: (client: Client) => Observable<T>) => Observable<any>;
    observe<T>(selector: (client: Client) => Observable<T>): Observable<any>;
    private next;
    add(client: Client): Disposable;
}

}


declare module 'omnisharp-client/aggregate/composite-client-v1' {
import * as Rx from '@reactivex/rxjs';
import { ClientV1 } from 'omnisharp-client/clients/client-v1';
import { ObservationClientBase, CombinationClientBase } from 'omnisharp-client/aggregate/composite-client-base';
export class ObservationClientV1<T extends ClientV1> extends ObservationClientBase<T> implements OmniSharp.Events.V1 {
    autocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    changebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    codecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
    codeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
    currentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
    filesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
    findimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    getcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    gettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    gotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
    highlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
    navigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    project: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
    projects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    rename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    runcodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    signatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
    typelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    updatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
}
export class AggregateClientV1<T extends ClientV1> extends CombinationClientBase<T> implements OmniSharp.Events.Aggregate.V1 {
    autocomplete: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    changebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    codecheck: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    codeformat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
    currentfilemembersastree: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
    filesChanged: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
    findimplementations: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    findsymbols: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    findusages: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    fixusings: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    formatRange: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    getcodeactions: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
    gettestcontext: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    gotodefinition: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    gotofile: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    gotoregion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    highlight: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    metadata: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    navigatedown: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
    navigateup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
    packagesearch: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    packagesource: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    packageversion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    project: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
    projects: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    rename: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    runcodeaction: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
    signatureHelp: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
    typelookup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    updatebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
}

}


declare module 'omnisharp-client/aggregate/composite-client-v2' {
import * as Rx from '@reactivex/rxjs';
import { ClientV2 } from 'omnisharp-client/clients/client-v2';
import { ObservationClientBase, CombinationClientBase } from 'omnisharp-client/aggregate/composite-client-base';
export class ObservationClientV2<T extends ClientV2> extends ObservationClientBase<T> implements OmniSharp.Events.V2 {
    autocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    changebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    codecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
    codeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
    currentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
    filesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
    findimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    getcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    gettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    gotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
    highlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
    navigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    project: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
    projects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    rename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    runcodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    signatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
    typelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    updatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
}
export class AggregateClientV2<T extends ClientV2> extends CombinationClientBase<T> implements OmniSharp.Events.Aggregate.V2 {
    autocomplete: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    changebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    codecheck: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    codeformat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
    currentfilemembersastree: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
    filesChanged: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
    findimplementations: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    findsymbols: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    findusages: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    fixusings: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    formatRange: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    getcodeactions: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
    gettestcontext: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    gotodefinition: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    gotofile: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    gotoregion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    highlight: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    metadata: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    navigatedown: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
    navigateup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
    packagesearch: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    packagesource: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    packageversion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    project: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
    projects: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    rename: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    runcodeaction: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
    signatureHelp: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
    typelookup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    updatebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
}

}


declare module 'omnisharp-client/candidate-finder' {
import { ILogger } from 'omnisharp-client/interfaces';
import { Observable } from '@reactivex/rxjs';
export interface Options {
    solutionFilesToSearch?: string[];
    projectFilesToSearch?: string[];
    sourceFilesToSearch?: string[];
    solutionIndependentSourceFilesToSearch?: string[];
}
export function ifEmpty<T>(observable: Observable<T>, other: Observable<T>): Observable<T>;
export class Candidate {
    path: string;
    originalFile: string;
    isProject: boolean;
    constructor(originalFile: string, predicate: (path: string) => boolean);
    toString(): string;
}
export const findCandidates: {
    (location: string, logger: ILogger, options?: Options): Observable<string[]>;
    withCandidates: (location: string, logger: ILogger, options?: Options) => Observable<Candidate[]>;
};

}


declare module 'omnisharp-client/clients/client-base' {
import { Observable } from '@reactivex/rxjs';
import { IDisposable } from 'omnisharp-client/helpers/Disposable';
import { IDriver, OmnisharpClientStatus, OmnisharpClientOptions } from 'omnisharp-client/interfaces';
import { DriverState } from 'omnisharp-client/enums';
import { RequestContext, ResponseContext, CommandContext } from 'omnisharp-client/contexts';
export class ClientBase<TEvents extends ClientEventsBase> implements IDriver, IDisposable {
    private _options;
    static serverLineNumbers: string[];
    static serverLineNumberArrays: string[];
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
    private _plugins;
    uniqueId: string;
    id: string;
    serverPath: string;
    projectPath: string;
    currentState: DriverState;
    private _enqueuedEvents;
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Observable<DriverState>;
    outstandingRequests: number;
    private _currentRequests;
    getCurrentRequests(): {
        command: string;
        sequence: string;
        silent: boolean;
        request: any;
        duration: number;
    }[];
    status: Observable<OmnisharpClientStatus>;
    requests: Observable<RequestContext<any>>;
    private _enqueuedResponses;
    responses: Observable<ResponseContext<any, any>>;
    errors: Observable<CommandContext<any>>;
    private _observe;
    observe: TEvents;
    constructor(_options: OmnisharpClientOptions, observableFactory: (client: ClientBase<TEvents>) => TEvents);
    dispose(): void;
    private setupRequestStreams();
    private handleResult(context);
    log(message: string, logLevel?: string): void;
    connect(): void;
    disconnect(): void;
    request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Observable<TResponse>;
    private setupObservers();
    protected watchEvent: <TBody>(event: string) => Observable<TBody>;
    protected watchCommand: (command: string) => Observable<OmniSharp.Context<any, any>>;
    private _fixups;
    registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void): void;
    private _fixup<TRequest>(action, request, options?);
}
export class ClientEventsBase implements OmniSharp.Events {
    private _client;
    constructor(_client: any);
    uniqueId: any;
    projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectRemoved: Observable<OmniSharp.Models.ProjectInformationResponse>;
    error: Observable<OmniSharp.Models.ErrorMessage>;
    msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
    packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
    unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Observable<DriverState>;
    status: Observable<OmnisharpClientStatus>;
    requests: Observable<RequestContext<any>>;
    responses: Observable<ResponseContext<any, any>>;
    errors: Observable<CommandContext<any>>;
    private watchEvent(event);
    private watchCommand(command);
}

}


declare module 'omnisharp-client/clients/client-v1' {
import { Observable } from '@reactivex/rxjs';
import { ClientBase, ClientEventsBase } from 'omnisharp-client/clients/client-base';
import { OmnisharpClientOptions } from 'omnisharp-client/interfaces';
export class ClientEventsV1 extends ClientEventsBase implements OmniSharp.Events.V1 {
    updatebuffer: Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    changebuffer: Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    codecheck: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    formatAfterKeystroke: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    codeformat: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    findimplementations: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    gotodefinition: Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    highlight: Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigateup: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    navigatedown: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    rename: Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    signatureHelp: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    stopserver: Observable<OmniSharp.Context<any, boolean>>;
    checkalivestatus: Observable<OmniSharp.Context<any, boolean>>;
    checkreadystatus: Observable<OmniSharp.Context<any, boolean>>;
    currentfilemembersastree: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    currentfilemembersasflat: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    typelookup: Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    filesChanged: Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    projects: Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    project: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    getcodeactions: Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    runcodeaction: Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    gettestcontext: Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
}
export class ClientV1 extends ClientBase<ClientEventsV1> implements OmniSharp.Api.V1 {
    constructor(_options: OmnisharpClientOptions);
    updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Observable<any>;
    changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Observable<any>;
    codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
    formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
    codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse>;
    autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]>;
    findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse>;
    gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Observable<any>;
    navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
    gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.HighlightResponse>;
    metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.MetadataResponse>;
    navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
    packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse>;
    packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse>;
    packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse>;
    rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RenameResponse>;
    signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.SignatureHelp>;
    stopserver(options?: OmniSharp.RequestOptions): void;
    checkalivestatus(options?: OmniSharp.RequestOptions): void;
    checkreadystatus(options?: OmniSharp.RequestOptions): void;
    currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<any>;
    currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<any>;
    typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse>;
    filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Observable<boolean>;
    projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse>;
    project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse>;
    getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetCodeActionsResponse>;
    runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RunCodeActionResponse>;
    gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse>;
}

}


declare module 'omnisharp-client/clients/client-v2' {
import { Observable } from '@reactivex/rxjs';
import { ClientBase, ClientEventsBase } from 'omnisharp-client/clients/client-base';
import { ClientV1 } from 'omnisharp-client/clients/client-v1';
import { OmnisharpClientOptions } from 'omnisharp-client/interfaces';
export class ClientEventsV2 extends ClientEventsBase implements OmniSharp.Events.V2 {
    updatebuffer: Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    changebuffer: Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    codecheck: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    formatAfterKeystroke: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    codeformat: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    findimplementations: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    gotodefinition: Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    highlight: Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigateup: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    navigatedown: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    rename: Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    signatureHelp: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    stopserver: Observable<OmniSharp.Context<any, boolean>>;
    checkalivestatus: Observable<OmniSharp.Context<any, boolean>>;
    checkreadystatus: Observable<OmniSharp.Context<any, boolean>>;
    currentfilemembersastree: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    currentfilemembersasflat: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    typelookup: Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    filesChanged: Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    projects: Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    project: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    getcodeactions: Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    runcodeaction: Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    gettestcontext: Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
}
export class ClientV2 extends ClientBase<ClientEventsV2> implements OmniSharp.Api.V2 {
    constructor(_options: OmnisharpClientOptions);
    getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
    runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.RunCodeActionResponse>;
    updatebuffer: typeof ClientV1.prototype.updatebuffer;
    changebuffer: typeof ClientV1.prototype.changebuffer;
    codecheck: typeof ClientV1.prototype.codecheck;
    formatAfterKeystroke: typeof ClientV1.prototype.formatAfterKeystroke;
    formatRange: typeof ClientV1.prototype.formatRange;
    codeformat: typeof ClientV1.prototype.codeformat;
    autocomplete: typeof ClientV1.prototype.autocomplete;
    findimplementations: typeof ClientV1.prototype.findimplementations;
    findsymbols: typeof ClientV1.prototype.findsymbols;
    findusages: typeof ClientV1.prototype.findusages;
    fixusings: typeof ClientV1.prototype.fixusings;
    gotodefinition: typeof ClientV1.prototype.gotodefinition;
    gotofile: typeof ClientV1.prototype.gotofile;
    gotoregion: typeof ClientV1.prototype.gotoregion;
    highlight: typeof ClientV1.prototype.highlight;
    metadata: typeof ClientV1.prototype.metadata;
    navigateup: typeof ClientV1.prototype.navigateup;
    navigatedown: typeof ClientV1.prototype.navigatedown;
    packagesearch: typeof ClientV1.prototype.packagesearch;
    packagesource: typeof ClientV1.prototype.packagesource;
    packageversion: typeof ClientV1.prototype.packageversion;
    rename: typeof ClientV1.prototype.rename;
    signatureHelp: typeof ClientV1.prototype.signatureHelp;
    stopserver: typeof ClientV1.prototype.stopserver;
    checkalivestatus: typeof ClientV1.prototype.checkalivestatus;
    checkreadystatus: typeof ClientV1.prototype.checkreadystatus;
    currentfilemembersastree: typeof ClientV1.prototype.currentfilemembersastree;
    currentfilemembersasflat: typeof ClientV1.prototype.currentfilemembersasflat;
    typelookup: typeof ClientV1.prototype.typelookup;
    filesChanged: typeof ClientV1.prototype.filesChanged;
    projects: typeof ClientV1.prototype.projects;
    project: typeof ClientV1.prototype.project;
    gettestcontext: typeof ClientV1.prototype.gettestcontext;
}

}


declare module 'omnisharp-client/contexts' {
import { Observable } from '@reactivex/rxjs';
export class CommandContext<T> {
    command: string;
    value: T;
    constructor(command: string, value: T);
}
export class RequestContext<T> {
    clientId: string;
    command: string;
    request: T;
    sequence: string;
    time: Date;
    silent: boolean;
    oneBasedIndices: boolean;
    isCommand(command: string): boolean;
    constructor(clientId: string, command: string, request: T, {silent, oneBasedIndices}: OmniSharp.RequestOptions, sequence?: string);
    getResponse<TResponse>(stream: Observable<ResponseContext<T, TResponse>>): any;
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
    failed: boolean;
    isCommand(command: string): boolean;
    constructor({clientId, request, command, sequence, time, silent, oneBasedIndices}: RequestContext<any>, response?: TResponse, failed?: boolean);
}

}


declare module 'omnisharp-client/decorators' {
export function isNotNull(method: Function): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function isAboveZero(method: Function): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function precondition(method: Function, ...decorators: MethodDecorator[]): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function endpoint(version?: number): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function fixup(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function watchCommand(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function watchEvent(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function merge(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function aggregate(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function reference(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function inheritProperties(source: any, dest: any): void;

}


declare module 'omnisharp-client/enums' {
export enum Driver {
    Http = 0,
    Stdio = 1,
}
export enum DriverState {
    Disconnected = 0,
    Connecting = 1,
    Connected = 2,
    Error = 3,
    Bootstrapping = 4,
    Bootstrapped = 5,
}

}


declare module 'omnisharp-client/helpers/Disposable' {
export interface IDisposable {
    dispose(): void;
}
export interface ISubscription {
    unsubscribe(): void;
}
export type IDisposableOrSubscription = IDisposable | ISubscription | (() => void);
export class Disposable implements IDisposable {
    static empty: Disposable;
    static of(value: any): IDisposable;
    static create(action: () => void): Disposable;
    private _action;
    private _isDisposed;
    constructor(value: IDisposableOrSubscription);
    isDisposed: boolean;
    dispose(): void;
}
export class CompositeDisposable implements IDisposable {
    private _disposables;
    private _isDisposed;
    constructor(...disposables: IDisposableOrSubscription[]);
    isDisposed: boolean;
    dispose(): void;
    add(...disposables: IDisposableOrSubscription[]): void;
    remove(disposable: IDisposableOrSubscription): boolean;
}

}


declare module 'omnisharp-client/helpers/fromCallback' {
import { Observable } from '@reactivex/rxjs';
export function fromCallback<TResult, T1>(func: (arg1: T1, callback: (result: TResult) => any) => any): (arg1: T1) => Observable<TResult>;
export function fromCallback<TResult, T1, T2>(func: (arg1: T1, arg2: T2, callback: (result: TResult) => any) => any): (arg1: T1, arg2: T2) => Observable<TResult>;
export function fromCallback<TResult, T1, T2, T3>(func: (arg1: T1, arg2: T2, arg3: T3, callback: (result: TResult) => any) => any): (arg1: T1, arg2: T2, arg3: T3) => Observable<TResult>;
export function fromCallback<TResult, T1, T2, T3, T4>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (result: TResult) => any) => any): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Observable<TResult>;
export function fromCallback<TResult>(func: Function): (...args: any[]) => Observable<TResult>;
export function fromNodeCallback<TResult, T1>(func: (arg1: T1, callback: (result: TResult) => any) => any): (arg1: T1) => Observable<TResult>;
export function fromNodeCallback<TResult, T1, T2>(func: (arg1: T1, arg2: T2, callback: (result: TResult) => any) => any): (arg1: T1, arg2: T2) => Observable<TResult>;
export function fromNodeCallback<TResult, T1, T2, T3>(func: (arg1: T1, arg2: T2, arg3: T3, callback: (result: TResult) => any) => any): (arg1: T1, arg2: T2, arg3: T3) => Observable<TResult>;
export function fromNodeCallback<TResult, T1, T2, T3, T4>(func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (result: TResult) => any) => any): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Observable<TResult>;
export function fromNodeCallback<TResult>(func: Function): (...args: any[]) => Observable<TResult>;

}


declare module 'omnisharp-client/helpers/pausableBuffered' {
import { Observable } from '@reactivex/rxjs';
export function pausableBuffered<T>(observable: Observable<T>, pauser: Observable<boolean>): Observable<T>;

}


declare module 'omnisharp-client/helpers/plugin-manager' {
import { IOmnisharpPlugin } from 'omnisharp-client/interfaces';
import { Observable } from '@reactivex/rxjs';
export class PluginManager {
    private _solutionLocation;
    private _plugins;
    private _pluginsChanged;
    private _bootstrappedPlugins;
    private _currentBootstrap;
    constructor(_solutionLocation: string, plugins: IOmnisharpPlugin[]);
    getOmnisharpPath(): Observable<string>;
    add(plugin: IOmnisharpPlugin): void;
    remove(plugin: IOmnisharpPlugin): void;
}

}


declare module 'omnisharp-client/helpers/prioritization' {
import { RequestContext } from 'omnisharp-client/contexts';
export function isPriorityCommand(request: RequestContext<any>): boolean;
export function isNormalCommand(request: RequestContext<any>): boolean;
export function isDeferredCommand(request: RequestContext<any>): boolean;

}


declare module 'omnisharp-client/interfaces' {
import {IDisposable} from 'omnisharp-client/helpers/Disposable';
import {Observable} from '@reactivex/rxjs';
import {DriverState, Driver} from 'omnisharp-client/enums';
import {RequestContext, ResponseContext, CommandContext} from 'omnisharp-client/contexts';

export interface IStaticDriver {
    new (options: IDriverOptions): IDriver;
}

export interface ILogger {
    log(...values: any[]): void;
    error(...values: any[]): void;
}

export interface IDriverOptions {
    projectPath: string;
    remote?: boolean;
    debug?: boolean; // Start the debug server? (Run from source, to attach with a debug host like VS)
    serverPath?: string; // Start a given server, perhaps in a different directory.
    findProject?: boolean; // Should try and find the project using the project finder
    logger?: ILogger;
    timeout?: number; // timeout in seconds
    additionalArguments?: string[];
}

export interface IDriver extends IDisposable {
    id: string;
    connect(): void;
    currentState: DriverState;
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Observable<DriverState>;
    disconnect(): void;
    serverPath: string;
    projectPath: string;
    request<TRequest, TResponse>(command: string, request?: TRequest): Observable<TResponse>;
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
    };
    plugins?: IOmnisharpPlugin[];
}

export interface IOmnisharpPlugin {
    name?: string;
    version?: string;
    location?: string;
}

export interface OmnisharpClientStatus {
    state: DriverState;
    outgoingRequests: number;
    hasOutgoingRequests: boolean;
}

export module Omnisharp {
    interface Events {
        events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Observable<DriverState>;
        status: Observable<OmnisharpClientStatus>;
        requests: Observable<RequestContext<any>>;
        responses: Observable<ResponseContext<any, any>>;
        errors: Observable<CommandContext<any>>;
    }
}

}


declare module 'omnisharp-client' {
export { ClientV1 } from 'omnisharp-client/clients/client-v1';
export { ClientV2 } from 'omnisharp-client/clients/client-v2';
export { ObservationClientV1, AggregateClientV1 } from 'omnisharp-client/aggregate/composite-client-v1';
export { ObservationClientV2, AggregateClientV2 } from 'omnisharp-client/aggregate/composite-client-v2';
export { findCandidates } from 'omnisharp-client/candidate-finder';
export { Driver, DriverState } from 'omnisharp-client/enums';
export { IDriver, OmnisharpClientOptions, OmnisharpClientStatus } from 'omnisharp-client/interfaces';

}


declare module 'omnisharp-client/omnisharp-path' {
export var omnisharpLocation: any;
export var bootstrapLocation: any;

}


declare module 'omnisharp-client/options' {
import { OmnisharpClientOptions } from 'omnisharp-client/interfaces';
export function ensureClientOptions(options: OmnisharpClientOptions): void;
export function flattenArguments(obj: any, prefix?: string): any[];

}


declare module 'omnisharp-client/queue' {
export const enqueue: (cb: Function) => void;

}


declare module 'omnisharp-client/response-handling' {
export const serverLineNumbers: string[];
export const serverLineNumberArrays: string[];
export function requestMutator(data: any): any;
export function responseMutator(data: any): any;

}


declare module 'omnisharp-client/stdio/child' {

}
