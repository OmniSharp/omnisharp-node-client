
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
        Changes?: OmniSharp.Models.LinePositionSpanTextChange[];
        FileName?: string;
    }
    interface LinePositionSpanTextChange {
        NewText: string;
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
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
    interface DnxFramework {
        Name: string;
        FriendlyName: string;
        ShortName: string;
    }
    interface DnxProject {
        Path: string;
        Name: string;
        Commands: { [key: string]: string };
        Configurations: string[];
        ProjectSearchPaths: string[];
        Frameworks: OmniSharp.Models.DnxFramework[];
        GlobalJsonPath: string;
        SourceFiles: string[];
    }
    interface DnxWorkspaceInformation {
        Projects: OmniSharp.Models.DnxProject[];
        RuntimePath: string;
        DesignTimeHostPort: number;
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
    interface FixUsingsRequest extends OmniSharp.Models.Request {
        WantsTextChanges?: boolean;
    }
    interface FixUsingsResponse {
        Buffer: string;
        AmbiguousResults: OmniSharp.Models.QuickFix[];
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
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
    interface GetCodeActionsResponse {
        CodeActions: string[];
    }
    interface GetTestCommandResponse {
        Directory: string;
        TestCommand: string;
    }
    interface GotoDefinitionRequest extends OmniSharp.Models.Request {
        Timeout?: number;
        WantMetadata?: boolean;
    }
    interface GotoDefinitionResponse {
        FileName: string;
        Line: number;
        Column: number;
        MetadataSource: OmniSharp.Models.MetadataSource;
    }
    interface MetadataSource {
        AssemblyName: string;
        TypeName: string;
        ProjectName: string;
        VersionNumber: string;
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
        Lines?: number[];
        ProjectNames?: string[];
        Classifications?: OmniSharp.Models.HighlightClassification[];
        ExcludeClassifications?: OmniSharp.Models.HighlightClassification[];
    }
    interface HighlightResponse {
        Highlights: OmniSharp.Models.HighlightSpan[];
    }
    interface MetadataRequest extends OmniSharp.Models.MetadataSource {
        Timeout?: number;
    }
    interface MetadataResponse {
        SourceName: string;
        Source: string;
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
    interface PackageSearchItem {
        Id: string;
        HasVersion: boolean;
        Version: string;
        Description: string;
    }
    interface PackageSearchRequest {
        ProjectPath?: string;
        Sources?: string[];
        Search?: string;
        SupportedFrameworks?: string[];
        IncludePrerelease?: boolean;
        PackageTypes?: string[];
    }
    interface PackageSearchResponse {
        Packages: OmniSharp.Models.PackageSearchItem[];
    }
    interface PackageSourceRequest {
        ProjectPath?: string;
    }
    interface PackageSourceResponse {
        Sources: string[];
    }
    interface PackageVersionRequest {
        ProjectPath?: string;
        Sources?: string[];
        Id?: string;
        IncludePrerelease?: boolean;
    }
    interface PackageVersionResponse {
        Versions: string[];
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
        ApplyTextChanges?: boolean;
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
    interface UpdateBufferRequest extends OmniSharp.Models.Request {
        FromDisk?: boolean;
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
declare module OmniSharp.Models.v1 {
    interface ProjectInformationRequest {
        ExcludeSourceFiles?: boolean;
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
        // 'changebuffer'
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.Observable<any>;
        // 'checkalivestatus'
        checkalivestatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        // 'checkreadystatus'
        checkreadystatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        // 'codecheck'
        codecheck(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.Observable<boolean>;
        // 'findimplementations'
        findimplementations(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'fixusings'
        fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FixUsingsResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GotoDefinitionResponse>;
        // 'gotofile'
        gotofile(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.HighlightResponse>;
        // 'metadata'
        metadata(request: OmniSharp.Models.MetadataRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.MetadataResponse>;
        // 'navigatedown'
        navigatedown(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        // 'packagesearch'
        packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.PackageSearchResponse>;
        // 'packagesource'
        packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.PackageSourceResponse>;
        // 'packageversion'
        packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.PackageVersionResponse>;
        // 'project'
        project(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: OmniSharp.Models.CodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        // 'stopserver'
        stopserver(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        // 'typelookup'
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: RequestOptions): Rx.Observable<any>;
    }

    interface V2 {
        // 'autocomplete'
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        // 'changebuffer'
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Rx.Observable<any>;
        // 'checkalivestatus'
        checkalivestatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        // 'checkreadystatus'
        checkreadystatus(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        // 'codecheck'
        codecheck(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: OmniSharp.Models.Request[], options?: RequestOptions): Rx.Observable<boolean>;
        // 'findimplementations'
        findimplementations(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'fixusings'
        fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FixUsingsResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.GotoDefinitionResponse>;
        // 'gotofile'
        gotofile(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.HighlightResponse>;
        // 'metadata'
        metadata(request: OmniSharp.Models.MetadataRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.MetadataResponse>;
        // 'navigatedown'
        navigatedown(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.NavigateResponse>;
        // 'packagesearch'
        packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.PackageSearchResponse>;
        // 'packagesource'
        packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.PackageSourceResponse>;
        // 'packageversion'
        packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.PackageVersionResponse>;
        // 'project'
        project(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.V2.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: OmniSharp.Models.Request, options?: RequestOptions): Rx.Observable<OmniSharp.Models.SignatureHelp>;
        // 'stopserver'
        stopserver(request: any, options?: RequestOptions): Rx.Observable<boolean>;
        // 'typelookup'
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Rx.Observable<OmniSharp.Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: RequestOptions): Rx.Observable<any>;
    }

}
declare module OmniSharp.Events {

    interface V1 {
        // 'autocomplete'
        autocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        changebuffer: Rx.Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        // 'checkalivestatus'
        checkalivestatus: Rx.Observable<Context<any, boolean>>;
        // 'checkreadystatus'
        checkreadystatus: Rx.Observable<Context<any, boolean>>;
        // 'codecheck'
        codecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'codeformat'
        codeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
        // 'filesChanged'
        filesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;
        // 'findimplementations'
        findimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'findsymbols'
        findsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findusages'
        findusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'fixusings'
        fixusings: Rx.Observable<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'formatRange'
        formatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        // 'gotofile'
        gotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'gotoregion'
        gotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'highlight'
        highlight: Rx.Observable<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        // 'metadata'
        metadata: Rx.Observable<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        // 'navigatedown'
        navigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'navigateup'
        navigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'packagesearch'
        packagesearch: Rx.Observable<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        // 'packagesource'
        packagesource: Rx.Observable<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        // 'packageversion'
        packageversion: Rx.Observable<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        // 'project'
        project: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
        // 'projects'
        projects: Rx.Observable<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        // 'rename'
        rename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
        // 'stopserver'
        stopserver: Rx.Observable<Context<any, boolean>>;
        // 'typelookup'
        typelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    }

    interface V2 {
        // 'autocomplete'
        autocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        changebuffer: Rx.Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        // 'checkalivestatus'
        checkalivestatus: Rx.Observable<Context<any, boolean>>;
        // 'checkreadystatus'
        checkreadystatus: Rx.Observable<Context<any, boolean>>;
        // 'codecheck'
        codecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'codeformat'
        codeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>;
        // 'filesChanged'
        filesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;
        // 'findimplementations'
        findimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'findsymbols'
        findsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findusages'
        findusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'fixusings'
        fixusings: Rx.Observable<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'formatRange'
        formatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        // 'gotofile'
        gotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'gotoregion'
        gotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
        // 'highlight'
        highlight: Rx.Observable<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        // 'metadata'
        metadata: Rx.Observable<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        // 'navigatedown'
        navigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'navigateup'
        navigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
        // 'packagesearch'
        packagesearch: Rx.Observable<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        // 'packagesource'
        packagesource: Rx.Observable<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        // 'packageversion'
        packageversion: Rx.Observable<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        // 'project'
        project: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
        // 'projects'
        projects: Rx.Observable<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        // 'rename'
        rename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
        // 'stopserver'
        stopserver: Rx.Observable<Context<any, boolean>>;
        // 'typelookup'
        typelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    }

}
declare module OmniSharp.Events.Aggregate {

    interface V1 {
        // 'autocomplete'
        autocomplete: Rx.Observable<CombinationKey<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        changebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        // 'checkalivestatus'
        checkalivestatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'checkreadystatus'
        checkreadystatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'codecheck'
        codecheck: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'codeformat'
        codeformat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
        // 'filesChanged'
        filesChanged: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request[], boolean>>[]>;
        // 'findimplementations'
        findimplementations: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        findsymbols: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findusages'
        findusages: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'fixusings'
        fixusings: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        formatRange: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<CombinationKey<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<CombinationKey<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
        // 'gotofile'
        gotofile: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        gotoregion: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'highlight'
        highlight: Rx.Observable<CombinationKey<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        // 'metadata'
        metadata: Rx.Observable<CombinationKey<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
        // 'navigatedown'
        navigatedown: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'navigateup'
        navigateup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'packagesearch'
        packagesearch: Rx.Observable<CombinationKey<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
        // 'packagesource'
        packagesource: Rx.Observable<CombinationKey<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
        // 'packageversion'
        packageversion: Rx.Observable<CombinationKey<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
        // 'project'
        project: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
        // 'projects'
        projects: Rx.Observable<CombinationKey<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        rename: Rx.Observable<CombinationKey<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<CombinationKey<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
        // 'stopserver'
        stopserver: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'typelookup'
        typelookup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    }

    interface V2 {
        // 'autocomplete'
        autocomplete: Rx.Observable<CombinationKey<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        changebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        // 'checkalivestatus'
        checkalivestatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'checkreadystatus'
        checkreadystatus: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'codecheck'
        codecheck: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'codeformat'
        codeformat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
        // 'filesChanged'
        filesChanged: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request[], boolean>>[]>;
        // 'findimplementations'
        findimplementations: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        findsymbols: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findusages'
        findusages: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'fixusings'
        fixusings: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        formatRange: Rx.Observable<CombinationKey<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<CombinationKey<Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<CombinationKey<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
        // 'gotofile'
        gotofile: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        gotoregion: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'highlight'
        highlight: Rx.Observable<CombinationKey<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        // 'metadata'
        metadata: Rx.Observable<CombinationKey<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
        // 'navigatedown'
        navigatedown: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'navigateup'
        navigateup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
        // 'packagesearch'
        packagesearch: Rx.Observable<CombinationKey<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
        // 'packagesource'
        packagesource: Rx.Observable<CombinationKey<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
        // 'packageversion'
        packageversion: Rx.Observable<CombinationKey<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
        // 'project'
        project: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
        // 'projects'
        projects: Rx.Observable<CombinationKey<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        rename: Rx.Observable<CombinationKey<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<CombinationKey<Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<CombinationKey<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
        // 'stopserver'
        stopserver: Rx.Observable<CombinationKey<Context<any, boolean>>[]>;
        // 'typelookup'
        typelookup: Rx.Observable<CombinationKey<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<CombinationKey<Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
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