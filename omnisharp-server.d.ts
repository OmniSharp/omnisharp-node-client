
declare module OmniSharp.Models {
    enum HighlightClassification {
        Name = 1,
        Comment = 2,
        String = 3,
        Operator = 4,
        Punctuation = 5,
        Keyword = 6,
        Number = 7,
        Identifier = 8,
        PreprocessorKeyword = 9,
        ExcludedCode = 10
    }
    interface DnxProject {
        Path: string;
        Name: string;
        Commands: { [key: string]: string };
        Configurations: string[];
        ProjectSearchPaths: string[];
        Frameworks: string[];
        GlobalJsonPath: string;
        SourceFiles: string[];
    }
    interface DnxWorkspaceInformation {
        Projects: OmniSharp.Models.DnxProject[];
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
    interface HighlightSpan {
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
        Kind: string;
        Projects: string[];
    }
    interface HighlightRequest extends OmniSharp.Models.Request {
        Lines?: number;
        ProjectNames?: string;
        Classifications?: OmniSharp.Models.HighlightClassification;
        ExcludeClassifications?: OmniSharp.Models.HighlightClassification;
    }
    interface HighlightResponse {
        Highlights: OmniSharp.Models.HighlightSpan;
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
        SourceFiles: string[];
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
        DnxProject: OmniSharp.Models.DnxProject;
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
        Dnx: OmniSharp.Models.DnxWorkspaceInformation;
        MSBuild: OmniSharp.Models.MsBuildWorkspaceInformation;
        ScriptCs: OmniSharp.ScriptCs.ScriptCsContext;
    }
}
declare module OmniSharp.ScriptCs {
    interface ScriptCsContext {
        CsxFiles: string[];
        References: string[];
        Usings: string[];
        ScriptPacks: string[];
        Path: string;
    }
}
declare module OmniSharp.Models.V2 {
    interface OmniSharpCodeAction {
        Identifier: string;
        Name: string;
    }
    interface GetCodeActionsRequest extends OmniSharp.Models.Request {
        Selection?: OmniSharp.Models.V2.Range;
    }
    interface Range {
        Start: OmniSharp.Models.V2.Point;
        End: OmniSharp.Models.V2.Point;
    }
    interface Point {
        Line: number;
        Column: number;
    }
    interface GetCodeActionsResponse {
        CodeActions: OmniSharp.Models.V2.OmniSharpCodeAction[];
    }
    interface ICodeActionRequest {
        Line?: number;
        Column?: number;
        Buffer?: string;
        FileName?: string;
        Selection?: OmniSharp.Models.V2.Range;
    }
    interface RunCodeActionRequest extends OmniSharp.Models.Request {
        Identifier?: string;
        Selection?: OmniSharp.Models.V2.Range;
        WantsTextChanges?: boolean;
    }
    interface RunCodeActionResponse {
        Changes: OmniSharp.Models.ModifiedFileResponse[];
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
        oneBasedIndices?: boolean
    }
    interface CombinationKey<T>
    {
        key: string;
        value: T;
    }
}
declare module OmniSharp.Api {

