/// <reference path="./omnisharp-server.d.ts" />

declare module "omnisharp-client/aggregate/composite-client-base" {
import { ReplaySubject, Observable, CompositeDisposable, Disposable } from "rx";
import { ClientEventsBase } from "omnisharp-client/clients/client-base";
import { DriverState } from "omnisharp-client/enums";
import { OmnisharpClientStatus } from "omnisharp-client/interfaces";
export class ObservationClientBase<C extends ClientEventsBase> implements OmniSharp.Events, Rx.IDisposable {
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
    constructor(clients?: C[]);
    dispose(): void;
    protected makeMergeObserable<T>(selector: (client: C) => Observable<T>): Observable<T>;
    observe<T>(selector: (client: C) => Observable<T>): Observable<T>;
    private onNext;
    add(client: C): Disposable;
}
export class CombinationClientBase<C extends ClientEventsBase> implements OmniSharp.Aggregate.Events, Rx.IDisposable {
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
    protected makeAggregateObserable<T>(selector: (client: C) => Observable<T>): Observable<{
        key: any;
        value: T;
    }[]>;
    observe<T>(selector: (client: C) => Observable<T>): Observable<{
        key: any;
        value: T;
    }[]>;
    private onNext;
    add(client: C): Disposable;
}

}


declare module "omnisharp-client/aggregate/composite-client-v1" {
import { ClientEventsV1 } from "omnisharp-client/clients/client-v1";
import { ObservationClientBase, CombinationClientBase } from "omnisharp-client/aggregate/composite-client-base";
export class ObservationClientV1<T extends ClientEventsV1> extends ObservationClientBase<T> implements OmniSharp.Events.V1 {
    autocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    changebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    checkalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    checkreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    codecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    codeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    currentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    filesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    findimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    getcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    gettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    gotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    highlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    navigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    project: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    projects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    rename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    runcodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    signatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    stopserver: Rx.Observable<OmniSharp.Context<any, boolean>>;
    typelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    updatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
}
export class AggregateClientV1<T extends ClientEventsV1> extends CombinationClientBase<T> implements OmniSharp.Events.Aggregate.V1 {
    autocomplete: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    changebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    checkalivestatus: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    checkreadystatus: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    codecheck: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    codeformat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
    currentfilemembersastree: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
    filesChanged: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>[]>;
    findimplementations: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    findsymbols: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    findusages: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    fixusings: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    formatRange: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    getcodeactions: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
    gettestcontext: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    gotodefinition: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    gotofile: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    gotoregion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    highlight: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    metadata: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    navigatedown: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    navigateup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    packagesearch: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    packagesource: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    packageversion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    project: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
    projects: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    rename: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    runcodeaction: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
    signatureHelp: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
    stopserver: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    typelookup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    updatebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
}

}


declare module "omnisharp-client/aggregate/composite-client-v2" {
import { ClientEventsV2 } from "omnisharp-client/clients/client-v2";
import { ObservationClientBase, CombinationClientBase } from "omnisharp-client/aggregate/composite-client-base";
export class ObservationClientV2<T extends ClientEventsV2> extends ObservationClientBase<T> implements OmniSharp.Events.V2 {
    autocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    changebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    checkalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    checkreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    codecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    codeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    currentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    filesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    findimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    getcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    gettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    gotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    highlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    navigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    project: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    projects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    rename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    runcodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    signatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    stopserver: Rx.Observable<OmniSharp.Context<any, boolean>>;
    typelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    updatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
}
export class AggregateClientV2<T extends ClientEventsV2> extends CombinationClientBase<T> implements OmniSharp.Events.Aggregate.V2 {
    autocomplete: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    changebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    checkalivestatus: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    checkreadystatus: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    codecheck: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    codeformat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
    currentfilemembersastree: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
    filesChanged: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>[]>;
    findimplementations: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    findsymbols: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    findusages: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    fixusings: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    formatRange: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    getcodeactions: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
    gettestcontext: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    gotodefinition: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    gotofile: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    gotoregion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    highlight: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    metadata: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    navigatedown: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    navigateup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    packagesearch: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    packagesource: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    packageversion: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    project: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
    projects: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    rename: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    runcodeaction: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
    signatureHelp: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
    stopserver: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    typelookup: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    updatebuffer: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
}

}


