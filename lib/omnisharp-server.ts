/* tslint:disable */
import {Observable} from "rxjs";

export module Models {
    export const enum HighlightClassification {
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
    export interface SyntaxFeature {
        Name: string;
        Data: string;
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
    export interface DiagnosticMessage {
        Results: Models.DiagnosticResult[];
    }
    export interface DiagnosticResult {
        FileName: string;
        QuickFixes: Models.DiagnosticLocation[];
    }
    export interface DiagnosticsRequest extends Models.Request {
    }
    export interface DiagnosticsResponse {
    }
    export interface ErrorMessage {
        Text: string;
        FileName: string;
        Line: number;
        Column: number;
    }
    export interface EventTypes {
    }
    export interface FileCloseRequest extends Models.Request {
    }
    export interface FileCloseResponse {
    }
    export interface FileMemberElement {
        ChildNodes: Models.FileMemberElement[];
        Location: Models.QuickFix;
        Kind: string;
        Features: Models.SyntaxFeature[];
        Projects: string[];
    }
    export interface FileMemberTree {
        TopLevelTypeDefinitions: Models.FileMemberElement[];
    }
    export interface FileOpenRequest extends Models.Request {
    }
    export interface FileOpenResponse {
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
export module Models {
    export interface DotNetConfiguration {
        Name: string;
        CompilationOutputPath: string;
        CompilationOutputAssemblyFile: string;
        CompilationOutputPdbFile: string;
        EmitEntryPoint: boolean;
    }
    export interface DotNetFramework {
        Name: string;
        FriendlyName: string;
        ShortName: string;
    }
    export interface DotNetProjectInformation {
        Path: string;
        Name: string;
        ProjectSearchPaths: string[];
        Configurations: Models.DotNetConfiguration[];
        Frameworks: Models.DotNetFramework[];
        SourceFiles: string[];
    }
    export interface DotNetWorkspaceInformation {
        Projects: Models.DotNetProjectInformation[];
        RuntimePath: string;
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
        CsxFilesBeingProcessed: string[];
        CsxFileProjects: System.Collections.Generic.KeyValuePair<string, Microsoft.CodeAnalysis.ProjectInfo>;
        CsxReferences: System.Collections.Generic.KeyValuePair<string, Microsoft.CodeAnalysis.MetadataReference[]>;
        CsxLoadReferences: System.Collections.Generic.KeyValuePair<string, Microsoft.CodeAnalysis.ProjectInfo[]>;
        CsxUsings: System.Collections.Generic.KeyValuePair<string, string[]>;
        ScriptPacks: string[];
        CommonReferences: Microsoft.CodeAnalysis.MetadataReference[];
        CommonUsings: string[];
        RootPath: string;
    }
}
export module Microsoft.CodeAnalysis {
    export const enum ReportDiagnostic {
        Default = 0,
        Error = 1,
        Warn = 2,
        Info = 3,
        Hidden = 4,
        Suppress = 5
    }
    export const enum DiagnosticSeverity {
        Hidden = 0,
        Info = 1,
        Warning = 2,
        Error = 3
    }
    export const enum SourceCodeKind {
        Regular = 0,
        Script = 1,
        Interactive = 2
    }
    export const enum DocumentationMode {
        None = 0,
        Parse = 1,
        Diagnose = 2
    }
    export const enum MetadataImageKind {
        Assembly = 0,
        Module = 1
    }
    export const enum TypeKind {
        Unknown = 0,
        Array = 1,
        Class = 2,
        Delegate = 3,
        Dynamic = 4,
        Enum = 5,
        Error = 6,
        Interface = 7,
        Module = 8,
        Pointer = 9,
        Struct = 10,
        Structure = 10,
        TypeParameter = 11,
        Submission = 12
    }
    export const enum SpecialType {
        None = 0,
        System_Object = 1,
        System_Enum = 2,
        System_MulticastDelegate = 3,
        System_Delegate = 4,
        System_ValueType = 5,
        System_Void = 6,
        System_Boolean = 7,
        System_Char = 8,
        System_SByte = 9,
        System_Byte = 10,
        System_Int16 = 11,
        System_UInt16 = 12,
        System_Int32 = 13,
        System_UInt32 = 14,
        System_Int64 = 15,
        System_UInt64 = 16,
        System_Decimal = 17,
        System_Single = 18,
        System_Double = 19,
        System_String = 20,
        System_IntPtr = 21,
        System_UIntPtr = 22,
        System_Array = 23,
        System_Collections_IEnumerable = 24,
        System_Collections_Generic_IEnumerable_T = 25,
        System_Collections_Generic_IList_T = 26,
        System_Collections_Generic_ICollection_T = 27,
        System_Collections_IEnumerator = 28,
        System_Collections_Generic_IEnumerator_T = 29,
        System_Collections_Generic_IReadOnlyList_T = 30,
        System_Collections_Generic_IReadOnlyCollection_T = 31,
        System_Nullable_T = 32,
        System_DateTime = 33,
        System_Runtime_CompilerServices_IsVolatile = 34,
        System_IDisposable = 35,
        System_TypedReference = 36,
        System_ArgIterator = 37,
        System_RuntimeArgumentHandle = 38,
        System_RuntimeFieldHandle = 39,
        System_RuntimeMethodHandle = 40,
        System_RuntimeTypeHandle = 41,
        System_IAsyncResult = 42,
        System_AsyncCallback = 43,
        Count = 43
    }
    export const enum RefKind {
        None = 0,
        Ref = 1,
        Out = 2
    }
    export const enum SymbolKind {
        Alias = 0,
        ArrayType = 1,
        Assembly = 2,
        DynamicType = 3,
        ErrorType = 4,
        Event = 5,
        Field = 6,
        Label = 7,
        Local = 8,
        Method = 9,
        NetModule = 10,
        NamedType = 11,
        Namespace = 12,
        Parameter = 13,
        PointerType = 14,
        Property = 15,
        RangeVariable = 16,
        TypeParameter = 17,
        Preprocessing = 18
    }
    export const enum Accessibility {
        NotApplicable = 0,
        Private = 1,
        ProtectedAndInternal = 2,
        ProtectedAndFriend = 2,
        Protected = 3,
        Internal = 4,
        Friend = 4,
        ProtectedOrInternal = 5,
        ProtectedOrFriend = 5,
        Public = 6
    }
    export const enum MethodKind {
        AnonymousFunction = 0,
        LambdaMethod = 0,
        Constructor = 1,
        Conversion = 2,
        DelegateInvoke = 3,
        Destructor = 4,
        EventAdd = 5,
        EventRaise = 6,
        EventRemove = 7,
        ExplicitInterfaceImplementation = 8,
        UserDefinedOperator = 9,
        Ordinary = 10,
        PropertyGet = 11,
        PropertySet = 12,
        ReducedExtension = 13,
        StaticConstructor = 14,
        SharedConstructor = 14,
        BuiltinOperator = 15,
        DeclareMethod = 16
    }
    export const enum VarianceKind {
        None = 0,
        Out = 1,
        In = 2
    }
    export const enum TypeParameterKind {
        Type = 0,
        Method = 1,
        Cref = 2
    }
    export const enum NamespaceKind {
        Module = 1,
        Assembly = 2,
        Compilation = 3
    }
    export const enum LocationKind {
        None = 0,
        SourceFile = 1,
        MetadataFile = 2,
        XmlFile = 3,
        ExternalFile = 4
    }
    export const enum OutputKind {
        ConsoleApplication = 0,
        WindowsApplication = 1,
        DynamicallyLinkedLibrary = 2,
        NetModule = 3,
        WindowsRuntimeMetadata = 4,
        WindowsRuntimeApplication = 5
    }
    export const enum Platform {
        AnyCpu = 0,
        X86 = 1,
        X64 = 2,
        Itanium = 3,
        AnyCpu32BitPreferred = 4,
        Arm = 5
    }
    export const enum OptimizationLevel {
        Debug = 0,
        Release = 1
    }
    export interface ProjectInfo {
        Id: Microsoft.CodeAnalysis.ProjectId;
        Version: Microsoft.CodeAnalysis.VersionStamp;
        Name: string;
        AssemblyName: string;
        Language: string;
        FilePath: string;
        OutputFilePath: string;
        CompilationOptions: Microsoft.CodeAnalysis.CompilationOptions;
        ParseOptions: Microsoft.CodeAnalysis.ParseOptions;
        Documents: Microsoft.CodeAnalysis.DocumentInfo;
        ProjectReferences: Microsoft.CodeAnalysis.ProjectReference;
        MetadataReferences: Microsoft.CodeAnalysis.MetadataReference;
        AnalyzerReferences: Microsoft.CodeAnalysis.Diagnostics.AnalyzerReference;
        AdditionalDocuments: Microsoft.CodeAnalysis.DocumentInfo;
        IsSubmission: boolean;
        HostObjectType: System.Type;
    }
    export interface ProjectId {
        Id: string;
    }
    export interface VersionStamp {
        Default: Microsoft.CodeAnalysis.VersionStamp;
    }
    export interface CompilationOptions {
        OutputKind: Microsoft.CodeAnalysis.OutputKind;
        ModuleName: string;
        ScriptClassName: string;
        MainTypeName: string;
        CryptoPublicKey: number;
        CryptoKeyFile: string;
        CryptoKeyContainer: string;
        DelaySign: boolean;
        PublicSign: boolean;
        CheckOverflow: boolean;
        Platform: Microsoft.CodeAnalysis.Platform;
        OptimizationLevel: Microsoft.CodeAnalysis.OptimizationLevel;
        GeneralDiagnosticOption: Microsoft.CodeAnalysis.ReportDiagnostic;
        WarningLevel: number;
        ConcurrentBuild: boolean;
        Deterministic: boolean;
        SpecificDiagnosticOptions: System.Collections.Generic.KeyValuePair<string, Microsoft.CodeAnalysis.ReportDiagnostic>;
        ReportSuppressedDiagnostics: boolean;
        MetadataReferenceResolver: Microsoft.CodeAnalysis.MetadataReferenceResolver;
        XmlReferenceResolver: Microsoft.CodeAnalysis.XmlReferenceResolver;
        SourceReferenceResolver: Microsoft.CodeAnalysis.SourceReferenceResolver;
        StrongNameProvider: Microsoft.CodeAnalysis.StrongNameProvider;
        AssemblyIdentityComparer: Microsoft.CodeAnalysis.AssemblyIdentityComparer;
        Errors: Microsoft.CodeAnalysis.Diagnostic;
    }
    export interface MetadataReferenceResolver {
        ResolveMissingAssemblies: boolean;
    }
    export interface XmlReferenceResolver {
    }
    export interface SourceReferenceResolver {
    }
    export interface StrongNameProvider {
    }
    export interface AssemblyIdentityComparer {
        Default: Microsoft.CodeAnalysis.AssemblyIdentityComparer;
        SimpleNameComparer: System.StringComparer;
        CultureComparer: System.StringComparer;
    }
    export interface Diagnostic {
        Descriptor: Microsoft.CodeAnalysis.DiagnosticDescriptor;
        Id: string;
        DefaultSeverity: Microsoft.CodeAnalysis.DiagnosticSeverity;
        Severity: Microsoft.CodeAnalysis.DiagnosticSeverity;
        WarningLevel: number;
        IsSuppressed: boolean;
        IsWarningAsError: boolean;
        Location: Microsoft.CodeAnalysis.Location;
        AdditionalLocations: Microsoft.CodeAnalysis.Location;
        Properties: System.Collections.Generic.KeyValuePair<string, string>;
    }
    export interface DiagnosticDescriptor {
        Id: string;
        Title: Microsoft.CodeAnalysis.LocalizableString;
        Description: Microsoft.CodeAnalysis.LocalizableString;
        HelpLinkUri: string;
        MessageFormat: Microsoft.CodeAnalysis.LocalizableString;
        Category: string;
        DefaultSeverity: Microsoft.CodeAnalysis.DiagnosticSeverity;
        IsEnabledByDefault: boolean;
        CustomTags: string[];
    }
    export interface LocalizableString {
    }
    export interface Location {
        Kind: Microsoft.CodeAnalysis.LocationKind;
        IsInSource: boolean;
        IsInMetadata: boolean;
        SourceTree: Microsoft.CodeAnalysis.SyntaxTree;
        MetadataModule: Microsoft.CodeAnalysis.IModuleSymbol;
        SourceSpan: Microsoft.CodeAnalysis.Text.TextSpan;
        None: Microsoft.CodeAnalysis.Location;
    }
    export interface SyntaxTree {
        FilePath: string;
        HasCompilationUnitRoot: boolean;
        Options: Microsoft.CodeAnalysis.ParseOptions;
        Length: number;
        Encoding: System.Text.Encoding;
    }
    export interface ParseOptions {
        Kind: Microsoft.CodeAnalysis.SourceCodeKind;
        DocumentationMode: Microsoft.CodeAnalysis.DocumentationMode;
        Features: System.Collections.Generic.KeyValuePair<string, string>;
        PreprocessorSymbolNames: string[];
    }
    export interface IModuleSymbol {
        GlobalNamespace: Microsoft.CodeAnalysis.INamespaceSymbol;
        ReferencedAssemblies: Microsoft.CodeAnalysis.AssemblyIdentity;
        ReferencedAssemblySymbols: Microsoft.CodeAnalysis.IAssemblySymbol;
    }
    export interface INamespaceSymbol {
        IsGlobalNamespace: boolean;
        NamespaceKind: Microsoft.CodeAnalysis.NamespaceKind;
        ContainingCompilation: Microsoft.CodeAnalysis.Compilation;
        ConstituentNamespaces: Microsoft.CodeAnalysis.INamespaceSymbol;
    }
    export interface Compilation {
        IsCaseSensitive: boolean;
        ScriptCompilationInfo: Microsoft.CodeAnalysis.ScriptCompilationInfo;
        Language: string;
        AssemblyName: string;
        Options: Microsoft.CodeAnalysis.CompilationOptions;
        SyntaxTrees: Microsoft.CodeAnalysis.SyntaxTree[];
        ExternalReferences: Microsoft.CodeAnalysis.MetadataReference;
        DirectiveReferences: Microsoft.CodeAnalysis.MetadataReference;
        References: Microsoft.CodeAnalysis.MetadataReference[];
        ReferencedAssemblyNames: Microsoft.CodeAnalysis.AssemblyIdentity[];
        Assembly: Microsoft.CodeAnalysis.IAssemblySymbol;
        SourceModule: Microsoft.CodeAnalysis.IModuleSymbol;
        GlobalNamespace: Microsoft.CodeAnalysis.INamespaceSymbol;
        ObjectType: Microsoft.CodeAnalysis.INamedTypeSymbol;
        DynamicType: Microsoft.CodeAnalysis.ITypeSymbol;
        ScriptClass: Microsoft.CodeAnalysis.INamedTypeSymbol;
    }
    export interface ScriptCompilationInfo {
        ReturnType: System.Type;
        GlobalsType: System.Type;
        PreviousScriptCompilation: Microsoft.CodeAnalysis.Compilation;
    }
    export interface MetadataReference {
        Properties: Microsoft.CodeAnalysis.MetadataReferenceProperties;
        Display: string;
    }
    export interface MetadataReferenceProperties {
        Module: Microsoft.CodeAnalysis.MetadataReferenceProperties;
        Assembly: Microsoft.CodeAnalysis.MetadataReferenceProperties;
        Kind: Microsoft.CodeAnalysis.MetadataImageKind;
        GlobalAlias: string;
        Aliases: string;
        EmbedInteropTypes: boolean;
    }
    export interface AssemblyIdentity {
        Name: string;
        Version: System.Version;
        CultureName: string;
        Flags: System.Reflection.AssemblyNameFlags;
        ContentType: System.Reflection.AssemblyContentType;
        HasPublicKey: boolean;
        PublicKey: number;
        PublicKeyToken: number;
        IsStrongName: boolean;
        IsRetargetable: boolean;
    }
    export interface IAssemblySymbol {
        IsInteractive: boolean;
        Identity: Microsoft.CodeAnalysis.AssemblyIdentity;
        GlobalNamespace: Microsoft.CodeAnalysis.INamespaceSymbol;
        Modules: Microsoft.CodeAnalysis.IModuleSymbol[];
        TypeNames: string[];
        NamespaceNames: string[];
        MightContainExtensionMethods: boolean;
    }
    export interface INamedTypeSymbol {
        Arity: number;
        IsGenericType: boolean;
        IsUnboundGenericType: boolean;
        IsScriptClass: boolean;
        IsImplicitClass: boolean;
        MemberNames: string[];
        TypeParameters: Microsoft.CodeAnalysis.ITypeParameterSymbol;
        TypeArguments: Microsoft.CodeAnalysis.ITypeSymbol;
        OriginalDefinition: Microsoft.CodeAnalysis.INamedTypeSymbol;
        DelegateInvokeMethod: Microsoft.CodeAnalysis.IMethodSymbol;
        EnumUnderlyingType: Microsoft.CodeAnalysis.INamedTypeSymbol;
        ConstructedFrom: Microsoft.CodeAnalysis.INamedTypeSymbol;
        InstanceConstructors: Microsoft.CodeAnalysis.IMethodSymbol;
        StaticConstructors: Microsoft.CodeAnalysis.IMethodSymbol;
        Constructors: Microsoft.CodeAnalysis.IMethodSymbol;
        AssociatedSymbol: Microsoft.CodeAnalysis.ISymbol;
        MightContainExtensionMethods: boolean;
    }
    export interface ITypeParameterSymbol {
        Ordinal: number;
        Variance: Microsoft.CodeAnalysis.VarianceKind;
        TypeParameterKind: Microsoft.CodeAnalysis.TypeParameterKind;
        DeclaringMethod: Microsoft.CodeAnalysis.IMethodSymbol;
        DeclaringType: Microsoft.CodeAnalysis.INamedTypeSymbol;
        HasReferenceTypeConstraint: boolean;
        HasValueTypeConstraint: boolean;
        HasConstructorConstraint: boolean;
        ConstraintTypes: Microsoft.CodeAnalysis.ITypeSymbol;
        OriginalDefinition: Microsoft.CodeAnalysis.ITypeParameterSymbol;
        ReducedFrom: Microsoft.CodeAnalysis.ITypeParameterSymbol;
    }
    export interface IMethodSymbol {
        MethodKind: Microsoft.CodeAnalysis.MethodKind;
        Arity: number;
        IsGenericMethod: boolean;
        IsExtensionMethod: boolean;
        IsAsync: boolean;
        IsVararg: boolean;
        IsCheckedBuiltin: boolean;
        HidesBaseMethodsByName: boolean;
        ReturnsVoid: boolean;
        ReturnType: Microsoft.CodeAnalysis.ITypeSymbol;
        TypeArguments: Microsoft.CodeAnalysis.ITypeSymbol;
        TypeParameters: Microsoft.CodeAnalysis.ITypeParameterSymbol;
        Parameters: Microsoft.CodeAnalysis.IParameterSymbol;
        ConstructedFrom: Microsoft.CodeAnalysis.IMethodSymbol;
        OriginalDefinition: Microsoft.CodeAnalysis.IMethodSymbol;
        OverriddenMethod: Microsoft.CodeAnalysis.IMethodSymbol;
        ReceiverType: Microsoft.CodeAnalysis.ITypeSymbol;
        ReducedFrom: Microsoft.CodeAnalysis.IMethodSymbol;
        ExplicitInterfaceImplementations: Microsoft.CodeAnalysis.IMethodSymbol;
        ReturnTypeCustomModifiers: Microsoft.CodeAnalysis.CustomModifier;
        AssociatedSymbol: Microsoft.CodeAnalysis.ISymbol;
        PartialDefinitionPart: Microsoft.CodeAnalysis.IMethodSymbol;
        PartialImplementationPart: Microsoft.CodeAnalysis.IMethodSymbol;
        AssociatedAnonymousDelegate: Microsoft.CodeAnalysis.INamedTypeSymbol;
    }
    export interface ITypeSymbol {
        TypeKind: Microsoft.CodeAnalysis.TypeKind;
        BaseType: Microsoft.CodeAnalysis.INamedTypeSymbol;
        Interfaces: Microsoft.CodeAnalysis.INamedTypeSymbol;
        AllInterfaces: Microsoft.CodeAnalysis.INamedTypeSymbol;
        IsReferenceType: boolean;
        IsValueType: boolean;
        IsAnonymousType: boolean;
        OriginalDefinition: Microsoft.CodeAnalysis.ITypeSymbol;
        SpecialType: Microsoft.CodeAnalysis.SpecialType;
    }
    export interface IParameterSymbol {
        RefKind: Microsoft.CodeAnalysis.RefKind;
        IsParams: boolean;
        IsOptional: boolean;
        IsThis: boolean;
        Type: Microsoft.CodeAnalysis.ITypeSymbol;
        CustomModifiers: Microsoft.CodeAnalysis.CustomModifier;
        Ordinal: number;
        HasExplicitDefaultValue: boolean;
        ExplicitDefaultValue: any;
        OriginalDefinition: Microsoft.CodeAnalysis.IParameterSymbol;
    }
    export interface CustomModifier {
        IsOptional: boolean;
        Modifier: Microsoft.CodeAnalysis.INamedTypeSymbol;
    }
    export interface ISymbol {
        Kind: Microsoft.CodeAnalysis.SymbolKind;
        Language: string;
        Name: string;
        MetadataName: string;
        ContainingSymbol: Microsoft.CodeAnalysis.ISymbol;
        ContainingAssembly: Microsoft.CodeAnalysis.IAssemblySymbol;
        ContainingModule: Microsoft.CodeAnalysis.IModuleSymbol;
        ContainingType: Microsoft.CodeAnalysis.INamedTypeSymbol;
        ContainingNamespace: Microsoft.CodeAnalysis.INamespaceSymbol;
        IsDefinition: boolean;
        IsStatic: boolean;
        IsVirtual: boolean;
        IsOverride: boolean;
        IsAbstract: boolean;
        IsSealed: boolean;
        IsExtern: boolean;
        IsImplicitlyDeclared: boolean;
        CanBeReferencedByName: boolean;
        Locations: Microsoft.CodeAnalysis.Location;
        DeclaringSyntaxReferences: Microsoft.CodeAnalysis.SyntaxReference;
        DeclaredAccessibility: Microsoft.CodeAnalysis.Accessibility;
        OriginalDefinition: Microsoft.CodeAnalysis.ISymbol;
        HasUnsupportedMetadata: boolean;
    }
    export interface SyntaxReference {
        SyntaxTree: Microsoft.CodeAnalysis.SyntaxTree;
        Span: Microsoft.CodeAnalysis.Text.TextSpan;
    }
    export interface DocumentInfo {
        Id: Microsoft.CodeAnalysis.DocumentId;
        Name: string;
        Folders: string;
        SourceCodeKind: Microsoft.CodeAnalysis.SourceCodeKind;
        FilePath: string;
        TextLoader: Microsoft.CodeAnalysis.TextLoader;
        IsGenerated: boolean;
    }
    export interface DocumentId {
        ProjectId: Microsoft.CodeAnalysis.ProjectId;
        Id: string;
    }
    export interface TextLoader {
    }
    export interface ProjectReference {
        ProjectId: Microsoft.CodeAnalysis.ProjectId;
        Aliases: string;
        EmbedInteropTypes: boolean;
    }
}
export module System.Reflection {
    export const enum MethodImplAttributes {
        CodeTypeMask = 3,
        IL = 0,
        Native = 1,
        OPTIL = 2,
        Runtime = 3,
        ManagedMask = 4,
        Unmanaged = 4,
        Managed = 0,
        ForwardRef = 16,
        PreserveSig = 128,
        InternalCall = 4096,
        Synchronized = 32,
        NoInlining = 8,
        AggressiveInlining = 256,
        NoOptimization = 64,
        MaxMethodImplVal = 65535
    }
    export const enum MethodAttributes {
        MemberAccessMask = 7,
        PrivateScope = 0,
        Private = 1,
        FamANDAssem = 2,
        Assembly = 3,
        Family = 4,
        FamORAssem = 5,
        Public = 6,
        Static = 16,
        Final = 32,
        Virtual = 64,
        HideBySig = 128,
        CheckAccessOnOverride = 512,
        VtableLayoutMask = 256,
        ReuseSlot = 0,
        NewSlot = 256,
        Abstract = 1024,
        SpecialName = 2048,
        PinvokeImpl = 8192,
        UnmanagedExport = 8,
        RTSpecialName = 4096,
        ReservedMask = 53248,
        HasSecurity = 16384,
        RequireSecObject = 32768
    }
    export const enum CallingConventions {
        Standard = 1,
        VarArgs = 2,
        Any = 3,
        HasThis = 32,
        ExplicitThis = 64
    }
    export const enum MemberTypes {
        Constructor = 1,
        Event = 2,
        Field = 4,
        Method = 8,
        Property = 16,
        TypeInfo = 32,
        Custom = 64,
        NestedType = 128,
        All = 191
    }
    export const enum ParameterAttributes {
        None = 0,
        In = 1,
        Out = 2,
        Lcid = 4,
        Retval = 8,
        Optional = 16,
        ReservedMask = 61440,
        HasDefault = 4096,
        HasFieldMarshal = 8192,
        Reserved3 = 16384,
        Reserved4 = 32768
    }
    export const enum EventAttributes {
        None = 0,
        SpecialName = 512,
        ReservedMask = 1024,
        RTSpecialName = 1024
    }
    export const enum FieldAttributes {
        FieldAccessMask = 7,
        PrivateScope = 0,
        Private = 1,
        FamANDAssem = 2,
        Assembly = 3,
        Family = 4,
        FamORAssem = 5,
        Public = 6,
        Static = 16,
        InitOnly = 32,
        Literal = 64,
        NotSerialized = 128,
        SpecialName = 512,
        PinvokeImpl = 8192,
        ReservedMask = 38144,
        RTSpecialName = 1024,
        HasFieldMarshal = 4096,
        HasDefault = 32768,
        HasFieldRVA = 256
    }
    export const enum PropertyAttributes {
        None = 0,
        SpecialName = 512,
        ReservedMask = 62464,
        RTSpecialName = 1024,
        HasDefault = 4096,
        Reserved2 = 8192,
        Reserved3 = 16384,
        Reserved4 = 32768
    }
    export const enum TypeAttributes {
        VisibilityMask = 7,
        NotPublic = 0,
        Public = 1,
        NestedPublic = 2,
        NestedPrivate = 3,
        NestedFamily = 4,
        NestedAssembly = 5,
        NestedFamANDAssem = 6,
        NestedFamORAssem = 7,
        LayoutMask = 24,
        AutoLayout = 0,
        SequentialLayout = 8,
        ExplicitLayout = 16,
        ClassSemanticsMask = 32,
        Class = 0,
        Interface = 32,
        Abstract = 128,
        Sealed = 256,
        SpecialName = 1024,
        Import = 4096,
        Serializable = 8192,
        WindowsRuntime = 16384,
        StringFormatMask = 196608,
        AnsiClass = 0,
        UnicodeClass = 65536,
        AutoClass = 131072,
        CustomFormatClass = 196608,
        CustomFormatMask = 12582912,
        BeforeFieldInit = 1048576,
        ReservedMask = 264192,
        RTSpecialName = 2048,
        HasSecurity = 262144
    }
    export const enum GenericParameterAttributes {
        None = 0,
        VarianceMask = 3,
        Covariant = 1,
        Contravariant = 2,
        SpecialConstraintMask = 28,
        ReferenceTypeConstraint = 4,
        NotNullableValueTypeConstraint = 8,
        DefaultConstructorConstraint = 16
    }
    export const enum AssemblyNameFlags {
        None = 0,
        PublicKey = 1,
        EnableJITcompileOptimizer = 16384,
        EnableJITcompileTracking = 32768,
        Retargetable = 256
    }
    export const enum AssemblyContentType {
        Default = 0,
        WindowsRuntime = 1
    }
}
export module System.Runtime.InteropServices {
    export const enum LayoutKind {
        Sequential = 0,
        Explicit = 2,
        Auto = 3
    }
}
export module Microsoft.CodeAnalysis.Text {
    export interface TextSpan {
        Start: number;
        End: number;
        Length: number;
        IsEmpty: boolean;
    }
}
export module Microsoft.CodeAnalysis.Diagnostics {
    export interface AnalyzerReference {
        FullPath: string;
        Display: string;
        Id: any;
    }
}

    export const enum TestCommandType {
        All = 0,
        Fixture = 1,
        Single = 2
    }

export module System.Security {
    export const enum SecurityRuleSet {
        None = 0,
        Level1 = 1,
        Level2 = 2
    }
}


    export interface Context<TRequest, TResponse>
    {
        request: TRequest;
        response: TResponse;
    }
    export interface RequestOptions
    {
        silent?: boolean;
    }
    export interface CombinationKey<T>
    {
        key: string;
        value: T;
    }

export module Api {

    export interface Common {
        request(path: string, options?: RequestOptions): Observable<any>;
        request(path: string, request?: any, options?: RequestOptions): Observable<any>;
        request(path: "/autocomplete", request: Models.AutoCompleteRequest, options?: RequestOptions): Observable<Models.AutoCompleteResponse[]>;
        request(path: "/changebuffer", request: Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        request(path: "/checkalivestatus", options?: RequestOptions): Observable<boolean>;
        request(path: "/checkreadystatus", options?: RequestOptions): Observable<boolean>;
        request(path: "/close", request: Models.FileCloseRequest, options?: RequestOptions): Observable<Models.FileCloseResponse>;
        request(path: "/codecheck", request: Models.CodeCheckRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/codeformat", request: Models.CodeFormatRequest, options?: RequestOptions): Observable<Models.CodeFormatResponse>;
        request(path: "/currentfilemembersasflat", request: Models.MembersFlatRequest, options?: RequestOptions): Observable<Models.QuickFix[]>;
        request(path: "/currentfilemembersastree", request: Models.MembersTreeRequest, options?: RequestOptions): Observable<Models.FileMemberTree>;
        request(path: "/diagnostics", request: Models.DiagnosticsRequest, options?: RequestOptions): Observable<Models.DiagnosticsResponse>;
        request(path: "/filesChanged", request: Models.Request[], options?: RequestOptions): Observable<Models.FilesChangedResponse>;
        request(path: "/findimplementations", request: Models.FindImplementationsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/findsymbols", request: Models.FindSymbolsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/findusages", request: Models.FindUsagesRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/fixusings", request: Models.FixUsingsRequest, options?: RequestOptions): Observable<Models.FixUsingsResponse>;
        request(path: "/formatAfterKeystroke", request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        request(path: "/formatRange", request: Models.FormatRangeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        request(path: "/getcodeactions", request: Models.GetCodeActionRequest, options?: RequestOptions): Observable<Models.GetCodeActionsResponse>;
        request(path: "/v2/getcodeactions", request: Models.V2.GetCodeActionsRequest, options?: RequestOptions): Observable<Models.V2.GetCodeActionsResponse>;
        request(path: "/gettestcontext", request: Models.TestCommandRequest, options?: RequestOptions): Observable<Models.GetTestCommandResponse>;
        request(path: "/v2/getteststartinfo", request: any, options?: RequestOptions): Observable<any>;
        request(path: "/gotodefinition", request: Models.GotoDefinitionRequest, options?: RequestOptions): Observable<Models.GotoDefinitionResponse>;
        request(path: "/gotofile", request: Models.GotoFileRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/gotoregion", request: Models.GotoRegionRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/highlight", request: Models.HighlightRequest, options?: RequestOptions): Observable<Models.HighlightResponse>;
        request(path: "/metadata", request: Models.MetadataRequest, options?: RequestOptions): Observable<Models.MetadataResponse>;
        request(path: "/navigatedown", request: Models.NavigateDownRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        request(path: "/navigateup", request: Models.NavigateUpRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        request(path: "/open", request: Models.FileOpenRequest, options?: RequestOptions): Observable<Models.FileOpenResponse>;
        request(path: "/packagesearch", request: Models.PackageSearchRequest, options?: RequestOptions): Observable<Models.PackageSearchResponse>;
        request(path: "/packagesource", request: Models.PackageSourceRequest, options?: RequestOptions): Observable<Models.PackageSourceResponse>;
        request(path: "/packageversion", request: Models.PackageVersionRequest, options?: RequestOptions): Observable<Models.PackageVersionResponse>;
        request(path: "/project", request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<Models.ProjectInformationResponse>;
        request(path: "/projects", request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<Models.WorkspaceInformationResponse>;
        request(path: "/rename", request: Models.RenameRequest, options?: RequestOptions): Observable<Models.RenameResponse>;
        request(path: "/runcodeaction", request: Models.RunCodeActionRequest, options?: RequestOptions): Observable<Models.RunCodeActionResponse>;
        request(path: "/v2/runcodeaction", request: Models.V2.RunCodeActionRequest, options?: RequestOptions): Observable<Models.V2.RunCodeActionResponse>;
        request(path: "/v2/runtest", request: any, options?: RequestOptions): Observable<any>;
        request(path: "/signatureHelp", request: Models.SignatureHelpRequest, options?: RequestOptions): Observable<Models.SignatureHelp>;
        request(path: "/stopserver", options?: RequestOptions): Observable<boolean>;
        request(path: "/typelookup", request: Models.TypeLookupRequest, options?: RequestOptions): Observable<Models.TypeLookupResponse>;
        request(path: "/updatebuffer", request: Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }

    export interface V2 extends Common {
        autocomplete(request: Models.AutoCompleteRequest, options?: RequestOptions): Observable<Models.AutoCompleteResponse[]>;
        changebuffer(request: Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        checkalivestatus(options?: RequestOptions): Observable<boolean>;
        checkreadystatus(options?: RequestOptions): Observable<boolean>;
        close(request: Models.FileCloseRequest, options?: RequestOptions): Observable<Models.FileCloseResponse>;
        codecheck(request: Models.CodeCheckRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        codeformat(request: Models.CodeFormatRequest, options?: RequestOptions): Observable<Models.CodeFormatResponse>;
        currentfilemembersasflat(request: Models.MembersFlatRequest, options?: RequestOptions): Observable<Models.QuickFix[]>;
        currentfilemembersastree(request: Models.MembersTreeRequest, options?: RequestOptions): Observable<Models.FileMemberTree>;
        diagnostics(request: Models.DiagnosticsRequest, options?: RequestOptions): Observable<Models.DiagnosticsResponse>;
        filesChanged(request: Models.Request[], options?: RequestOptions): Observable<Models.FilesChangedResponse>;
        findimplementations(request: Models.FindImplementationsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findsymbols(request: Models.FindSymbolsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findusages(request: Models.FindUsagesRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        fixusings(request: Models.FixUsingsRequest, options?: RequestOptions): Observable<Models.FixUsingsResponse>;
        formatAfterKeystroke(request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        formatRange(request: Models.FormatRangeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        getcodeactions(request: Models.V2.GetCodeActionsRequest, options?: RequestOptions): Observable<Models.V2.GetCodeActionsResponse>;
        gettestcontext(request: Models.TestCommandRequest, options?: RequestOptions): Observable<Models.GetTestCommandResponse>;
        getteststartinfo(request: any, options?: RequestOptions): Observable<any>;
        gotodefinition(request: Models.GotoDefinitionRequest, options?: RequestOptions): Observable<Models.GotoDefinitionResponse>;
        gotofile(request: Models.GotoFileRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        gotoregion(request: Models.GotoRegionRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        highlight(request: Models.HighlightRequest, options?: RequestOptions): Observable<Models.HighlightResponse>;
        metadata(request: Models.MetadataRequest, options?: RequestOptions): Observable<Models.MetadataResponse>;
        navigatedown(request: Models.NavigateDownRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        navigateup(request: Models.NavigateUpRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        open(request: Models.FileOpenRequest, options?: RequestOptions): Observable<Models.FileOpenResponse>;
        packagesearch(request: Models.PackageSearchRequest, options?: RequestOptions): Observable<Models.PackageSearchResponse>;
        packagesource(request: Models.PackageSourceRequest, options?: RequestOptions): Observable<Models.PackageSourceResponse>;
        packageversion(request: Models.PackageVersionRequest, options?: RequestOptions): Observable<Models.PackageVersionResponse>;
        project(request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<Models.ProjectInformationResponse>;
        projects(request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<Models.WorkspaceInformationResponse>;
        rename(request: Models.RenameRequest, options?: RequestOptions): Observable<Models.RenameResponse>;
        runcodeaction(request: Models.V2.RunCodeActionRequest, options?: RequestOptions): Observable<Models.V2.RunCodeActionResponse>;
        runtest(request: any, options?: RequestOptions): Observable<any>;
        signatureHelp(request: Models.SignatureHelpRequest, options?: RequestOptions): Observable<Models.SignatureHelp>;
        stopserver(options?: RequestOptions): Observable<boolean>;
        typelookup(request: Models.TypeLookupRequest, options?: RequestOptions): Observable<Models.TypeLookupResponse>;
        updatebuffer(request: Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }

    export interface V1 extends Common {
        autocomplete(request: Models.AutoCompleteRequest, options?: RequestOptions): Observable<Models.AutoCompleteResponse[]>;
        changebuffer(request: Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        checkalivestatus(options?: RequestOptions): Observable<boolean>;
        checkreadystatus(options?: RequestOptions): Observable<boolean>;
        close(request: Models.FileCloseRequest, options?: RequestOptions): Observable<Models.FileCloseResponse>;
        codecheck(request: Models.CodeCheckRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        codeformat(request: Models.CodeFormatRequest, options?: RequestOptions): Observable<Models.CodeFormatResponse>;
        currentfilemembersasflat(request: Models.MembersFlatRequest, options?: RequestOptions): Observable<Models.QuickFix[]>;
        currentfilemembersastree(request: Models.MembersTreeRequest, options?: RequestOptions): Observable<Models.FileMemberTree>;
        diagnostics(request: Models.DiagnosticsRequest, options?: RequestOptions): Observable<Models.DiagnosticsResponse>;
        filesChanged(request: Models.Request[], options?: RequestOptions): Observable<Models.FilesChangedResponse>;
        findimplementations(request: Models.FindImplementationsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findsymbols(request: Models.FindSymbolsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findusages(request: Models.FindUsagesRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        fixusings(request: Models.FixUsingsRequest, options?: RequestOptions): Observable<Models.FixUsingsResponse>;
        formatAfterKeystroke(request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        formatRange(request: Models.FormatRangeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        getcodeactions(request: Models.GetCodeActionRequest, options?: RequestOptions): Observable<Models.GetCodeActionsResponse>;
        gettestcontext(request: Models.TestCommandRequest, options?: RequestOptions): Observable<Models.GetTestCommandResponse>;
        getteststartinfo(request: any, options?: RequestOptions): Observable<any>;
        gotodefinition(request: Models.GotoDefinitionRequest, options?: RequestOptions): Observable<Models.GotoDefinitionResponse>;
        gotofile(request: Models.GotoFileRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        gotoregion(request: Models.GotoRegionRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        highlight(request: Models.HighlightRequest, options?: RequestOptions): Observable<Models.HighlightResponse>;
        metadata(request: Models.MetadataRequest, options?: RequestOptions): Observable<Models.MetadataResponse>;
        navigatedown(request: Models.NavigateDownRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        navigateup(request: Models.NavigateUpRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        open(request: Models.FileOpenRequest, options?: RequestOptions): Observable<Models.FileOpenResponse>;
        packagesearch(request: Models.PackageSearchRequest, options?: RequestOptions): Observable<Models.PackageSearchResponse>;
        packagesource(request: Models.PackageSourceRequest, options?: RequestOptions): Observable<Models.PackageSourceResponse>;
        packageversion(request: Models.PackageVersionRequest, options?: RequestOptions): Observable<Models.PackageVersionResponse>;
        project(request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<Models.ProjectInformationResponse>;
        projects(request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<Models.WorkspaceInformationResponse>;
        rename(request: Models.RenameRequest, options?: RequestOptions): Observable<Models.RenameResponse>;
        runcodeaction(request: Models.RunCodeActionRequest, options?: RequestOptions): Observable<Models.RunCodeActionResponse>;
        runtest(request: any, options?: RequestOptions): Observable<any>;
        signatureHelp(request: Models.SignatureHelpRequest, options?: RequestOptions): Observable<Models.SignatureHelp>;
        stopserver(options?: RequestOptions): Observable<boolean>;
        typelookup(request: Models.TypeLookupRequest, options?: RequestOptions): Observable<Models.TypeLookupResponse>;
        updatebuffer(request: Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }

    export function getVersion(name: string): "v2" | "v1" {
        if ("getteststartinfo" === name.toLowerCase()) {
            return "v2";
        }
        if ("runtest" === name.toLowerCase()) {
            return "v2";
        }
        if ("getcodeactions" === name.toLowerCase()) {
            return "v2";
        }
        if ("runcodeaction" === name.toLowerCase()) {
            return "v2";
        }
        return "v1";
    }
}
export module Events {

    export interface Common {
        listen(path: string): Observable<any>;
        listen(path: "/autocomplete"): Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        listen(path: "/changebuffer"): Observable<Context<Models.ChangeBufferRequest, any>>;
        listen(path: "/checkalivestatus"): Observable<Context<any, boolean>>;
        listen(path: "/checkreadystatus"): Observable<Context<any, boolean>>;
        listen(path: "/close"): Observable<Context<Models.FileCloseRequest, Models.FileCloseResponse>>;
        listen(path: "/codecheck"): Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        listen(path: "/codeformat"): Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        listen(path: "/currentfilemembersasflat"): Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        listen(path: "/currentfilemembersastree"): Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        listen(path: "/diagnostics"): Observable<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>;
        listen(path: "/filesChanged"): Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        listen(path: "/findimplementations"): Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        listen(path: "/findsymbols"): Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        listen(path: "/findusages"): Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        listen(path: "/fixusings"): Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        listen(path: "/formatAfterKeystroke"): Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        listen(path: "/formatRange"): Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        listen(path: "/getcodeactions"): Observable<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>;
        listen(path: "/v2/getcodeactions"): Observable<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>;
        listen(path: "/gettestcontext"): Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        listen(path: "/v2/getteststartinfo"): Observable<Context<any, any>>;
        listen(path: "/gotodefinition"): Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        listen(path: "/gotofile"): Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        listen(path: "/gotoregion"): Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        listen(path: "/highlight"): Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        listen(path: "/metadata"): Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        listen(path: "/navigatedown"): Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        listen(path: "/navigateup"): Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        listen(path: "/open"): Observable<Context<Models.FileOpenRequest, Models.FileOpenResponse>>;
        listen(path: "/packagesearch"): Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        listen(path: "/packagesource"): Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        listen(path: "/packageversion"): Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        listen(path: "/project"): Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        listen(path: "/projects"): Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        listen(path: "/rename"): Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        listen(path: "/runcodeaction"): Observable<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>;
        listen(path: "/v2/runcodeaction"): Observable<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>;
        listen(path: "/v2/runtest"): Observable<Context<any, any>>;
        listen(path: "/signatureHelp"): Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        listen(path: "/stopserver"): Observable<Context<any, boolean>>;
        listen(path: "/typelookup"): Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        listen(path: "/updatebuffer"): Observable<Context<Models.UpdateBufferRequest, any>>;
    }

    export interface V2 extends Common {
        autocomplete: Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        changebuffer: Observable<Context<Models.ChangeBufferRequest, any>>;
        checkalivestatus: Observable<Context<any, boolean>>;
        checkreadystatus: Observable<Context<any, boolean>>;
        close: Observable<Context<Models.FileCloseRequest, Models.FileCloseResponse>>;
        codecheck: Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        codeformat: Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        currentfilemembersasflat: Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        currentfilemembersastree: Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        diagnostics: Observable<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>;
        filesChanged: Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        findimplementations: Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        findsymbols: Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        findusages: Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        fixusings: Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        formatAfterKeystroke: Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        formatRange: Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        getcodeactions: Observable<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>;
        gettestcontext: Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        getteststartinfo: Observable<Context<any, any>>;
        gotodefinition: Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        gotofile: Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        gotoregion: Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        highlight: Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        metadata: Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        navigatedown: Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        navigateup: Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        open: Observable<Context<Models.FileOpenRequest, Models.FileOpenResponse>>;
        packagesearch: Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        packagesource: Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        packageversion: Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        project: Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        projects: Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        rename: Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        runcodeaction: Observable<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>;
        runtest: Observable<Context<any, any>>;
        signatureHelp: Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        stopserver: Observable<Context<any, boolean>>;
        typelookup: Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        updatebuffer: Observable<Context<Models.UpdateBufferRequest, any>>;
    }

    export interface V1 extends Common {
        autocomplete: Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        changebuffer: Observable<Context<Models.ChangeBufferRequest, any>>;
        checkalivestatus: Observable<Context<any, boolean>>;
        checkreadystatus: Observable<Context<any, boolean>>;
        close: Observable<Context<Models.FileCloseRequest, Models.FileCloseResponse>>;
        codecheck: Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        codeformat: Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        currentfilemembersasflat: Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        currentfilemembersastree: Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        diagnostics: Observable<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>;
        filesChanged: Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        findimplementations: Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        findsymbols: Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        findusages: Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        fixusings: Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        formatAfterKeystroke: Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        formatRange: Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        getcodeactions: Observable<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>;
        gettestcontext: Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        getteststartinfo: Observable<Context<any, any>>;
        gotodefinition: Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        gotofile: Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        gotoregion: Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        highlight: Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        metadata: Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        navigatedown: Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        navigateup: Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        open: Observable<Context<Models.FileOpenRequest, Models.FileOpenResponse>>;
        packagesearch: Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        packagesource: Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        packageversion: Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        project: Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        projects: Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        rename: Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        runcodeaction: Observable<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>;
        runtest: Observable<Context<any, any>>;
        signatureHelp: Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        stopserver: Observable<Context<any, boolean>>;
        typelookup: Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        updatebuffer: Observable<Context<Models.UpdateBufferRequest, any>>;
    }

}
export module Events.Aggregate {

    export interface Common {
        listen(path: string): Observable<any>;
        listen(path: "/autocomplete"): Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        listen(path: "/changebuffer"): Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        listen(path: "/checkalivestatus"): Observable<CombinationKey<Context<any, boolean>>>;
        listen(path: "/checkreadystatus"): Observable<CombinationKey<Context<any, boolean>>>;
        listen(path: "/close"): Observable<CombinationKey<Context<Models.FileCloseRequest, Models.FileCloseResponse>>[]>;
        listen(path: "/codecheck"): Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/codeformat"): Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        listen(path: "/currentfilemembersasflat"): Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        listen(path: "/currentfilemembersastree"): Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        listen(path: "/diagnostics"): Observable<CombinationKey<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>[]>;
        listen(path: "/filesChanged"): Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        listen(path: "/findimplementations"): Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/findsymbols"): Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/findusages"): Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/fixusings"): Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        listen(path: "/formatAfterKeystroke"): Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        listen(path: "/formatRange"): Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        listen(path: "/getcodeactions"): Observable<CombinationKey<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>[]>;
        listen(path: "/v2/getcodeactions"): Observable<CombinationKey<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>[]>;
        listen(path: "/gettestcontext"): Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        listen(path: "/v2/getteststartinfo"): Observable<CombinationKey<Context<any, any>>[]>;
        listen(path: "/gotodefinition"): Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        listen(path: "/gotofile"): Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/gotoregion"): Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/highlight"): Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        listen(path: "/metadata"): Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        listen(path: "/navigatedown"): Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        listen(path: "/navigateup"): Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        listen(path: "/open"): Observable<CombinationKey<Context<Models.FileOpenRequest, Models.FileOpenResponse>>[]>;
        listen(path: "/packagesearch"): Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        listen(path: "/packagesource"): Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        listen(path: "/packageversion"): Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        listen(path: "/project"): Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        listen(path: "/projects"): Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        listen(path: "/rename"): Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        listen(path: "/runcodeaction"): Observable<CombinationKey<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>[]>;
        listen(path: "/v2/runcodeaction"): Observable<CombinationKey<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>[]>;
        listen(path: "/v2/runtest"): Observable<CombinationKey<Context<any, any>>[]>;
        listen(path: "/signatureHelp"): Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        listen(path: "/stopserver"): Observable<CombinationKey<Context<any, boolean>>>;
        listen(path: "/typelookup"): Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        listen(path: "/updatebuffer"): Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }

    export interface V2 {
        autocomplete: Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        changebuffer: Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        checkalivestatus: Observable<CombinationKey<Context<any, boolean>>>;
        checkreadystatus: Observable<CombinationKey<Context<any, boolean>>>;
        close: Observable<CombinationKey<Context<Models.FileCloseRequest, Models.FileCloseResponse>>[]>;
        codecheck: Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        codeformat: Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        currentfilemembersasflat: Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        currentfilemembersastree: Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        diagnostics: Observable<CombinationKey<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>[]>;
        filesChanged: Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        findimplementations: Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        findsymbols: Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        findusages: Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        fixusings: Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        formatAfterKeystroke: Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        formatRange: Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        getcodeactions: Observable<CombinationKey<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>[]>;
        gettestcontext: Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        getteststartinfo: Observable<CombinationKey<Context<any, any>>[]>;
        gotodefinition: Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        gotofile: Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        gotoregion: Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        highlight: Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        metadata: Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        navigatedown: Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        navigateup: Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        open: Observable<CombinationKey<Context<Models.FileOpenRequest, Models.FileOpenResponse>>[]>;
        packagesearch: Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        packagesource: Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        packageversion: Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        project: Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        projects: Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        rename: Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        runcodeaction: Observable<CombinationKey<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>[]>;
        runtest: Observable<CombinationKey<Context<any, any>>[]>;
        signatureHelp: Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        stopserver: Observable<CombinationKey<Context<any, boolean>>>;
        typelookup: Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        updatebuffer: Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }

    export interface V1 {
        autocomplete: Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        changebuffer: Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        checkalivestatus: Observable<CombinationKey<Context<any, boolean>>>;
        checkreadystatus: Observable<CombinationKey<Context<any, boolean>>>;
        close: Observable<CombinationKey<Context<Models.FileCloseRequest, Models.FileCloseResponse>>[]>;
        codecheck: Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        codeformat: Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        currentfilemembersasflat: Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        currentfilemembersastree: Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        diagnostics: Observable<CombinationKey<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>[]>;
        filesChanged: Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        findimplementations: Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        findsymbols: Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        findusages: Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        fixusings: Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        formatAfterKeystroke: Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        formatRange: Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        getcodeactions: Observable<CombinationKey<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>[]>;
        gettestcontext: Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        getteststartinfo: Observable<CombinationKey<Context<any, any>>[]>;
        gotodefinition: Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        gotofile: Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        gotoregion: Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        highlight: Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        metadata: Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        navigatedown: Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        navigateup: Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        open: Observable<CombinationKey<Context<Models.FileOpenRequest, Models.FileOpenResponse>>[]>;
        packagesearch: Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        packagesource: Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        packageversion: Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        project: Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        projects: Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        rename: Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        runcodeaction: Observable<CombinationKey<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>[]>;
        runtest: Observable<CombinationKey<Context<any, any>>[]>;
        signatureHelp: Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        stopserver: Observable<CombinationKey<Context<any, boolean>>>;
        typelookup: Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        updatebuffer: Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }

}

    export interface Events {
        listen(path: string): Observable<any>;
        listen(path: "projectAdded"): Observable<Models.ProjectInformationResponse>;
        listen(path: "projectChanged"): Observable<Models.ProjectInformationResponse>;
        listen(path: "projectRemoved"): Observable<Models.ProjectInformationResponse>;
        listen(path: "error"): Observable<Models.ErrorMessage>;
        listen(path: "diagnostic"): Observable<Models.DiagnosticMessage>;
        listen(path: "msBuildProjectDiagnostics"): Observable<Models.MSBuildProjectDiagnostics>;
        listen(path: "packageRestoreStarted"): Observable<Models.PackageRestoreMessage>;
        listen(path: "packageRestoreFinished"): Observable<Models.PackageRestoreMessage>;
        listen(path: "unresolvedDependencies"): Observable<Models.UnresolvedDependenciesMessage>;
        projectAdded: Observable<Models.ProjectInformationResponse>;
        projectChanged: Observable<Models.ProjectInformationResponse>;
        projectRemoved: Observable<Models.ProjectInformationResponse>;
        error: Observable<Models.ErrorMessage>;
        diagnostic: Observable<Models.DiagnosticMessage>;
        msBuildProjectDiagnostics: Observable<Models.MSBuildProjectDiagnostics>;
        packageRestoreStarted: Observable<Models.PackageRestoreMessage>;
        packageRestoreFinished: Observable<Models.PackageRestoreMessage>;
        unresolvedDependencies: Observable<Models.UnresolvedDependenciesMessage>;
    }

export module Aggregate {
    export interface Events {
        listen(path: string): Observable<any>;
        listen(path: "projectAdded"): Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        listen(path: "projectChanged"): Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        listen(path: "projectRemoved"): Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        listen(path: "error"): Observable<CombinationKey<Models.ErrorMessage>[]>;
        listen(path: "diagnostic"): Observable<CombinationKey<Models.DiagnosticMessage>[]>;
        listen(path: "msBuildProjectDiagnostics"): Observable<CombinationKey<Models.MSBuildProjectDiagnostics>[]>;
        listen(path: "packageRestoreStarted"): Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        listen(path: "packageRestoreFinished"): Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        listen(path: "unresolvedDependencies"): Observable<CombinationKey<Models.UnresolvedDependenciesMessage>[]>;
        projectAdded: Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        projectChanged: Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        projectRemoved: Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        error: Observable<CombinationKey<Models.ErrorMessage>[]>;
        diagnostic: Observable<CombinationKey<Models.DiagnosticMessage>[]>;
        msBuildProjectDiagnostics: Observable<CombinationKey<Models.MSBuildProjectDiagnostics>[]>;
        packageRestoreStarted: Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        packageRestoreFinished: Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        unresolvedDependencies: Observable<CombinationKey<Models.UnresolvedDependenciesMessage>[]>;
    }
}

export module Models {
    export interface ProjectInformationResponse {
        MsBuildProject: Models.MSBuildProject;
        DotNetProject: Models.DotNetProjectInformation;
    }

    export interface WorkspaceInformationResponse {
        DotNet: Models.DotNetWorkspaceInformation;
        MSBuild: Models.MsBuildWorkspaceInformation;
        ScriptCs: ScriptCs.ScriptCsContext;
    }
}
            
