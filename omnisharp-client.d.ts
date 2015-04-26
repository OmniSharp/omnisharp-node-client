/// <reference path="node_modules/omnisharp-server-roslyn-binaries/lib/server/omnisharp-server.d.ts" />

declare module OmnisharpClient {
    export enum Driver {
        Http = 0,
        Stdio = 1,
    }
    export enum DriverState {
        Disconnected = 0,
        Connecting = 1,
        Connected = 2,
    }
    export interface IDriverOptions {
        projectPath?: string;
        remote?: boolean;
        debug?: boolean;
        serverPath?: boolean;
    }
    export interface OmnisharpClientOptions extends IDriverOptions {
        driver?: Driver;
    }
    export interface OmnisharpClientStatus {
        state: DriverState;
        requestsPerSecond: number;
        responsesPerSecond: number;
        eventsPerSecond: number;
        operationsPerSecond: number;
        outgoingRequests: number;
        hasOutgoingRequests: boolean;
    }
    export class CommandWrapper<T> {
        command: string;
        value: T;
        constructor(command: string, value: T);
    }
    export interface Result<TRequest, TResponse>
    {
        request: TRequest;
        response: TResponse;
    }
    export class OmnisharpClient {
        constructor(_options?: OmnisharpClientOptions);
        id: string;
        connect(_options?: OmnisharpClientOptions): void;
        disconnect(): void;
        currentState: DriverState;
        events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Rx.Observable<DriverState>;
        outstandingRequests: number;
        status: Rx.Observable<OmnisharpClientStatus>;
        requests: Rx.Observable<CommandWrapper<any>>;
        responses: Rx.Observable<CommandWrapper<any>>;
        errors: Rx.Observable<CommandWrapper<any>>;

        updatebuffer(request: OmniSharp.Models.Request): Rx.Observable<any>;
        updatebufferPromise(request: OmniSharp.Models.Request): Rx.IPromise<any>;
        observeUpdatebuffer: Rx.Observable<Result<OmniSharp.Models.Request, any>>;
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Rx.Observable<any>;
        changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest): Rx.IPromise<any>;
        observeChangebuffer: Rx.Observable<Result<OmniSharp.Models.ChangeBufferRequest, any>>;
        codecheck(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        codecheckPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeCodecheck: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        observeFormatAfterKeystroke: Rx.Observable<Result<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        formatRange(request: OmniSharp.Models.FormatRangeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatRangePromise(request: OmniSharp.Models.FormatRangeRequest): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        observeFormatRange: Rx.Observable<Result<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        codeformat(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        codeformatPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.CodeFormatResponse>;
        observeCodeformat: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest): Rx.IPromise<OmniSharp.Models.AutoCompleteResponse[]>;
        observeAutocomplete: Rx.Observable<Result<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        findimplementations(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findimplementationsPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeFindimplementations: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeFindsymbols: Rx.Observable<Result<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        findusages(request: OmniSharp.Models.FindUsagesRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findusagesPromise(request: OmniSharp.Models.FindUsagesRequest): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeFindusages: Rx.Observable<Result<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        gotodefinition(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.GotoDefinitionResponse>;
        gotodefinitionPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.GotoDefinitionResponse>;
        observeGotodefinition: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.GotoDefinitionResponse>>;
        navigateup(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigateupPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        observeNavigateup: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        navigatedown(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigatedownPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        observeNavigatedown: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        rename(request: OmniSharp.Models.RenameRequest): Rx.Observable<OmniSharp.Models.RenameResponse>;
        renamePromise(request: OmniSharp.Models.RenameRequest): Rx.IPromise<OmniSharp.Models.RenameResponse>;
        observeRename: Rx.Observable<Result<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        signatureHelp(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        signatureHelpPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.SignatureHelp>;
        observeSignatureHelp: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
        checkalivestatus(request: any): Rx.Observable<boolean>;
        checkalivestatusPromise(request: any): Rx.IPromise<boolean>;
        observeCheckalivestatus: Rx.Observable<Result<any, boolean>>;
        checkreadystatus(request: any): Rx.Observable<boolean>;
        checkreadystatusPromise(request: any): Rx.IPromise<boolean>;
        observeCheckreadystatus: Rx.Observable<Result<any, boolean>>;
        currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable<any>;
        currentfilemembersastreePromise(request: OmniSharp.Models.Request): Rx.IPromise<any>;
        observeCurrentfilemembersastree: Rx.Observable<Result<OmniSharp.Models.Request, any>>;
        currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable<any>;
        currentfilemembersasflatPromise(request: OmniSharp.Models.Request): Rx.IPromise<any>;
        observeCurrentfilemembersasflat: Rx.Observable<Result<OmniSharp.Models.Request, any>>;
        typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable<any>;
        typelookupPromise(request: OmniSharp.Models.TypeLookupRequest): Rx.IPromise<any>;
        observeTypelookup: Rx.Observable<Result<OmniSharp.Models.TypeLookupRequest, any>>;
        filesChanged(request: OmniSharp.Models.Request[]): Rx.Observable<boolean>;
        filesChangedPromise(request: OmniSharp.Models.Request[]): Rx.IPromise<boolean>;
        observeFilesChanged: Rx.Observable<Result<OmniSharp.Models.Request[], boolean>>;
        projects(request: any): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        projectsPromise(request: any): Rx.IPromise<OmniSharp.Models.WorkspaceInformationResponse>;
        observeProjects: Rx.Observable<Result<any, OmniSharp.Models.WorkspaceInformationResponse>>;
        project(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        projectPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.ProjectInformationResponse>;
        observeProject: Rx.Observable<Result<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
        getcodeactions(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
        getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<OmniSharp.Models.GetCodeActionsResponse>;
        observeGetcodeactions: Rx.Observable<Result<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        runcodeaction(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
        runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<OmniSharp.Models.RunCodeActionResponse>;
        observeRuncodeaction: Rx.Observable<Result<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        gettestcontext(request: OmniSharp.Models.TestCommandRequest): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest): Rx.IPromise<OmniSharp.Models.GetTestCommandResponse>;
        observeGettestcontext: Rx.Observable<Result<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    }
}

declare module "omnisharp-node-client" {
    export = OmnisharpClient;
}
