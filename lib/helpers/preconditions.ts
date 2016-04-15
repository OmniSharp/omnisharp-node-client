import {isNotNull, isAboveZero, precondition} from "./decorators";

// OmniSharp.Models.V2.GetCodeActionsRequest
export const getcodeactions: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    precondition((request: any) => !request.Selection,
        isNotNull((request: any) => request.Line),
        isAboveZero((request: any) => request.Line),
        isNotNull((request: any) => request.Column),
        isAboveZero((request: any) => request.Column)),
    precondition((request: any) => !!request.Selection,
        isNotNull((request: any) => request.Selection.Start.Line),
        isAboveZero((request: any) => request.Selection.Start.Line),
        isNotNull((request: any) => request.Selection.Start.Column),
        isAboveZero((request: any) => request.Selection.Start.Column),
        isNotNull((request: any) => request.Selection.End.Line),
        isAboveZero((request: any) => request.Selection.End.Line),
        isNotNull((request: any) => request.Selection.End.Column),
        isAboveZero((request: any) => request.Selection.End.Column))
];

export const runcodeaction: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Identifier),
    precondition((request: any) => !request.Selection,
        isNotNull((request: any) => request.Line),
        isAboveZero((request: any) => request.Line),
        isNotNull((request: any) => request.Column),
        isAboveZero((request: any) => request.Column)),
    precondition((request: any) => request.Selection,
        isNotNull((request: any) => request.Selection.Start.Line),
        isAboveZero((request: any) => request.Selection.Start.Line),
        isNotNull((request: any) => request.Selection.Start.Column),
        isAboveZero((request: any) => request.Selection.Start.Column),
        isNotNull((request: any) => request.Selection.End.Line),
        isAboveZero((request: any) => request.Selection.End.Line),
        isNotNull((request: any) => request.Selection.End.Column),
        isAboveZero((request: any) => request.Selection.End.Column))
];

// OmniSharp.Models.UpdateBufferRequest
export const updatebuffer: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Buffer)
];

// OmniSharp.Models.ChangeBufferRequest
export const changebuffer: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.NewText),
    isNotNull((request: any) => request.StartLine),
    isAboveZero((request: any) => request.StartLine),
    isNotNull((request: any) => request.StartColumn),
    isAboveZero((request: any) => request.StartColumn),
    isNotNull((request: any) => request.EndLine),
    isAboveZero((request: any) => request.EndLine),
    isNotNull((request: any) => request.EndColumn),
    isAboveZero((request: any) => request.EndColumn)
];

// OmniSharp.Models.CodeCheckRequest
export const codecheck: MethodDecorator[] = [


];

// OmniSharp.Models.FormatAfterKeystrokeRequest
export const formatAfterKeystroke: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.Character || request.Char)
];

// OmniSharp.Models.FormatRangeRequest
export const formatRange: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.EndLine),
    isAboveZero((request: any) => request.EndLine),
    isNotNull((request: any) => request.EndColumn),
    isAboveZero((request: any) => request.EndColumn)
];

// OmniSharp.Models.CodeFormatRequest
export const codeformat: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.AutoCompleteRequest
export const autocomplete: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.WordToComplete)
];

// OmniSharp.Models.FindImplementationsRequest
export const findimplementations: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.FindSymbolsRequest
export const findsymbols: MethodDecorator[] = [
    isNotNull((request: any) => request.Filter)
];

// OmniSharp.Models.FindUsagesRequest
export const findusages: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.FixUsingsRequest
export const fixusings: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.GotoDefinitionRequest
export const gotodefinition: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.NavigateUpRequest
export const navigateup: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.GotoFileRequest
export const gotofile: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.GotoRegionRequest
export const gotoregion: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.HighlightRequest
export const highlight: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.MetadataRequest
export const metadata: MethodDecorator[] = [
    isNotNull((request: any) => request.AssemblyName),
    isNotNull((request: any) => request.TypeName)
];

// OmniSharp.Models.NavigateDownRequest
export const navigatedown: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.PackageSearchRequest
export const packagesearch: MethodDecorator[] = [
    isNotNull((request: any) => request.ProjectPath),
    isNotNull((request: any) => request.Search)
];

// OmniSharp.Models.PackageSourceRequest
export const packagesource: MethodDecorator[] = [
    isNotNull((request: any) => request.ProjectPath)
];

// OmniSharp.Models.PackageVersionRequest
export const packageversion: MethodDecorator[] = [
    isNotNull((request: any) => request.ProjectPath),
    isNotNull((request: any) => request.Id)
];

// OmniSharp.Models.RenameRequest
export const rename: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.RenameTo)
];

// OmniSharp.Models.SignatureHelpRequest
export const signatureHelp: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.MembersTreeRequest
export const currentfilemembersastree: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.MembersFlatRequest
export const currentfilemembersasflat: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.TypeLookupRequest
export const typelookup: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.Request[]
export const filesChanged: MethodDecorator[] = [
    isNotNull((request: any) => request)
];

// OmniSharp.Models.v1.WorkspaceInformationRequest
export const projects: MethodDecorator[] = [


];

// OmniSharp.Models.v1.ProjectInformationRequest
export const project: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.TestCommandRequest
export const gettestcontext: MethodDecorator[] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.Type),
    isAboveZero((request: any) => request.Type)
];
