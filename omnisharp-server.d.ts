import {Observable} from "@reactivex/rxjs";

export module OmniSharp.Models {
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
    export interface AutoCompleteRequest extends OmniSharp.Models.Request {
        WordToComplete?: string;
        WantDocumentationForEveryCompletionResult?: boolean;
        WantImportableTypes?: boolean;
        WantMethodHeader?: boolean;
        WantSnippet?: boolean;
        WantReturnType?: boolean;
        WantKind?: boolean;
    }
    export interface Request {
        Line?: number;
        Column?: number;
        Buffer?: string;
        Changes?: OmniSharp.Models.LinePositionSpanTextChange[];
        FileName?: string;
    }
    export interface LinePositionSpanTextChange {
        NewText: string;
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
    }
    export interface AutoCompleteResponse {
        CompletionText: string;
        Description: string;
        DisplayText: string;
        RequiredNamespaceImport: string;
        MethodHeader: string;
        ReturnType: string;
        Snippet: string;
        Kind: string;
    }
    export interface ChangeBufferRequest {
        FileName?: string;
        StartLine?: number;
        StartColumn?: number;
        EndLine?: number;
        EndColumn?: number;
        NewText?: string;
    }
    export interface CodeActionRequest extends OmniSharp.Models.Request {
        CodeAction?: number;
        WantsTextChanges?: boolean;
        SelectionStartColumn?: number;
        SelectionStartLine?: number;
        SelectionEndColumn?: number;
        SelectionEndLine?: number;
    }
    export interface CodeCheckRequest extends OmniSharp.Models.Request {
    }
    export interface CodeFormatRequest extends OmniSharp.Models.Request {
    }
    export interface CodeFormatResponse {
        Buffer: string;
    }
    export interface DiagnosticLocation extends OmniSharp.Models.QuickFix {
        LogLevel: string;
    }
    export interface QuickFix {
        FileName: string;
        Line: number;
        Column: number;
        EndLine: number;
        EndColumn: number;
        Text: string;
        Projects: string[];
    }
    export interface ErrorMessage {
        Text: string;
        FileName: string;
        Line: number;
        Column: number;
    }
    export interface EventTypes {
    }
    export interface FileMemberElement {
        ChildNodes: OmniSharp.Models.FileMemberElement[];
        Location: OmniSharp.Models.QuickFix;
        Kind: string;
        Projects: string[];
    }
    export interface FileMemberTree {
        TopLevelTypeDefinitions: OmniSharp.Models.FileMemberElement[];
    }
    export interface FilesChangedRequest {
    }
    export interface FilesChangedResponse {
    }
    export interface FindImplementationsRequest extends OmniSharp.Models.Request {
    }
    export interface FindSymbolsRequest {
        Language?: string;
        Filter?: string;
    }
    export interface FindUsagesRequest extends OmniSharp.Models.Request {
        OnlyThisFile?: boolean;
        ExcludeDefinition?: boolean;
    }
    export interface FixUsingsRequest extends OmniSharp.Models.Request {
        WantsTextChanges?: boolean;
    }
    export interface FixUsingsResponse {
        Buffer: string;
        AmbiguousResults: OmniSharp.Models.QuickFix[];
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
    }
    export interface FormatAfterKeystrokeRequest extends OmniSharp.Models.Request {
        Character?: string;
        Char?: string;
    }
    export interface FormatRangeRequest extends OmniSharp.Models.Request {
        EndLine?: number;
        EndColumn?: number;
    }
    export interface FormatRangeResponse {
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
    }
    export interface GetCodeActionRequest extends OmniSharp.Models.CodeActionRequest {
    }
    export interface GetCodeActionsResponse {
        CodeActions: string[];
    }
    export interface GetTestCommandResponse {
        Directory: string;
        TestCommand: string;
    }
    export interface GotoDefinitionRequest extends OmniSharp.Models.Request {
        Timeout?: number;
        WantMetadata?: boolean;
    }
    export interface GotoDefinitionResponse {
        FileName: string;
        Line: number;
        Column: number;
        MetadataSource: OmniSharp.Models.MetadataSource;
    }
    export interface MetadataSource {
        AssemblyName: string;
        TypeName: string;
        ProjectName: string;
        VersionNumber: string;
        Language: string;
    }
    export interface GotoFileRequest extends OmniSharp.Models.Request {
    }
    export interface GotoRegionRequest extends OmniSharp.Models.Request {
    }
    export interface HighlightSpan {
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
        Kind: string;
        Projects: string[];
    }
    export interface HighlightRequest extends OmniSharp.Models.Request {
        Lines?: number[];
        ProjectNames?: string[];
        Classifications?: OmniSharp.Models.HighlightClassification[];
        ExcludeClassifications?: OmniSharp.Models.HighlightClassification[];
    }
    export interface HighlightResponse {
        Highlights: OmniSharp.Models.HighlightSpan[];
    }
    export interface MembersFlatRequest extends OmniSharp.Models.Request {
    }
    export interface MembersTreeRequest extends OmniSharp.Models.Request {
    }
    export interface MetadataRequest extends OmniSharp.Models.MetadataSource {
        Timeout?: number;
    }
    export interface MetadataResponse {
        SourceName: string;
        Source: string;
    }
    export interface ModifiedFileResponse {
        FileName: string;
        Buffer: string;
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
    }
    export interface NavigateDownRequest extends OmniSharp.Models.Request {
    }
    export interface NavigateResponse {
        Line: number;
        Column: number;
    }
    export interface NavigateUpRequest extends OmniSharp.Models.Request {
    }
    export interface PackageDependency {
        Name: string;
        Version: string;
    }
    export interface PackageRestoreMessage {
        FileName: string;
        Succeeded: boolean;
    }
    export interface PackageSearchItem {
        Id: string;
        HasVersion: boolean;
        Version: string;
        Description: string;
    }
    export interface PackageSearchRequest {
        ProjectPath?: string;
        Sources?: string[];
        Search?: string;
        SupportedFrameworks?: string[];
        IncludePrerelease?: boolean;
        PackageTypes?: string[];
    }
    export interface PackageSearchResponse {
        Packages: OmniSharp.Models.PackageSearchItem[];
    }
    export interface PackageSourceRequest {
        ProjectPath?: string;
    }
    export interface PackageSourceResponse {
        Sources: string[];
    }
    export interface PackageVersionRequest {
        ProjectPath?: string;
        Sources?: string[];
        Id?: string;
        IncludePrerelease?: boolean;
    }
    export interface PackageVersionResponse {
        Versions: string[];
    }
    export interface QuickFixResponse {
        QuickFixes: OmniSharp.Models.QuickFix[];
    }
    export interface RenameRequest extends OmniSharp.Models.Request {
        WantsTextChanges?: boolean;
        ApplyTextChanges?: boolean;
        RenameTo?: string;
    }
    export interface RenameResponse {
        Changes: OmniSharp.Models.ModifiedFileResponse[];
        ErrorMessage: string;
    }
    export interface RunCodeActionRequest extends OmniSharp.Models.CodeActionRequest {
    }
    export interface RunCodeActionResponse {
        Text: string;
        Changes: OmniSharp.Models.LinePositionSpanTextChange[];
    }
    export interface SignatureHelp {
        Signatures: OmniSharp.Models.SignatureHelpItem[];
        ActiveSignature: number;
        ActiveParameter: number;
    }
    export interface SignatureHelpItem {
        Name: string;
        Label: string;
        Documentation: string;
        Parameters: OmniSharp.Models.SignatureHelpParameter[];
    }
    export interface SignatureHelpParameter {
        Name: string;
        Label: string;
        Documentation: string;
    }
    export interface SignatureHelpRequest extends OmniSharp.Models.Request {
    }
    export interface SymbolLocation extends OmniSharp.Models.QuickFix {
        Kind: string;
    }
    export interface TestCommandRequest extends OmniSharp.Models.Request {
        Type?: OmniSharp.TestCommandType;
    }
    export interface TestCommandResponse {
        TestCommand: string;
    }
    export interface TypeLookupRequest extends OmniSharp.Models.Request {
        IncludeDocumentation?: boolean;
    }
    export interface TypeLookupResponse {
        Type: string;
        Documentation: string;
    }
    export interface UnresolvedDependenciesMessage {
        FileName: string;
        UnresolvedDependencies: OmniSharp.Models.PackageDependency[];
    }
    export interface UpdateBufferRequest extends OmniSharp.Models.Request {
        FromDisk?: boolean;
    }
    export interface DnxFramework {
        Name: string;
        FriendlyName: string;
        ShortName: string;
    }
    export interface DnxProject {
        Path: string;
        Name: string;
        Commands: { [key: string]: string };
        Configurations: string[];
        ProjectSearchPaths: string[];
        Frameworks: OmniSharp.Models.DnxFramework[];
        GlobalJsonPath: string;
        SourceFiles: string[];
    }
    export interface DnxWorkspaceInformation {
        Projects: OmniSharp.Models.DnxProject[];
        RuntimePath: string;
        DesignTimeHostPort: number;
    }
    export interface MSBuildDiagnosticsMessage {
        LogLevel: string;
        FileName: string;
        Text: string;
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
    }
    export interface MSBuildProject {
        ProjectGuid: string;
        Path: string;
        AssemblyName: string;
        TargetPath: string;
        TargetFramework: string;
        SourceFiles: string[];
    }
    export interface MSBuildProjectDiagnostics {
        FileName: string;
        Warnings: OmniSharp.Models.MSBuildDiagnosticsMessage[];
        Errors: OmniSharp.Models.MSBuildDiagnosticsMessage[];
    }
    export interface MsBuildWorkspaceInformation {
        SolutionPath: string;
        Projects: OmniSharp.Models.MSBuildProject[];
    }
}
export module OmniSharp.Models.V2 {
    export interface OmniSharpCodeAction {
        Identifier: string;
        Name: string;
    }
    export interface GetCodeActionsRequest extends OmniSharp.Models.Request {
        Selection?: OmniSharp.Models.V2.Range;
    }
    export interface Range {
        Start: OmniSharp.Models.V2.Point;
        End: OmniSharp.Models.V2.Point;
    }
    export interface Point {
        Line: number;
        Column: number;
    }
    export interface GetCodeActionsResponse {
        CodeActions: OmniSharp.Models.V2.OmniSharpCodeAction[];
    }
    export interface ICodeActionRequest {
        Line?: number;
        Column?: number;
        Buffer?: string;
        FileName?: string;
        Selection?: OmniSharp.Models.V2.Range;
    }
    export interface RunCodeActionRequest extends OmniSharp.Models.Request {
        Identifier?: string;
        Selection?: OmniSharp.Models.V2.Range;
        WantsTextChanges?: boolean;
    }
    export interface RunCodeActionResponse {
        Changes: OmniSharp.Models.ModifiedFileResponse[];
    }
}
export module OmniSharp.Models.v1 {
    export interface ProjectInformationRequest extends OmniSharp.Models.Request {
    }
    export interface WorkspaceInformationRequest {
        ExcludeSourceFiles?: boolean;
    }
}
export module OmniSharp.Stdio.Protocol {
    export interface EventPacket extends OmniSharp.Stdio.Protocol.Packet {
        Event: string;
        Body: any;
    }
    export interface Packet {
        Seq: number;
        Type?: string;
    }
    export interface RequestPacket extends OmniSharp.Stdio.Protocol.Packet {
        Command: string;
        Arguments: any;
    }
    export interface ResponsePacket extends OmniSharp.Stdio.Protocol.Packet {
        Request_seq: number;
        Command: string;
        Running: boolean;
        Success: boolean;
        Message: string;
        Body: any;
    }
}
export module OmniSharp.ScriptCs {
    export interface ScriptCsContext {
        CsxFiles: string[];
        References: string[];
        Usings: string[];
        ScriptPacks: string[];
        Path: string;
    }
}
export module OmniSharp {
    enum TestCommandType {
        All = 0,
        Fixture = 1,
        Single = 2
    }
}

