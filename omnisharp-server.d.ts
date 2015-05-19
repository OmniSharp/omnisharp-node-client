
declare module OmniSharp.Models {
    interface AspNet5Project {
        Path: string;
        Name: string;
        Commands: { [key: string]: string };
        Configurations: string;
        ProjectSearchPaths: string;
        Frameworks: string;
        GlobalJsonPath: string;
        SourceFiles: string;
    }
    interface AspNet5WorkspaceInformation {
        Projects: OmniSharp.Models.AspNet5Project[];
        RuntimePath: string;
        DesignTimeHostPort: number;
    }
    interface AutoCompleteRequest extends OmniSharp.Models.Request {
        WordToComplete?: string;
        WantDocumentationForEveryCompletionResult?: boolean;
        WantImportableTypes?: boolean;
        WantMethodHeader?: boolean;
        WantSnippet?: boolean;
        WantReturnType?: boolean;
        WantKind?: boolean;
    }
    interface Request {
        Line?: number;
        Column?: number;
        Buffer?: string;
        FileName?: string;
    }
    interface AutoCompleteResponse {
        CompletionText: string;
        Description: string;
        DisplayText: string;
        RequiredNamespaceImport: string;
        MethodHeader: string;
        ReturnType: string;
        Snippet: string;
        Kind: string;
    }
    interface ChangeBufferRequest {
        FileName?: string;
        StartLine?: number;
        StartColumn?: number;
        EndLine?: number;
        EndColumn?: number;
        NewText?: string;
    }
    interface CodeActionRequest extends OmniSharp.Models.Request {
        CodeAction?: number;
        WantsTextChanges?: boolean;
        SelectionStartColumn?: number;
        SelectionStartLine?: number;
        SelectionEndColumn?: number;
        SelectionEndLine?: number;
    }
    interface CodeFormatResponse {
        Buffer: string;
    }
    interface DiagnosticLocation extends OmniSharp.Models.QuickFix {
        LogLevel: string;
    }
    interface QuickFix {
        FileName: string;
        Line: number;
        Column: number;
        EndLine: number;
        EndColumn: number;
        Text: string;
        Projects: string[];
    }
    interface ErrorMessage {
        Text: string;
        FileName: string;
        Line: number;
        Column: number;
    }
    interface EventTypes {
    }
    interface FileMemberElement {
        ChildNodes: OmniSharp.Models.FileMemberElement[];
        Location: OmniSharp.Models.QuickFix;
        Kind: string;
        Projects: string[];
    }
    interface FileMemberTree {
        TopLevelTypeDefinitions: OmniSharp.Models.FileMemberElement[];
    }
    interface FindSymbolsRequest {
        Filter?: string;
    }
    interface FindUsagesRequest extends OmniSharp.Models.Request {
        OnlyThisFile?: boolean;
        ExcludeDefinition?: boolean;
    }
    interface FormatAfterKeystrokeRequest extends OmniSharp.Models.Request {
        Character?: string;
        Char?: string;
    }
    interface FormatRangeRequest extends OmniSharp.Models.Request {
        EndLine?: number;
        EndColumn?: number;
    }
    interface FormatRangeResponse {
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
    }
    interface LinePositionSpanTextChange {
        NewText: string;
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
    }
    interface GetCodeActionsResponse {
        CodeActions: string[];
    }
    interface GetTestCommandResponse {
        Directory: string;
        TestCommand: string;
    }
    interface GotoDefinitionResponse {
        FileName: string;
        Line: number;
        Column: number;
    }
    interface ModifiedFileResponse {
        FileName: string;
        Buffer: string;
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
    }
    interface MSBuildDiagnosticsMessage {
        LogLevel: string;
        FileName: string;
        Text: string;
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
    }
    interface MSBuildProject {
        ProjectGuid: string;
        Path: string;
        AssemblyName: string;
        TargetPath: string;
        TargetFramework: string;
        SourceFiles: string;
    }
    interface MSBuildProjectDiagnostics {
        FileName: string;
        Warnings: OmniSharp.Models.MSBuildDiagnosticsMessage[];
        Errors: OmniSharp.Models.MSBuildDiagnosticsMessage[];
    }
    interface MsBuildWorkspaceInformation {
        SolutionPath: string;
        Projects: OmniSharp.Models.MSBuildProject[];
    }
    interface NavigateResponse {
        Line: number;
        Column: number;
    }
    interface PackageDependency {
        Name: string;
        Version: string;
    }
    interface PackageRestoreMessage {
        FileName: string;
        Succeeded: boolean;
    }
    interface ProjectInformationResponse {
        MsBuildProject: OmniSharp.Models.MSBuildProject;
        AspNet5Project: OmniSharp.Models.AspNet5Project;
    }
    interface QuickFixResponse {
        QuickFixes: OmniSharp.Models.QuickFix[];
    }
    interface RenameRequest extends OmniSharp.Models.Request {
        WantsTextChanges?: boolean;
        RenameTo?: string;
    }
    interface RenameResponse {
        Changes: OmniSharp.Models.ModifiedFileResponse[];
        ErrorMessage: string;
    }
    interface RunCodeActionResponse {
        Text: string;
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
    }
    interface SignatureHelp {
        Signatures: OmniSharp.Models.SignatureHelpItem[];
        ActiveSignature: number;
        ActiveParameter: number;
    }
    interface SignatureHelpItem {
        Name: string;
        Label: string;
        Documentation: string;
        Parameters: OmniSharp.Models.SignatureHelpParameter[];
    }
    interface SignatureHelpParameter {
        Name: string;
        Label: string;
        Documentation: string;
    }
    interface SymbolLocation extends OmniSharp.Models.QuickFix {
        Kind: string;
    }
    interface TestCommandRequest extends OmniSharp.Models.Request {
        Type?: OmniSharp.TestCommandType;
    }
    interface TestCommandResponse {
        TestCommand: string;
    }
    interface TypeLookupRequest extends OmniSharp.Models.Request {
        IncludeDocumentation?: boolean;
    }
    interface TypeLookupResponse {
        Type: string;
        Documentation: string;
    }
    interface UnresolvedDependenciesMessage {
        FileName: string;
        UnresolvedDependencies: OmniSharp.Models.PackageDependency[];
    }
    interface WorkspaceInformationResponse {
        AspNet5: OmniSharp.Models.AspNet5WorkspaceInformation;
        MSBuild: OmniSharp.Models.MsBuildWorkspaceInformation;
        ScriptCs: OmniSharp.ScriptCs.ScriptCsContext;
    }
}
declare module OmniSharp.ScriptCs {
    interface ScriptCsContext {
        CsxFiles: string;
        References: string;
        Usings: string;
        ScriptPacks: string;
        Path: string;
    }
}
declare module OmniSharp.Stdio.Protocol {
    interface EventPacket extends OmniSharp.Stdio.Protocol.Packet {
        Event: string;
        Body: any;
    }
    interface Packet {
        Seq: number;
        Type?: string;
    }
    interface RequestPacket extends OmniSharp.Stdio.Protocol.Packet {
        Command: string;
        Arguments: any;
    }
    interface ResponsePacket extends OmniSharp.Stdio.Protocol.Packet {
        Request_seq: number;
        Command: string;
        Running: boolean;
        Success: boolean;
        Message: string;
        Body: any;
    }
}
declare module OmniSharp {
    enum TestCommandType {
        All = 0,
        Fixture = 1,
        Single = 2
    }
}

declare module OmniSharp {
    interface Context<TRequest, TResponse>
    {
        request: TRequest;
        response: TResponse;
    }

    interface Api {
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
        gotodefinition(request: OmniSharp.Models.Request): Rx.Observable<any>;
        gotodefinitionPromise(request: OmniSharp.Models.Request): Rx.IPromise<any>;
        observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
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
        currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.FileMemberTree>;
        currentfilemembersastreePromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.FileMemberTree>;
        observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
        currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFix[]>;
        currentfilemembersasflatPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFix[]>;
        observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
        typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
        typelookupPromise(request: OmniSharp.Models.TypeLookupRequest): Rx.IPromise<OmniSharp.Models.TypeLookupResponse>;
        observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
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
declare module OmniSharp {
    interface Events {
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