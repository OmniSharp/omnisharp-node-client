/* tslint:disable */

export module Models {
    export enum HighlightClassification {
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
    export interface AutoCompleteRequest extends Models.Request {
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
        Changes?: Models.LinePositionSpanTextChange[];
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
    export interface CodeActionRequest extends Models.Request {
        CodeAction?: number;
        WantsTextChanges?: boolean;
        SelectionStartColumn?: number;
        SelectionStartLine?: number;
        SelectionEndColumn?: number;
        SelectionEndLine?: number;
    }
    export interface CodeCheckRequest extends Models.Request {
    }
    export interface CodeFormatRequest extends Models.Request {
    }
    export interface CodeFormatResponse {
        Buffer: string;
    }
    export interface DiagnosticLocation extends Models.QuickFix {
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
        ChildNodes: Models.FileMemberElement[];
        Location: Models.QuickFix;
        Kind: string;
        Projects: string[];
    }
    export interface FileMemberTree {
        TopLevelTypeDefinitions: Models.FileMemberElement[];
    }
    export interface FilesChangedRequest {
    }
    export interface FilesChangedResponse {
    }
    export interface FindImplementationsRequest extends Models.Request {
    }
    export interface FindSymbolsRequest {
        Language?: string;
        Filter?: string;
    }
    export interface FindUsagesRequest extends Models.Request {
        OnlyThisFile?: boolean;
        ExcludeDefinition?: boolean;
    }
    export interface FixUsingsRequest extends Models.Request {
        WantsTextChanges?: boolean;
    }
    export interface FixUsingsResponse {
        Buffer: string;
        AmbiguousResults: Models.QuickFix[];
        Changes: Models.LinePositionSpanTextChange[];
    }
    export interface FormatAfterKeystrokeRequest extends Models.Request {
        Character?: string;
        Char?: string;
    }
    export interface FormatRangeRequest extends Models.Request {
        EndLine?: number;
        EndColumn?: number;
    }
    export interface FormatRangeResponse {
        Changes: Models.LinePositionSpanTextChange[];
    }
    export interface GetCodeActionRequest extends Models.CodeActionRequest {
    }
    export interface GetCodeActionsResponse {
        CodeActions: string[];
    }
    export interface GetTestCommandResponse {
        Directory: string;
        TestCommand: string;
    }
    export interface GotoDefinitionRequest extends Models.Request {
        Timeout?: number;
        WantMetadata?: boolean;
    }
    export interface GotoDefinitionResponse {
        FileName: string;
        Line: number;
        Column: number;
        MetadataSource: Models.MetadataSource;
    }
    export interface MetadataSource {
        AssemblyName: string;
        TypeName: string;
        ProjectName: string;
        VersionNumber: string;
        Language: string;
    }
    export interface GotoFileRequest extends Models.Request {
    }
    export interface GotoRegionRequest extends Models.Request {
    }
    export interface HighlightSpan {
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
        Kind: string;
        Projects: string[];
    }
    export interface HighlightRequest extends Models.Request {
        Lines?: number[];
        ProjectNames?: string[];
        Classifications?: Models.HighlightClassification[];
        ExcludeClassifications?: Models.HighlightClassification[];
    }
    export interface HighlightResponse {
        Highlights: Models.HighlightSpan[];
    }
    export interface MembersFlatRequest extends Models.Request {
    }
    export interface MembersTreeRequest extends Models.Request {
    }
    export interface MetadataRequest extends Models.MetadataSource {
        Timeout?: number;
    }
    export interface MetadataResponse {
        SourceName: string;
        Source: string;
    }
    export interface ModifiedFileResponse {
        FileName: string;
        Buffer: string;
        Changes: Models.LinePositionSpanTextChange[];
    }
    export interface NavigateDownRequest extends Models.Request {
    }
    export interface NavigateResponse {
        Line: number;
        Column: number;
    }
    export interface NavigateUpRequest extends Models.Request {
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
        Packages: Models.PackageSearchItem[];
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
        QuickFixes: Models.QuickFix[];
    }
    export interface RenameRequest extends Models.Request {
        WantsTextChanges?: boolean;
        ApplyTextChanges?: boolean;
        RenameTo?: string;
    }
    export interface RenameResponse {
        Changes: Models.ModifiedFileResponse[];
        ErrorMessage: string;
    }
    export interface RunCodeActionRequest extends Models.CodeActionRequest {
    }
    export interface RunCodeActionResponse {
        Text: string;
        Changes: Models.LinePositionSpanTextChange[];
    }
    export interface SignatureHelp {
        Signatures: Models.SignatureHelpItem[];
        ActiveSignature: number;
        ActiveParameter: number;
    }
    export interface SignatureHelpItem {
        Name: string;
        Label: string;
        Documentation: string;
        Parameters: Models.SignatureHelpParameter[];
    }
    export interface SignatureHelpParameter {
        Name: string;
        Label: string;
        Documentation: string;
    }
    export interface SignatureHelpRequest extends Models.Request {
    }
    export interface SymbolLocation extends Models.QuickFix {
        Kind: string;
    }
    export interface TestCommandRequest extends Models.Request {
        Type?: TestCommandType;
    }
    export interface TestCommandResponse {
        TestCommand: string;
    }
    export interface TypeLookupRequest extends Models.Request {
        IncludeDocumentation?: boolean;
    }
    export interface TypeLookupResponse {
        Type: string;
        Documentation: string;
    }
    export interface UnresolvedDependenciesMessage {
        FileName: string;
        UnresolvedDependencies: Models.PackageDependency[];
    }
    export interface UpdateBufferRequest extends Models.Request {
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
        Frameworks: Models.DnxFramework[];
        GlobalJsonPath: string;
        SourceFiles: string[];
    }
    export interface DnxWorkspaceInformation {
        Projects: Models.DnxProject[];
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
        Warnings: Models.MSBuildDiagnosticsMessage[];
        Errors: Models.MSBuildDiagnosticsMessage[];
    }
    export interface MsBuildWorkspaceInformation {
        SolutionPath: string;
        Projects: Models.MSBuildProject[];
    }
}
export module Models.V2 {
    export interface OmniSharpCodeAction {
        Identifier: string;
        Name: string;
    }
    export interface GetCodeActionsRequest extends Models.Request {
        Selection?: Models.V2.Range;
    }
    export interface Range {
        Start: Models.V2.Point;
        End: Models.V2.Point;
    }
    export interface Point {
        Line: number;
        Column: number;
    }
    export interface GetCodeActionsResponse {
        CodeActions: Models.V2.OmniSharpCodeAction[];
    }
    export interface ICodeActionRequest {
        Line?: number;
        Column?: number;
        Buffer?: string;
        FileName?: string;
        Selection?: Models.V2.Range;
    }
    export interface RunCodeActionRequest extends Models.Request {
        Identifier?: string;
        Selection?: Models.V2.Range;
        WantsTextChanges?: boolean;
    }
    export interface RunCodeActionResponse {
        Changes: Models.ModifiedFileResponse[];
    }
}
export module Models.v1 {
    export interface ProjectInformationRequest extends Models.Request {
    }
    export interface WorkspaceInformationRequest {
        ExcludeSourceFiles?: boolean;
    }
}
export module Stdio.Protocol {
    export interface EventPacket extends Stdio.Protocol.Packet {
        Event: string;
        Body: any;
    }
    export interface Packet {
        Seq: number;
        Type?: string;
    }
    export interface RequestPacket extends Stdio.Protocol.Packet {
        Command: string;
        Arguments: any;
    }
    export interface ResponsePacket extends Stdio.Protocol.Packet {
        Request_seq: number;
        Command: string;
        Running: boolean;
        Success: boolean;
        Message: string;
        Body: any;
    }
}
export module ScriptCs {
    export interface ScriptCsContext {
        CsxFiles: string[];
        References: string[];
        Usings: string[];
        ScriptPacks: string[];
        Path: string;
    }
}