declare module "omnisharp-client/candidate-finder" {
import { ILogger } from 'omnisharp-client/interfaces';
import { Observable } from "rx";
export interface Options {
    solutionFilesToSearch?: string[];
    projectFilesToSearch?: string[];
    sourceFilesToSearch?: string[];
    solutionIndependentSourceFilesToSearch?: string[];
}
export function findCandidates(location: string, logger: ILogger, options?: Options): Observable<string[]>;

}


declare module "omnisharp-client/clients/client-base" {
import { Observable } from "rx";
import { IDriver, OmnisharpClientStatus, OmnisharpClientOptions } from "omnisharp-client/interfaces";
import { DriverState } from "omnisharp-client/enums";
import { RequestContext, ResponseContext, CommandContext } from "omnisharp-client/contexts";
export class ClientBase<TEvents extends ClientEventsBase> implements IDriver, Rx.IDisposable {
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
    private _observe;
    observe: TEvents;
    constructor(_options: OmnisharpClientOptions, observableFactory: (client: ClientBase<TEvents>) => TEvents);
    dispose(): void;
    private setupRequestStreams();
    private handleResult(context);
    static serverLineNumbers: string[];
    static serverLineNumberArrays: string[];
    log(message: string, logLevel?: string): void;
    connect(): void;
    disconnect(): void;
    request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Rx.Observable<TResponse>;
    private setupObservers();
    protected watchEvent<TBody>(event: string): Observable<TBody>;
    protected watchCommand(command: string): Observable<OmniSharp.Context<any, any>>;
}
export class ClientEventsBase implements OmniSharp.Events {
    private _client;
    constructor(_client: any);
    uniqueId: any;
    projectAdded: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectChanged: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectRemoved: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    error: Rx.Observable<OmniSharp.Models.ErrorMessage>;
    msBuildProjectDiagnostics: Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    packageRestoreStarted: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    packageRestoreFinished: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    unresolvedDependencies: Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    private watchEvent(event);
    private watchCommand(command);
}

}