export module OmniSharp {
    export interface Context<TRequest, TResponse>
    {
        request: TRequest;
        response: TResponse;
    }
    export interface RequestOptions
    {
        silent?: boolean;
        oneBasedIndices?: boolean
    }
    export interface CombinationKey<T>
    {
        key: string;
        value: T;
    }
}
export module OmniSharp.Api {

    export interface V1 {
        // 'autocomplete'
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        // 'changebuffer'
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        // 'codecheck'
        codecheck(request: OmniSharp.Models.CodeCheckRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: RequestOptions): Observable<OmniSharp.Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: OmniSharp.Models.Request[], options?: RequestOptions): Observable<OmniSharp.Models.FilesChangedResponse>;
        // 'findimplementations'
        findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'fixusings'
        fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: OmniSharp.Models.GetCodeActionRequest, options?: RequestOptions): Observable<OmniSharp.Models.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: RequestOptions): Observable<OmniSharp.Models.GotoDefinitionResponse>;
        // 'gotofile'
        gotofile(request: OmniSharp.Models.GotoFileRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Observable<OmniSharp.Models.HighlightResponse>;
        // 'metadata'
        metadata(request: OmniSharp.Models.MetadataRequest, options?: RequestOptions): Observable<OmniSharp.Models.MetadataResponse>;
        // 'navigatedown'
        navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
        // 'packagesearch'
        packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse>;
        // 'packagesource'
        packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse>;
        // 'packageversion'
        packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse>;
        // 'project'
        project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Observable<OmniSharp.Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: OmniSharp.Models.RunCodeActionRequest, options?: RequestOptions): Observable<OmniSharp.Models.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: RequestOptions): Observable<OmniSharp.Models.SignatureHelp>;
        // 'typelookup'
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }

    export interface V2 {
        // 'autocomplete'
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]>;
        // 'changebuffer'
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        // 'codecheck'
        codecheck(request: OmniSharp.Models.CodeCheckRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: RequestOptions): Observable<OmniSharp.Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: OmniSharp.Models.Request[], options?: RequestOptions): Observable<OmniSharp.Models.FilesChangedResponse>;
        // 'findimplementations'
        findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'fixusings'
        fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: RequestOptions): Observable<OmniSharp.Models.GotoDefinitionResponse>;
        // 'gotofile'
        gotofile(request: OmniSharp.Models.GotoFileRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: OmniSharp.Models.HighlightRequest, options?: RequestOptions): Observable<OmniSharp.Models.HighlightResponse>;
        // 'metadata'
        metadata(request: OmniSharp.Models.MetadataRequest, options?: RequestOptions): Observable<OmniSharp.Models.MetadataResponse>;
        // 'navigatedown'
        navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
        // 'packagesearch'
        packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse>;
        // 'packagesource'
        packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse>;
        // 'packageversion'
        packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse>;
        // 'project'
        project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: OmniSharp.Models.RenameRequest, options?: RequestOptions): Observable<OmniSharp.Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: OmniSharp.Models.V2.RunCodeActionRequest, options?: RequestOptions): Observable<OmniSharp.Models.V2.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: RequestOptions): Observable<OmniSharp.Models.SignatureHelp>;
        // 'typelookup'
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }

}
export module OmniSharp.Events {