    export enum TestCommandType {
        All = 0,
        Fixture = 1,
        Single = 2
    }



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

export module Api {

    export interface V1 {
        // 'autocomplete'
        autocomplete(request: Models.AutoCompleteRequest, options?: RequestOptions): Rx.Observable<Models.AutoCompleteResponse[]>;
        // 'changebuffer'
        changebuffer(request: Models.ChangeBufferRequest, options?: RequestOptions): Rx.Observable<any>;
        // 'codecheck'
        codecheck(request: Models.CodeCheckRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: Models.CodeFormatRequest, options?: RequestOptions): Rx.Observable<Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: Models.MembersFlatRequest, options?: RequestOptions): Rx.Observable<Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: Models.MembersTreeRequest, options?: RequestOptions): Rx.Observable<Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: Models.Request[], options?: RequestOptions): Rx.Observable<Models.FilesChangedResponse>;
        // 'findimplementations'
        findimplementations(request: Models.FindImplementationsRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: Models.FindSymbolsRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: Models.FindUsagesRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'fixusings'
        fixusings(request: Models.FixUsingsRequest, options?: RequestOptions): Rx.Observable<Models.FixUsingsResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.Observable<Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: Models.FormatRangeRequest, options?: RequestOptions): Rx.Observable<Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: Models.GetCodeActionRequest, options?: RequestOptions): Rx.Observable<Models.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: Models.TestCommandRequest, options?: RequestOptions): Rx.Observable<Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: Models.GotoDefinitionRequest, options?: RequestOptions): Rx.Observable<Models.GotoDefinitionResponse>;
        // 'gotofile'
        gotofile(request: Models.GotoFileRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: Models.GotoRegionRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: Models.HighlightRequest, options?: RequestOptions): Rx.Observable<Models.HighlightResponse>;
        // 'metadata'
        metadata(request: Models.MetadataRequest, options?: RequestOptions): Rx.Observable<Models.MetadataResponse>;
        // 'navigatedown'
        navigatedown(request: Models.NavigateDownRequest, options?: RequestOptions): Rx.Observable<Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: Models.NavigateUpRequest, options?: RequestOptions): Rx.Observable<Models.NavigateResponse>;
        // 'packagesearch'
        packagesearch(request: Models.PackageSearchRequest, options?: RequestOptions): Rx.Observable<Models.PackageSearchResponse>;
        // 'packagesource'
        packagesource(request: Models.PackageSourceRequest, options?: RequestOptions): Rx.Observable<Models.PackageSourceResponse>;
        // 'packageversion'
        packageversion(request: Models.PackageVersionRequest, options?: RequestOptions): Rx.Observable<Models.PackageVersionResponse>;
        // 'project'
        project(request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Rx.Observable<Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Rx.Observable<Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: Models.RenameRequest, options?: RequestOptions): Rx.Observable<Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: Models.RunCodeActionRequest, options?: RequestOptions): Rx.Observable<Models.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: Models.SignatureHelpRequest, options?: RequestOptions): Rx.Observable<Models.SignatureHelp>;
        // 'typelookup'
        typelookup(request: Models.TypeLookupRequest, options?: RequestOptions): Rx.Observable<Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: Models.UpdateBufferRequest, options?: RequestOptions): Rx.Observable<any>;
    }

    export interface V2 {
        // 'autocomplete'
        autocomplete(request: Models.AutoCompleteRequest, options?: RequestOptions): Rx.Observable<Models.AutoCompleteResponse[]>;
        // 'changebuffer'
        changebuffer(request: Models.ChangeBufferRequest, options?: RequestOptions): Rx.Observable<any>;
        // 'codecheck'
        codecheck(request: Models.CodeCheckRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'codeformat'
        codeformat(request: Models.CodeFormatRequest, options?: RequestOptions): Rx.Observable<Models.CodeFormatResponse>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat(request: Models.MembersFlatRequest, options?: RequestOptions): Rx.Observable<Models.QuickFix[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree(request: Models.MembersTreeRequest, options?: RequestOptions): Rx.Observable<Models.FileMemberTree>;
        // 'filesChanged'
        filesChanged(request: Models.Request[], options?: RequestOptions): Rx.Observable<Models.FilesChangedResponse>;
        // 'findimplementations'
        findimplementations(request: Models.FindImplementationsRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'findsymbols'
        findsymbols(request: Models.FindSymbolsRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'findusages'
        findusages(request: Models.FindUsagesRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'fixusings'
        fixusings(request: Models.FixUsingsRequest, options?: RequestOptions): Rx.Observable<Models.FixUsingsResponse>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke(request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Rx.Observable<Models.FormatRangeResponse>;
        // 'formatRange'
        formatRange(request: Models.FormatRangeRequest, options?: RequestOptions): Rx.Observable<Models.FormatRangeResponse>;
        // 'getcodeactions'
        getcodeactions(request: Models.V2.GetCodeActionsRequest, options?: RequestOptions): Rx.Observable<Models.V2.GetCodeActionsResponse>;
        // 'gettestcontext'
        gettestcontext(request: Models.TestCommandRequest, options?: RequestOptions): Rx.Observable<Models.GetTestCommandResponse>;
        // 'gotodefinition'
        gotodefinition(request: Models.GotoDefinitionRequest, options?: RequestOptions): Rx.Observable<Models.GotoDefinitionResponse>;
        // 'gotofile'
        gotofile(request: Models.GotoFileRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'gotoregion'
        gotoregion(request: Models.GotoRegionRequest, options?: RequestOptions): Rx.Observable<Models.QuickFixResponse>;
        // 'highlight'
        highlight(request: Models.HighlightRequest, options?: RequestOptions): Rx.Observable<Models.HighlightResponse>;
        // 'metadata'
        metadata(request: Models.MetadataRequest, options?: RequestOptions): Rx.Observable<Models.MetadataResponse>;
        // 'navigatedown'
        navigatedown(request: Models.NavigateDownRequest, options?: RequestOptions): Rx.Observable<Models.NavigateResponse>;
        // 'navigateup'
        navigateup(request: Models.NavigateUpRequest, options?: RequestOptions): Rx.Observable<Models.NavigateResponse>;
        // 'packagesearch'
        packagesearch(request: Models.PackageSearchRequest, options?: RequestOptions): Rx.Observable<Models.PackageSearchResponse>;
        // 'packagesource'
        packagesource(request: Models.PackageSourceRequest, options?: RequestOptions): Rx.Observable<Models.PackageSourceResponse>;
        // 'packageversion'
        packageversion(request: Models.PackageVersionRequest, options?: RequestOptions): Rx.Observable<Models.PackageVersionResponse>;
        // 'project'
        project(request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Rx.Observable<Models.ProjectInformationResponse>;
        // 'projects'
        projects(request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Rx.Observable<Models.WorkspaceInformationResponse>;
        // 'rename'
        rename(request: Models.RenameRequest, options?: RequestOptions): Rx.Observable<Models.RenameResponse>;
        // 'runcodeaction'
        runcodeaction(request: Models.V2.RunCodeActionRequest, options?: RequestOptions): Rx.Observable<Models.V2.RunCodeActionResponse>;
        // 'signatureHelp'
        signatureHelp(request: Models.SignatureHelpRequest, options?: RequestOptions): Rx.Observable<Models.SignatureHelp>;
        // 'typelookup'
        typelookup(request: Models.TypeLookupRequest, options?: RequestOptions): Rx.Observable<Models.TypeLookupResponse>;
        // 'updatebuffer'
        updatebuffer(request: Models.UpdateBufferRequest, options?: RequestOptions): Rx.Observable<any>;
    }

}
export module Events {

    export interface V1 {
        // 'autocomplete'
        autocomplete: Rx.Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        changebuffer: Rx.Observable<Context<Models.ChangeBufferRequest, any>>;
        // 'codecheck'
        codecheck: Rx.Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        // 'codeformat'
        codeformat: Rx.Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        // 'filesChanged'
        filesChanged: Rx.Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        // 'findimplementations'
        findimplementations: Rx.Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        // 'findsymbols'
        findsymbols: Rx.Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        // 'findusages'
        findusages: Rx.Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        // 'fixusings'
        fixusings: Rx.Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        // 'formatRange'
        formatRange: Rx.Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        // 'gotofile'
        gotofile: Rx.Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        // 'gotoregion'
        gotoregion: Rx.Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        // 'highlight'
        highlight: Rx.Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        // 'metadata'
        metadata: Rx.Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        // 'navigatedown'
        navigatedown: Rx.Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        // 'navigateup'
        navigateup: Rx.Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        // 'packagesearch'
        packagesearch: Rx.Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        // 'packagesource'
        packagesource: Rx.Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        // 'packageversion'
        packageversion: Rx.Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        // 'project'
        project: Rx.Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        // 'projects'
        projects: Rx.Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        // 'rename'
        rename: Rx.Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        // 'typelookup'
        typelookup: Rx.Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<Context<Models.UpdateBufferRequest, any>>;
    }

    export interface V2 {
        // 'autocomplete'
        autocomplete: Rx.Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        // 'changebuffer'
        changebuffer: Rx.Observable<Context<Models.ChangeBufferRequest, any>>;
        // 'codecheck'
        codecheck: Rx.Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        // 'codeformat'
        codeformat: Rx.Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        // 'filesChanged'
        filesChanged: Rx.Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        // 'findimplementations'
        findimplementations: Rx.Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        // 'findsymbols'
        findsymbols: Rx.Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        // 'findusages'
        findusages: Rx.Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        // 'fixusings'
        fixusings: Rx.Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        // 'formatRange'
        formatRange: Rx.Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        // 'gotofile'
        gotofile: Rx.Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        // 'gotoregion'
        gotoregion: Rx.Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        // 'highlight'
        highlight: Rx.Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        // 'metadata'
        metadata: Rx.Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        // 'navigatedown'
        navigatedown: Rx.Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        // 'navigateup'
        navigateup: Rx.Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        // 'packagesearch'
        packagesearch: Rx.Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        // 'packagesource'
        packagesource: Rx.Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        // 'packageversion'
        packageversion: Rx.Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        // 'project'
        project: Rx.Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        // 'projects'
        projects: Rx.Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        // 'rename'
        rename: Rx.Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        // 'typelookup'
        typelookup: Rx.Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<Context<Models.UpdateBufferRequest, any>>;
    }

}
export module Events.Aggregate {

    export interface V1 {
        // 'autocomplete'
        autocomplete: Rx.Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        changebuffer: Rx.Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        // 'codecheck'
        codecheck: Rx.Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        // 'codeformat'
        codeformat: Rx.Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        // 'filesChanged'
        filesChanged: Rx.Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        // 'findimplementations'
        findimplementations: Rx.Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        findsymbols: Rx.Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        // 'findusages'
        findusages: Rx.Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        // 'fixusings'
        fixusings: Rx.Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        formatRange: Rx.Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<CombinationKey<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        // 'gotofile'
        gotofile: Rx.Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        gotoregion: Rx.Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        // 'highlight'
        highlight: Rx.Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        // 'metadata'
        metadata: Rx.Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        // 'navigatedown'
        navigatedown: Rx.Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        // 'navigateup'
        navigateup: Rx.Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        // 'packagesearch'
        packagesearch: Rx.Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        // 'packagesource'
        packagesource: Rx.Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        // 'packageversion'
        packageversion: Rx.Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        // 'project'
        project: Rx.Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        // 'projects'
        projects: Rx.Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        rename: Rx.Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<CombinationKey<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        // 'typelookup'
        typelookup: Rx.Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }

    export interface V2 {
        // 'autocomplete'
        autocomplete: Rx.Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        // 'changebuffer'
        changebuffer: Rx.Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        // 'codecheck'
        codecheck: Rx.Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        // 'codeformat'
        codeformat: Rx.Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        // 'currentfilemembersasflat'
        currentfilemembersasflat: Rx.Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        // 'currentfilemembersastree'
        currentfilemembersastree: Rx.Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        // 'filesChanged'
        filesChanged: Rx.Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        // 'findimplementations'
        findimplementations: Rx.Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        // 'findsymbols'
        findsymbols: Rx.Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        // 'findusages'
        findusages: Rx.Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        // 'fixusings'
        fixusings: Rx.Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        // 'formatAfterKeystroke'
        formatAfterKeystroke: Rx.Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        // 'formatRange'
        formatRange: Rx.Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        // 'getcodeactions'
        getcodeactions: Rx.Observable<CombinationKey<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>[]>;
        // 'gettestcontext'
        gettestcontext: Rx.Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        // 'gotodefinition'
        gotodefinition: Rx.Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        // 'gotofile'
        gotofile: Rx.Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        // 'gotoregion'
        gotoregion: Rx.Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        // 'highlight'
        highlight: Rx.Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        // 'metadata'
        metadata: Rx.Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        // 'navigatedown'
        navigatedown: Rx.Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        // 'navigateup'
        navigateup: Rx.Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        // 'packagesearch'
        packagesearch: Rx.Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        // 'packagesource'
        packagesource: Rx.Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        // 'packageversion'
        packageversion: Rx.Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        // 'project'
        project: Rx.Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        // 'projects'
        projects: Rx.Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        // 'rename'
        rename: Rx.Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        // 'runcodeaction'
        runcodeaction: Rx.Observable<CombinationKey<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>[]>;
        // 'signatureHelp'
        signatureHelp: Rx.Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        // 'typelookup'
        typelookup: Rx.Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        // 'updatebuffer'
        updatebuffer: Rx.Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }

}

    export interface Events {
        projectAdded: Rx.Observable<Models.ProjectInformationResponse>;
        projectChanged: Rx.Observable<Models.ProjectInformationResponse>;
        projectRemoved: Rx.Observable<Models.ProjectInformationResponse>;
        error: Rx.Observable<Models.ErrorMessage>;
        msBuildProjectDiagnostics: Rx.Observable<Models.MSBuildProjectDiagnostics>;
        packageRestoreStarted: Rx.Observable<Models.PackageRestoreMessage>;
        packageRestoreFinished: Rx.Observable<Models.PackageRestoreMessage>;
        unresolvedDependencies: Rx.Observable<Models.UnresolvedDependenciesMessage>;
    }

export module Aggregate {
    export interface Events {
        projectAdded: Rx.Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        projectChanged: Rx.Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        projectRemoved: Rx.Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        error: Rx.Observable<CombinationKey<Models.ErrorMessage>[]>;
        msBuildProjectDiagnostics: Rx.Observable<CombinationKey<Models.MSBuildProjectDiagnostics>[]>;
        packageRestoreStarted: Rx.Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        packageRestoreFinished: Rx.Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        unresolvedDependencies: Rx.Observable<CombinationKey<Models.UnresolvedDependenciesMessage>[]>;
    }
}

export module Models {
    export interface ProjectInformationResponse {
        MsBuildProject: Models.MSBuildProject;
        DnxProject: Models.DnxProject;
    }

    export interface WorkspaceInformationResponse {
        Dnx: Models.DnxWorkspaceInformation;
        MSBuild: Models.MsBuildWorkspaceInformation;
        ScriptCs: ScriptCs.ScriptCsContext;
    }
}
            
