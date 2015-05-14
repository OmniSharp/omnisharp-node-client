/// <reference path="./omnisharp-server.d.ts" />

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
        serverPath?: string;
        findProject?: boolean; // Should try and find the project using the project finder
        logger?: ILogger;
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
    export interface CommandWrapper<T> {
        command:string;
        value: T;
    }
    export interface RequestWrapper<T> {
        command: string;
        request: T;
    }

    export interface ResponseWrapper<TRequest, TResponse> {
        command: string;
        request: TRequest;
        response: TResponse;
    }

    export interface Context<TRequest, TResponse>
    {
        request: TRequest;
        response: TResponse;
    }

    export class OmnisharpClient {
        constructor(_options?: OmnisharpClientOptions);
        id: string;
        serverPath: string;
        projectPath: string;
        connect(_options?: OmnisharpClientOptions): void;
        disconnect(): void;
        currentState: DriverState;
        outstandingRequests: number;
        events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Rx.Observable<DriverState>;
        status: Rx.Observable<OmnisharpClientStatus>;
        requests: Rx.Observable<RequestWrapper<any>>;
        responses: Rx.Observable<ResponseWrapper<any, any>>;
        errors: Rx.Observable<CommandWrapper<any>>;

        updatebuffer(request: OmniSharp.Models.Request): Rx.Observable<any>;
        updatebufferPromise(request: OmniSharp.Models.Request): Rx.IPromise<any>;
        observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Rx.Observable<any>;
        changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest): Rx.IPromise<any>;
        observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        codecheck(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        codecheckPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        formatRange(request: OmniSharp.Models.FormatRangeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatRangePromise(request: OmniSharp.Models.FormatRangeRequest): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        codeformat(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        codeformatPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.CodeFormatResponse>;
        observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest): Rx.IPromise<OmniSharp.Models.AutoCompleteResponse[]>;
        observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        findimplementations(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findimplementationsPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        findusages(request: OmniSharp.Models.FindUsagesRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findusagesPromise(request: OmniSharp.Models.FindUsagesRequest): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        gotodefinition(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.GotoDefinitionResponse>;
        gotodefinitionPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.GotoDefinitionResponse>;
        observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.GotoDefinitionResponse>>;
        gotofile(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotofilePromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeGotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        gotoregion(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotoregionPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        observeGotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        navigateup(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigateupPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        navigatedown(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigatedownPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        rename(request: OmniSharp.Models.RenameRequest): Rx.Observable<OmniSharp.Models.RenameResponse>;
        renamePromise(request: OmniSharp.Models.RenameRequest): Rx.IPromise<OmniSharp.Models.RenameResponse>;
        observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        signatureHelp(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        signatureHelpPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.SignatureHelp>;
        observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
        checkalivestatus(request: any): Rx.Observable<boolean>;
        checkalivestatusPromise(request: any): Rx.IPromise<boolean>;
        observeCheckalivestatus: Rx.Observable<Context<any, boolean>>;
        checkreadystatus(request: any): Rx.Observable<boolean>;
        checkreadystatusPromise(request: any): Rx.IPromise<boolean>;
        observeCheckreadystatus: Rx.Observable<Context<any, boolean>>;
        currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable<any>;
        currentfilemembersastreePromise(request: OmniSharp.Models.Request): Rx.IPromise<any>;
        observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
        currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable<any>;
        currentfilemembersasflatPromise(request: OmniSharp.Models.Request): Rx.IPromise<any>;
        observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
        typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable<any>;
        typelookupPromise(request: OmniSharp.Models.TypeLookupRequest): Rx.IPromise<any>;
        observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, any>>;
        filesChanged(request: OmniSharp.Models.Request[]): Rx.Observable<boolean>;
        filesChangedPromise(request: OmniSharp.Models.Request[]): Rx.IPromise<boolean>;
        observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;
        projects(request: any): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        projectsPromise(request: any): Rx.IPromise<OmniSharp.Models.WorkspaceInformationResponse>;
        observeProjects: Rx.Observable<Context<any, OmniSharp.Models.WorkspaceInformationResponse>>;
        project(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        projectPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.ProjectInformationResponse>;
        observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
        getcodeactions(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
        getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<OmniSharp.Models.GetCodeActionsResponse>;
        observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        runcodeaction(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
        runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<OmniSharp.Models.RunCodeActionResponse>;
        observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        gettestcontext(request: OmniSharp.Models.TestCommandRequest): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest): Rx.IPromise<OmniSharp.Models.GetTestCommandResponse>;
        observeGettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    }
}

declare module "omnisharp-client" {
    export = OmnisharpClient;
}