    interface V1 {
        // 'autocomplete'
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.AutoCompleteResponse[]>;
        // 'changebuffer'
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.Observable<any>;
        changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.IPromise<any>;
        // 'checkalivestatus'
        checkalivestatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        checkalivestatusPromise(request: any, options?: RequestOptions): Rx.IPromise<boolean>;
        // 'checkreadystatus'
        checkreadystatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        checkreadystatusPromise(request: any, options?: RequestOptions): Rx.IPromise<boolean>;
        // 'codecheck'
        codecheck(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        codecheckPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        codeformatPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFix[]>;
        currentfilemembersasflatPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FileMemberTree>;
        currentfilemembersastreePromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.Observable<boolean>;
        filesChangedPromise(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.IPromise<boolean>;
        // 'findimplementations'
        findimplementations(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findimplementationsPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findusagesPromise(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatRangePromise(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
        getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<any>;
        gotodefinitionPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<any>;
        // 'gotofile'
        gotofile(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotofilePromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotoregionPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.HighlightResponse>;
        highlightPromise(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.HighlightResponse>;
        // 'navigatedown'
        navigatedown(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigatedownPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigateupPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        // 'project'
        project(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        projectPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: any, options?: RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        projectsPromise(request: any, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse>;
        renamePromise(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
        runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        signatureHelpPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.SignatureHelp>;
        // 'typelookup'
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
        typelookupPromise(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<any>;
        updatebufferPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<any>;
    }

    interface V2 {
        // 'autocomplete'
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.AutoCompleteResponse[]>;
        // 'changebuffer'
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.Observable<any>;
        changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.IPromise<any>;
        // 'checkalivestatus'
        checkalivestatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        checkalivestatusPromise(request: any, options?: RequestOptions): Rx.IPromise<boolean>;
        // 'checkreadystatus'
        checkreadystatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        checkreadystatusPromise(request: any, options?: RequestOptions): Rx.IPromise<boolean>;
        // 'codecheck'
        codecheck(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        codecheckPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        codeformatPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFix[]>;
        currentfilemembersasflatPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FileMemberTree>;
        currentfilemembersastreePromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.Observable<boolean>;
        filesChangedPromise(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.IPromise<boolean>;
        // 'findimplementations'
        findimplementations(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findimplementationsPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        findusagesPromise(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        formatRangePromise(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
        getcodeactionsPromise(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.V2.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<any>;
        gotodefinitionPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<any>;
        // 'gotofile'
        gotofile(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotofilePromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        gotoregionPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.HighlightResponse>;
        highlightPromise(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.HighlightResponse>;
        // 'navigatedown'
        navigatedown(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigatedownPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        navigateupPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.NavigateResponse>;
        // 'project'
        project(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        projectPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: any, options?: RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        projectsPromise(request: any, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse>;
        renamePromise(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse>;
        runcodeactionPromise(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.V2.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        signatureHelpPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.SignatureHelp>;
        // 'typelookup'
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
        typelookupPromise(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.IPromise<OmniSharp.Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<any>;
        updatebufferPromise(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.IPromise<any>;
    }

}
declare module OmniSharp.Events {

    interface V1 {
        // 'autocomplete'
        observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        // 'checkalivestatus'
        observeCheckalivestatus: Rx.Observable<Context<any, boolean>>;
        // 'checkreadystatus'
        observeCheckreadystatus: Rx.Observable<Context<any, boolean>>;
        // 'codecheck'
        observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'codeformat'
        observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
        // 'filesChanged'
        observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;
        // 'findimplementations'
        observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'findsymbols'
        observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findusages'
        observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'formatAfterKeystroke'
        observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'formatRange'
        observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'getcodeactions'
        observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        // 'gettestcontext'
        observeGettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
        // 'gotofile'
        observeGotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'gotoregion'
        observeGotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'highlight'
        observeHighlight: Rx.Observable<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        // 'navigatedown'
        observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'navigateup'
        observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'project'
        observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
        // 'projects'
        observeProjects: Rx.Observable<Context<any, OmniSharp.Models.WorkspaceInformationResponse>>;
        // 'rename'
        observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        // 'runcodeaction'
        observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        // 'signatureHelp'
        observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
        // 'typelookup'
        observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        // 'updatebuffer'
        observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
    }

    interface V2 {
        // 'autocomplete'
        observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        // 'checkalivestatus'
        observeCheckalivestatus: Rx.Observable<Context<any, boolean>>;
        // 'checkreadystatus'
        observeCheckreadystatus: Rx.Observable<Context<any, boolean>>;
        // 'codecheck'
        observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'codeformat'
        observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
        // 'filesChanged'
        observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;
        // 'findimplementations'
        observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'findsymbols'
        observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findusages'
        observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'formatAfterKeystroke'
        observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'formatRange'
        observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'getcodeactions'
        observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
        // 'gettestcontext'
        observeGettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
        // 'gotofile'
        observeGotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'gotoregion'
        observeGotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'highlight'
        observeHighlight: Rx.Observable<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        // 'navigatedown'
        observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'navigateup'
        observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'project'
        observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
        // 'projects'
        observeProjects: Rx.Observable<Context<any, OmniSharp.Models.WorkspaceInformationResponse>>;
        // 'rename'
        observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        // 'runcodeaction'
        observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
        // 'signatureHelp'
        observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
        // 'typelookup'
        observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        // 'updatebuffer'
        observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
    }

}
declare module OmniSharp.Events.Aggregate {

    interface V1 {
        // 'autocomplete'
        observeAutocomplete: Rx.Observable<CombinationKey<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        observeChangebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        // 'checkalivestatus'
        observeCheckalivestatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'checkreadystatus'
        observeCheckreadystatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'codecheck'
        observeCodecheck: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'codeformat'
        observeCodeformat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        observeCurrentfilemembersasflat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        observeCurrentfilemembersastree: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
        // 'filesChanged'
        observeFilesChanged: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request[], boolean>>[]>;
        // 'findimplementations'
        observeFindimplementations: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        observeFindsymbols: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findusages'
        observeFindusages: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'formatAfterKeystroke'
        observeFormatAfterKeystroke: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        observeFormatRange: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        observeGetcodeactions: Rx.Observable<CombinationKey<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        observeGettestcontext: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        observeGotodefinition: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, any>>[]>;
        // 'gotofile'
        observeGotofile: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        observeGotoregion: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'highlight'
        observeHighlight: Rx.Observable<CombinationKey<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        // 'navigatedown'
        observeNavigatedown: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'navigateup'
        observeNavigateup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'project'
        observeProject: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
        // 'projects'
        observeProjects: Rx.Observable<CombinationKey<Context<any, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        observeRename: Rx.Observable<CombinationKey<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        // 'runcodeaction'
        observeRuncodeaction: Rx.Observable<CombinationKey<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        observeSignatureHelp: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
        // 'typelookup'
        observeTypelookup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        observeUpdatebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, any>>[]>;
    }

    interface V2 {
        // 'autocomplete'
        observeAutocomplete: Rx.Observable<CombinationKey<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        observeChangebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        // 'checkalivestatus'
        observeCheckalivestatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'checkreadystatus'
        observeCheckreadystatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'codecheck'
        observeCodecheck: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'codeformat'
        observeCodeformat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        observeCurrentfilemembersasflat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        observeCurrentfilemembersastree: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
        // 'filesChanged'
        observeFilesChanged: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request[], boolean>>[]>;
        // 'findimplementations'
        observeFindimplementations: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        observeFindsymbols: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findusages'
        observeFindusages: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'formatAfterKeystroke'
        observeFormatAfterKeystroke: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        observeFormatRange: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        observeGetcodeactions: Rx.Observable<CombinationKey<Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        observeGettestcontext: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        observeGotodefinition: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, any>>[]>;
        // 'gotofile'
        observeGotofile: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        observeGotoregion: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'highlight'
        observeHighlight: Rx.Observable<CombinationKey<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        // 'navigatedown'
        observeNavigatedown: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'navigateup'
        observeNavigateup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'project'
        observeProject: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
        // 'projects'
        observeProjects: Rx.Observable<CombinationKey<Context<any, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        observeRename: Rx.Observable<CombinationKey<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        // 'runcodeaction'
        observeRuncodeaction: Rx.Observable<CombinationKey<Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        observeSignatureHelp: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
        // 'typelookup'
        observeTypelookup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        observeUpdatebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, any>>[]>;
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
declare module OmniSharp.Aggregate {
    interface Events {
        projectAdded: Rx.Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        projectChanged: Rx.Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        projectRemoved: Rx.Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        error: Rx.Observable<CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
        msBuildProjectDiagnostics: Rx.Observable<CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
        packageRestoreStarted: Rx.Observable<CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        packageRestoreFinished: Rx.Observable<CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        unresolvedDependencies: Rx.Observable<CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;
    }
}