    export interface V1 {
        // 'autocomplete'
        autocomplete: Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        changebuffer: Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        // 'codecheck'
        codecheck: Observable<Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'codeformat'
        codeformat: Observable<Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Observable<Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Observable<Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
        // 'filesChanged'
        filesChanged: Observable<Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
        // 'findimplementations'
        findimplementations: Observable<Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findsymbols'
        findsymbols: Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findusages'
        findusages: Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'fixusings'
        fixusings: Observable<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'formatRange'
        formatRange: Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'getcodeactions'
        getcodeactions: Observable<Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
        // 'gettestcontext'
        gettestcontext: Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        gotodefinition: Observable<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        // 'gotofile'
        gotofile: Observable<Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'gotoregion'
        gotoregion: Observable<Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'highlight'
        highlight: Observable<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        // 'metadata'
        metadata: Observable<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        // 'navigatedown'
        navigatedown: Observable<Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
        // 'navigateup'
        navigateup: Observable<Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
        // 'packagesearch'
        packagesearch: Observable<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        // 'packagesource'
        packagesource: Observable<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        // 'packageversion'
        packageversion: Observable<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        // 'project'
        project: Observable<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
        // 'projects'
        projects: Observable<Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        // 'rename'
        rename: Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        // 'runcodeaction'
        runcodeaction: Observable<Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
        // 'signatureHelp'
        signatureHelp: Observable<Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
        // 'typelookup'
        typelookup: Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        // 'updatebuffer'
        updatebuffer: Observable<Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    }