declare module "omnisharp-client/clients/client-v1" {
import { ClientBase, ClientEventsBase } from "omnisharp-client/clients/client-base";
import { OmnisharpClientOptions } from "omnisharp-client/interfaces";
export class ClientEventsV1 extends ClientEventsBase implements OmniSharp.Events.V1 {
    updatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    changebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    codecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    codeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    autocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    findimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    gotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    highlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    navigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    rename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    signatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    stopserver: Rx.Observable<OmniSharp.Context<any, boolean>>;
    checkalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    checkreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    currentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    typelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    filesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    projects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    project: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    getcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    runcodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    gettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
}
export class ClientV1 extends ClientBase<ClientEventsV1> implements OmniSharp.Api.V1 {
    constructor(_options: OmnisharpClientOptions);
    updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    codecheck(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
    formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
    codeformat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
    autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
    findimplementations(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.FixUsingsResponse>;
    gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    navigateup(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
    gotofile(request?: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    gotoregion(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
    highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.HighlightResponse>;
    metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.MetadataResponse>;
    navigatedown(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
    packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSearchResponse>;
    packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageSourceResponse>;
    packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.PackageVersionResponse>;
    rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse>;
    signatureHelp(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp>;
    stopserver(request: any, options?: OmniSharp.RequestOptions): Rx.Observable<boolean>;
    checkalivestatus(options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    checkreadystatus(options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    currentfilemembersastree(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    currentfilemembersasflat(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<any>;
    typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
    filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Rx.Observable<boolean>;
    projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
    project(request: OmniSharp.Models.Request, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
    runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
    gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
}

}


declare module "omnisharp-client/clients/client-v2" {
import { ClientBase, ClientEventsBase } from "omnisharp-client/clients/client-base";
import { ClientV1 } from "omnisharp-client/clients/client-v1";
import { OmnisharpClientOptions } from "omnisharp-client/interfaces";
export class ClientEventsV2 extends ClientEventsBase implements OmniSharp.Events.V2 {
    updatebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    changebuffer: Rx.Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    codecheck: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    formatAfterKeystroke: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    formatRange: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    codeformat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    autocomplete: Rx.Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    findimplementations: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    findsymbols: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    findusages: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    fixusings: Rx.Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    gotodefinition: Rx.Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    gotofile: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    gotoregion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    highlight: Rx.Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    metadata: Rx.Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    navigateup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    navigatedown: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    packagesearch: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    packagesource: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    packageversion: Rx.Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    rename: Rx.Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    signatureHelp: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    stopserver: Rx.Observable<OmniSharp.Context<any, boolean>>;
    checkalivestatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    checkreadystatus: Rx.Observable<OmniSharp.Context<any, boolean>>;
    currentfilemembersastree: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
    currentfilemembersasflat: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
    typelookup: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    filesChanged: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    projects: Rx.Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    project: Rx.Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    getcodeactions: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    runcodeaction: Rx.Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    gettestcontext: Rx.Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
}
export class ClientV2 extends ClientBase<ClientEventsV2> implements OmniSharp.Api.V2 {
    constructor(_options: OmnisharpClientOptions);
    getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
    runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse>;
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


declare module "omnisharp-client/contexts" {
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


declare module "omnisharp-client/decorators" {
export function isNotNull(method: Function): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function isAboveZero(method: Function): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function precondition(method: Function, ...decorators: MethodDecorator[]): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function endpoint(version?: number): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function watchCommand(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function watchEvent(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function merge(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function aggregate(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
export function inheritProperties(source: any, dest: any): void;

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
import {RequestContext, ResponseContext, CommandContext} from "omnisharp-client/contexts";

export interface IStaticDriver {
    new (options: IDriverOptions): IDriver;
}

export interface ILogger {
    log(...values: any[]);
    error(...values: any[]);
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

export interface IDriver extends Rx.IDisposable {
    id: string;
    connect();
    currentState: DriverState;
    events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Rx.Observable<DriverState>;
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
import { ClientV1 } from 'omnisharp-client/clients/client-v1';
import { ClientV2 } from 'omnisharp-client/clients/client-v2';
export var clients: {
    ClientV1: typeof ClientV1;
    ClientV2: typeof ClientV2;
};
import { ObservationClientV1, AggregateClientV1 } from 'omnisharp-client/aggregate/composite-client-v1';
import { ObservationClientV2, AggregateClientV2 } from 'omnisharp-client/aggregate/composite-client-v2';
export var aggregates: {
    ObservationClientV1: typeof ObservationClientV1;
    AggregateClientV1: typeof AggregateClientV1;
    ObservationClientV2: typeof ObservationClientV2;
    AggregateClientV2: typeof AggregateClientV2;
};
import { ProxyManager } from "omnisharp-client/proxy/proxy-manager";
import { ProxyClientV1 } from "omnisharp-client/proxy/proxy-client-v1";
import { ProxyClientV2 } from "omnisharp-client/proxy/proxy-client-v2";
export var proxies: {
    ProxyManager: typeof ProxyManager;
    ProxyClientV1: typeof ProxyClientV1;
    ProxyClientV2: typeof ProxyClientV2;
};
export { findCandidates } from "omnisharp-client/candidate-finder";
export { Driver, DriverState } from "omnisharp-client/enums";
export { IDriver, OmnisharpClientOptions, OmnisharpClientStatus } from "omnisharp-client/interfaces";

}


declare module "omnisharp-client/omnisharp-path" {
export var omnisharpLocation: any;

}


declare module "omnisharp-client/options" {
import { OmnisharpClientOptions } from "omnisharp-client/interfaces";
export function ensureClientOptions(options: OmnisharpClientOptions): void;
export function flattenArguments(obj: any, prefix?: string): any[];

}


declare module "omnisharp-client/project-finder" {
import { ILogger } from 'omnisharp-client/interfaces';
export function findProject(location: string, logger: ILogger): string;

}


declare module "omnisharp-client/proxy/client-proxy-wrapper" {
import { ChildProcess } from "child_process";
import { Observable, Disposable, AsyncSubject } from "rx";
export class MessageHandlers implements Rx.IDisposable {
    private _process;
    private _disposable;
    private _requestHandlers;
    private _observeHandlers;
    constructor(_process: ChildProcess);
    dispose(): void;
    request(clientId: string, methodName: string, handler: (result: any) => void, ...args: any[]): void;
    addObserveHandler(clientId: string, eventName: string, handler: (result: any) => void): Disposable;
    private _handle(m);
    private _handleRequest(m);
    private _handleObserve(m);
}
export class ClientProxyWrapper implements Rx.IDisposable {
    private _handlers;
    private _key;
    private _disposable;
    constructor(_handlers: MessageHandlers, _key: string, disposer: Rx.IDisposable);
    key: string;
    dispose(): void;
    request(methodName: string, returnResult: boolean, ...args: any[]): AsyncSubject<any>;
    observe(eventName: string): Observable<{}>;
}

}


declare module "omnisharp-client/proxy/constants" {
import { OmnisharpClientOptions } from "omnisharp-client/interfaces";
export const requestKey: string;
export const clientKey: string;
export const observeKey: string;
export interface Message {
    type: string;
    client: string;
}
export interface ExecuteMethodRequestMessage extends Message {
    method: string;
    args?: any[];
}
export interface ExecuteMethodResponseMessage extends Message {
    method: string;
    result: any;
}
export interface ObservationMessage extends Message {
    event: string;
    result: any;
}
export interface ObservationRequest extends Message {
    event: string;
    dispose?: boolean;
}
export interface ClientRequest extends Message {
    version: number;
    options: OmnisharpClientOptions;
    dispose?: boolean;
}

}


declare module "omnisharp-client/proxy/decorators" {
import { Observable } from "rx";
export function observe<T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Rx.Observable<T>>): void;
export function sync<T>(syncWith: () => Observable<T>): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function proxy(returnResult?: boolean): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export function proxyProperties(source: any, dest: any): void;

}


declare module "omnisharp-client/proxy/proxy-client-base" {
import { IDriver, OmnisharpClientStatus, OmnisharpClientOptions } from "omnisharp-client/interfaces";
import { Observable } from "rx";
import { DriverState } from "omnisharp-client/enums";
import { RequestContext, ResponseContext, CommandContext } from "omnisharp-client/contexts";
import { ClientEventsBase } from "omnisharp-client/clients/client-base";
import { ClientProxyWrapper } from "omnisharp-client/proxy/client-proxy-wrapper";
export class ProxyClientBase<TEvents extends ClientEventsBase> implements IDriver, Rx.IDisposable {
    protected _options: OmnisharpClientOptions;
    private _proxy;
    private _uniqueId;
    private _disposable;
    constructor(_options: OmnisharpClientOptions, observableFactory: (client: ProxyClientBase<TEvents>) => TEvents, _proxy: ClientProxyWrapper);
    private _observe;
    observe: TEvents;
    uniqueId: string;
    id: string;
    serverPath: string;
    projectPath: string;
    events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Rx.Observable<DriverState>;
    currentState: DriverState;
    getCurrentRequests(): Observable<{
        command: string;
        sequence: string;
        silent: boolean;
        request: any;
        duration: number;
    }>;
    status: Rx.Observable<OmnisharpClientStatus>;
    requests: Rx.Observable<RequestContext<any>>;
    responses: Rx.Observable<ResponseContext<any, any>>;
    errors: Rx.Observable<CommandContext<any>>;
    log(message: string, logLevel?: string): void;
    connect(_options?: OmnisharpClientOptions): void;
    disconnect(): void;
    request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Rx.Observable<TResponse>;
    projectAdded: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectChanged: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    projectRemoved: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    error: Rx.Observable<OmniSharp.Models.ErrorMessage>;
    msBuildProjectDiagnostics: Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    packageRestoreStarted: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    packageRestoreFinished: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    unresolvedDependencies: Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    dispose(): void;
}

}


declare module "omnisharp-client/proxy/proxy-client-v1" {
import { OmnisharpClientOptions } from "omnisharp-client/interfaces.d";
import { ProxyClientBase } from "omnisharp-client/proxy/proxy-client-base";
import { ClientV1, ClientEventsV1 } from "omnisharp-client/clients/client-v1";
import { ClientProxyWrapper } from "omnisharp-client/proxy/client-proxy-wrapper";
export class ProxyClientV1 extends ProxyClientBase<ClientEventsV1> implements OmniSharp.Api.V1 {
    constructor(_options: OmnisharpClientOptions, _proxy: ClientProxyWrapper);
    autocomplete: typeof ClientV1.prototype.autocomplete;
    changebuffer: typeof ClientV1.prototype.changebuffer;
    checkalivestatus: typeof ClientV1.prototype.checkalivestatus;
    checkreadystatus: typeof ClientV1.prototype.checkreadystatus;
    codecheck: typeof ClientV1.prototype.codecheck;
    codeformat: typeof ClientV1.prototype.codeformat;
    currentfilemembersasflat: typeof ClientV1.prototype.currentfilemembersasflat;
    currentfilemembersastree: typeof ClientV1.prototype.currentfilemembersastree;
    filesChanged: typeof ClientV1.prototype.filesChanged;
    findimplementations: typeof ClientV1.prototype.findimplementations;
    findsymbols: typeof ClientV1.prototype.findsymbols;
    findusages: typeof ClientV1.prototype.findusages;
    fixusings: typeof ClientV1.prototype.fixusings;
    formatAfterKeystroke: typeof ClientV1.prototype.formatAfterKeystroke;
    formatRange: typeof ClientV1.prototype.formatRange;
    getcodeactions: typeof ClientV1.prototype.getcodeactions;
    gettestcontext: typeof ClientV1.prototype.gettestcontext;
    gotodefinition: typeof ClientV1.prototype.gotodefinition;
    gotofile: typeof ClientV1.prototype.gotofile;
    gotoregion: typeof ClientV1.prototype.gotoregion;
    highlight: typeof ClientV1.prototype.highlight;
    metadata: typeof ClientV1.prototype.metadata;
    navigatedown: typeof ClientV1.prototype.navigatedown;
    navigateup: typeof ClientV1.prototype.navigateup;
    packagesearch: typeof ClientV1.prototype.packagesearch;
    packagesource: typeof ClientV1.prototype.packagesource;
    packageversion: typeof ClientV1.prototype.packageversion;
    project: typeof ClientV1.prototype.project;
    projects: typeof ClientV1.prototype.projects;
    rename: typeof ClientV1.prototype.rename;
    runcodeaction: typeof ClientV1.prototype.runcodeaction;
    signatureHelp: typeof ClientV1.prototype.signatureHelp;
    stopserver: typeof ClientV1.prototype.stopserver;
    typelookup: typeof ClientV1.prototype.typelookup;
    updatebuffer: typeof ClientV1.prototype.updatebuffer;
}

}


declare module "omnisharp-client/proxy/proxy-client-v2" {
import { OmnisharpClientOptions } from "omnisharp-client/interfaces.d";
import { ProxyClientBase } from "omnisharp-client/proxy/proxy-client-base";
import { ClientV2, ClientEventsV2 } from "omnisharp-client/clients/client-v2";
import { ClientProxyWrapper } from "omnisharp-client/proxy/client-proxy-wrapper";
export class ProxyClientV2 extends ProxyClientBase<ClientEventsV2> implements OmniSharp.Api.V2 {
    constructor(_options: OmnisharpClientOptions, _proxy: ClientProxyWrapper);
    autocomplete: typeof ClientV2.prototype.autocomplete;
    changebuffer: typeof ClientV2.prototype.changebuffer;
    checkalivestatus: typeof ClientV2.prototype.checkalivestatus;
    checkreadystatus: typeof ClientV2.prototype.checkreadystatus;
    codecheck: typeof ClientV2.prototype.codecheck;
    codeformat: typeof ClientV2.prototype.codeformat;
    currentfilemembersasflat: typeof ClientV2.prototype.currentfilemembersasflat;
    currentfilemembersastree: typeof ClientV2.prototype.currentfilemembersastree;
    filesChanged: typeof ClientV2.prototype.filesChanged;
    findimplementations: typeof ClientV2.prototype.findimplementations;
    findsymbols: typeof ClientV2.prototype.findsymbols;
    findusages: typeof ClientV2.prototype.findusages;
    fixusings: typeof ClientV2.prototype.fixusings;
    formatAfterKeystroke: typeof ClientV2.prototype.formatAfterKeystroke;
    formatRange: typeof ClientV2.prototype.formatRange;
    getcodeactions: typeof ClientV2.prototype.getcodeactions;
    gettestcontext: typeof ClientV2.prototype.gettestcontext;
    gotodefinition: typeof ClientV2.prototype.gotodefinition;
    gotofile: typeof ClientV2.prototype.gotofile;
    gotoregion: typeof ClientV2.prototype.gotoregion;
    highlight: typeof ClientV2.prototype.highlight;
    metadata: typeof ClientV2.prototype.metadata;
    navigatedown: typeof ClientV2.prototype.navigatedown;
    navigateup: typeof ClientV2.prototype.navigateup;
    packagesearch: typeof ClientV2.prototype.packagesearch;
    packagesource: typeof ClientV2.prototype.packagesource;
    packageversion: typeof ClientV2.prototype.packageversion;
    project: typeof ClientV2.prototype.project;
    projects: typeof ClientV2.prototype.projects;
    rename: typeof ClientV2.prototype.rename;
    runcodeaction: typeof ClientV2.prototype.runcodeaction;
    signatureHelp: typeof ClientV2.prototype.signatureHelp;
    stopserver: typeof ClientV2.prototype.stopserver;
    typelookup: typeof ClientV2.prototype.typelookup;
    updatebuffer: typeof ClientV2.prototype.updatebuffer;
}

}


declare module "omnisharp-client/proxy/proxy-manager" {
import { ProxyClientV1 } from "omnisharp-client/proxy/proxy-client-v1";
import { ProxyClientV2 } from "omnisharp-client/proxy/proxy-client-v2";
import { OmnisharpClientOptions } from "omnisharp-client/interfaces";
export class ProxyManager implements Rx.IDisposable {
    private _disposable;
    private _proxies;
    private _proxyDisposables;
    private _process;
    private _handlers;
    constructor();
    dispose(): void;
    getClientV1(options: OmnisharpClientOptions): ProxyClientV1;
    getClientV2(options: OmnisharpClientOptions): ProxyClientV2;
    private _getClient(type, version, options);
}

}


declare module "omnisharp-client/proxy/proxy-server" {
import { ClientRequest, ObservationRequest, ExecuteMethodRequestMessage } from "omnisharp-client/proxy/constants";
export class ProxyServer {
    private _disposable;
    private _clients;
    private _observers;
    handleClientRequest({client, version, dispose, options}: ClientRequest): void;
    handleMethodRequest({method, args, type, client}: ExecuteMethodRequestMessage): void;
    handleObserveRequest({event, type, client, dispose}: ObservationRequest): void;
}

}


declare module "omnisharp-client/queue" {
export var enqueue: (cb: Function) => void;

}


declare module "omnisharp-client/response-handling" {
export var serverLineNumbers: string[];
export var serverLineNumberArrays: string[];
export function requestMutator(data: any): any;
export function responseMutator(data: any): any;

}


declare module "omnisharp-client/stdio/child" {

}
