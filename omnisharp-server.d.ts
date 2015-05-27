
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

    interface RequestOptions
    {
        silent?: boolean;
    }

    interface Api {
        updatebuffer(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<any>;
        updatebufferPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<any>;
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.Observable<any>;
        changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.IPromise<any>;
        codecheck(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        codecheckPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatRangePromise(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        codeformat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        codeformatPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.CodeFormatResponse>;
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.AutoCompleteResponse[]>;
        findimplementations(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findimplementationsPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findusagesPromise(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        gotodefinition(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<any>;
        gotodefinitionPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<any>;
        gotofile(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotofilePromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        gotoregion(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotoregionPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        navigateup(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigateupPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        navigatedown(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigatedownPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        rename(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse>;
        renamePromise(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.RenameResponse>;
        signatureHelp(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        signatureHelpPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.SignatureHelp>;
        checkalivestatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        checkalivestatusPromise(request: any, options?: RequestOptions): Rx.IPromise<boolean>;
        checkreadystatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        checkreadystatusPromise(request: any, options?: RequestOptions): Rx.IPromise<boolean>;
        currentfilemembersastree(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FileMemberTree>;
        currentfilemembersastreePromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FileMemberTree>;
        currentfilemembersasflat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFix[]>;
        currentfilemembersasflatPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFix[]>;
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
        typelookupPromise(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.TypeLookupResponse>;
        filesChanged(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.Observable<boolean>;
        filesChangedPromise(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.IPromise<boolean>;
        projects(request: any, options?: RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        projectsPromise(request: any, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.WorkspaceInformationResponse>;
        project(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        projectPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.ProjectInformationResponse>;
        getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
        getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.GetCodeActionsResponse>;
        runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
        runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.RunCodeActionResponse>;
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.GetTestCommandResponse>;
    }
}
declare module OmniSharp {
    interface Events {
        observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
        observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
        observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
        observeGotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        observeGotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
        observeCheckalivestatus: Rx.Observable<Context<any, boolean>>;
        observeCheckreadystatus: Rx.Observable<Context<any, boolean>>;
        observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
        observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
        observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;
        observeProjects: Rx.Observable<Context<any, OmniSharp.Models.WorkspaceInformationResponse>>;
        observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
        observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
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