    export interface V2 {
        // 'autocomplete'
        autocomplete: Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        changebuffer: Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>;
        // 'codecheck'
        codecheck: Observable<Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'codeformat'
        codeformat: Observable<Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Observable<Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Observable<Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
        // 'filesChanged'
        filesChanged: Observable<Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
        // 'findimplementations'
        findimplementations: Observable<Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findsymbols'
        findsymbols: Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'findusages'
        findusages: Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'fixusings'
        fixusings: Observable<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'formatRange'
        formatRange: Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
        // 'getcodeactions'
        getcodeactions: Observable<Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
        // 'gettestcontext'
        gettestcontext: Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        gotodefinition: Observable<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
        // 'gotofile'
        gotofile: Observable<Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'gotoregion'
        gotoregion: Observable<Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
        // 'highlight'
        highlight: Observable<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
        // 'metadata'
        metadata: Observable<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
        // 'navigatedown'
        navigatedown: Observable<Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
        // 'navigateup'
        navigateup: Observable<Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
        // 'packagesearch'
        packagesearch: Observable<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
        // 'packagesource'
        packagesource: Observable<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
        // 'packageversion'
        packageversion: Observable<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
        // 'project'
        project: Observable<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
        // 'projects'
        projects: Observable<Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
        // 'rename'
        rename: Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
        // 'runcodeaction'
        runcodeaction: Observable<Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
        // 'signatureHelp'
        signatureHelp: Observable<Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
        // 'typelookup'
        typelookup: Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
        // 'updatebuffer'
        updatebuffer: Observable<Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    }

}
export module OmniSharp.Events.Aggregate {

