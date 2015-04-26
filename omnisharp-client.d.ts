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
        projectPath: string;
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
    export class OmnisharpClient {
        constructor(_options: OmnisharpClientOptions);
        id: string;
        connect(): void;
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
        observeUpdatebuffer: Rx.Observable<any>;
        observeChangebuffer: Rx.Observable<any>;
        observeCodecheck: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        observeFormatAfterKeystroke: Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        observeFormatRange: Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        observeCodeformat: Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        observeAutocomplete: Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        observeFindimplementations: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        observeFindsymbols: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        observeFindusages: Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        observeGotodefinition: Rx.Observable<any>;
        observeNavigateup: Rx.Observable<OmniSharp.Models.NavigateResponse>;
        observeNavigatedown: Rx.Observable<OmniSharp.Models.NavigateResponse>;
        observeRename: Rx.Observable<OmniSharp.Models.RenameResponse>;
        observeSignatureHelp: Rx.Observable<OmniSharp.Models.SignatureHelp>;
        observeCheckalivestatus: Rx.Observable<boolean>;
        observeCheckreadystatus: Rx.Observable<boolean>;
        observeCurrentfilemembersastree: Rx.Observable<any>;
        observeCurrentfilemembersasflat: Rx.Observable<any>;
        observeTypelookup: Rx.Observable<any>;
        observeFilesChanged: Rx.Observable<boolean>;
        observeProjects: Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        observeProject: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        observeGetcodeactions: Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
        observeRuncodeaction: Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
        observeGettestcontext: Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        request<TRequest, TResponse>(action: string, request?: TRequest): Rx.Observable<TResponse>;
        updatebuffer(request: OmniSharp.Models.Request): Rx.Observable<any>;
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Rx.Observable<any>;
        codecheck(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatRange(request: OmniSharp.Models.FormatRangeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        codeformat(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        findimplementations(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findusages(request: OmniSharp.Models.FindUsagesRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotodefinition(request: OmniSharp.Models.Request): Rx.Observable<any>;
        navigateup(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigatedown(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        rename(request: OmniSharp.Models.RenameRequest): Rx.Observable<OmniSharp.Models.RenameResponse>;
        signatureHelp(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        checkalivestatus(): Rx.Observable<boolean>;
        checkreadystatus(): Rx.Observable<boolean>;
        currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable<any>;
        currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable<any>;
        typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable<any>;
        filesChanged(request: OmniSharp.Models.Request[]): Rx.Observable<boolean>;
        projects(): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        project(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        getcodeactions(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
        runcodeaction(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
        gettestcontext(request: OmniSharp.Models.TestCommandRequest): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
    }
}

declare module "omnisharp-node-client" {
    export = OmnisharpClient;
}