    export interface V1 {
        // 'autocomplete'
        autocomplete: Observable<CombinationKey<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        changebuffer: Observable<CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        // 'codecheck'
        codecheck: Observable<CombinationKey<Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'codeformat'
        codeformat: Observable<CombinationKey<Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Observable<CombinationKey<Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Observable<CombinationKey<Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
        // 'filesChanged'
        filesChanged: Observable<CombinationKey<Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
        // 'findimplementations'
        findimplementations: Observable<CombinationKey<Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        findsymbols: Observable<CombinationKey<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findusages'
        findusages: Observable<CombinationKey<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'fixusings'
        fixusings: Observable<CombinationKey<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Observable<CombinationKey<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        formatRange: Observable<CombinationKey<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        getcodeactions: Observable<CombinationKey<Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        gettestcontext: Observable<CombinationKey<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        gotodefinition: Observable<CombinationKey<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
        // 'gotofile'
        gotofile: Observable<CombinationKey<Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        gotoregion: Observable<CombinationKey<Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'highlight'
        highlight: Observable<CombinationKey<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        // 'metadata'
        metadata: Observable<CombinationKey<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
        // 'navigatedown'
        navigatedown: Observable<CombinationKey<Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
        // 'navigateup'
        navigateup: Observable<CombinationKey<Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
        // 'packagesearch'
        packagesearch: Observable<CombinationKey<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
        // 'packagesource'
        packagesource: Observable<CombinationKey<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
        // 'packageversion'
        packageversion: Observable<CombinationKey<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
        // 'project'
        project: Observable<CombinationKey<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
        // 'projects'
        projects: Observable<CombinationKey<Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        rename: Observable<CombinationKey<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        // 'runcodeaction'
        runcodeaction: Observable<CombinationKey<Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        signatureHelp: Observable<CombinationKey<Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
        // 'typelookup'
        typelookup: Observable<CombinationKey<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        updatebuffer: Observable<CombinationKey<Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    }

    export interface V2 {
        // 'autocomplete'
        autocomplete: Observable<CombinationKey<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        changebuffer: Observable<CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
        // 'codecheck'
        codecheck: Observable<CombinationKey<Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'codeformat'
        codeformat: Observable<CombinationKey<Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Observable<CombinationKey<Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Observable<CombinationKey<Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
        // 'filesChanged'
        filesChanged: Observable<CombinationKey<Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
        // 'findimplementations'
        findimplementations: Observable<CombinationKey<Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        findsymbols: Observable<CombinationKey<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'findusages'
        findusages: Observable<CombinationKey<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'fixusings'
        fixusings: Observable<CombinationKey<Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Observable<CombinationKey<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        formatRange: Observable<CombinationKey<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        getcodeactions: Observable<CombinationKey<Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        gettestcontext: Observable<CombinationKey<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        gotodefinition: Observable<CombinationKey<Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
        // 'gotofile'
        gotofile: Observable<CombinationKey<Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        gotoregion: Observable<CombinationKey<Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
        // 'highlight'
        highlight: Observable<CombinationKey<Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
        // 'metadata'
        metadata: Observable<CombinationKey<Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
        // 'navigatedown'
        navigatedown: Observable<CombinationKey<Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
        // 'navigateup'
        navigateup: Observable<CombinationKey<Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
        // 'packagesearch'
        packagesearch: Observable<CombinationKey<Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
        // 'packagesource'
        packagesource: Observable<CombinationKey<Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
        // 'packageversion'
        packageversion: Observable<CombinationKey<Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
        // 'project'
        project: Observable<CombinationKey<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
        // 'projects'
        projects: Observable<CombinationKey<Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        rename: Observable<CombinationKey<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
        // 'runcodeaction'
        runcodeaction: Observable<CombinationKey<Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        signatureHelp: Observable<CombinationKey<Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
        // 'typelookup'
        typelookup: Observable<CombinationKey<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        updatebuffer: Observable<CombinationKey<Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    }

}
export module OmniSharp {
    export interface Events {
        projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
        projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
        projectRemoved: Observable<OmniSharp.Models.ProjectInformationResponse>;
        error: Observable<OmniSharp.Models.ErrorMessage>;
        msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
        packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
        packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
        unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    }
}
export module OmniSharp.Aggregate {
    export interface Events {
        projectAdded: Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        projectChanged: Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        projectRemoved: Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        error: Observable<CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
        msBuildProjectDiagnostics: Observable<CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
        packageRestoreStarted: Observable<CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        packageRestoreFinished: Observable<CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        unresolvedDependencies: Observable<CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;
    }
}

export module OmniSharp.Models {
    export interface ProjectInformationResponse {
        MsBuildProject: OmniSharp.Models.MSBuildProject;
        DnxProject: OmniSharp.Models.DnxProject;
    }

    export interface WorkspaceInformationResponse {
        Dnx: OmniSharp.Models.DnxWorkspaceInformation;
        MSBuild: OmniSharp.Models.MsBuildWorkspaceInformation;
        ScriptCs: OmniSharp.ScriptCs.ScriptCsContext;
    }
}
            