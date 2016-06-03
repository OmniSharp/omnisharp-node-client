import * as OmniSharp from "../omnisharp-server";
import _ from "lodash";

export type PreconditionMethod = ((request: any) => void);

function isNotNull(method: Function) {
    return function (request: OmniSharp.Models.Request) {
        const result = method(request);
        if (result === null || result === undefined) {
            const match = method.toString().match(/function \(request\) { return (.*?); }/);
            const methodText = match && match[1] || method.toString();
            const errorText = `${methodText}  must not be null.`;
            throw new Error(errorText);
        }
    };
}

function isAboveZero(method: Function) {
    return function (request: OmniSharp.Models.Request) {
        const minValue = -1;
        const result = method(request);
        if (result === null || result === undefined) {
            return;
        }
        if (result <= minValue) {
            const match = method.toString().match(/function \(request\) { return (.*?); }/);
            const methodText = match && match[1] || method.toString();
            const errorText = `${methodText} must be greater than or equal to ${minValue + 1}.`;
            throw new Error(errorText);
        }
    };
}

function precondition(method: Function, ...decorators: PreconditionMethod[]) {
    return function (request: OmniSharp.Models.Request) {
        _.each(decorators, decorator => {
            decorator(request);
        });
    };
}

export const preconditions: { [index: string]: PreconditionMethod[] } = {};


preconditions["/v2/getcodeactions"] = [
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

preconditions["/v2/runcodeaction"] = [
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
preconditions["/updatebuffer"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Buffer)
];

// OmniSharp.Models.ChangeBufferRequest
preconditions["/changebuffer"] = [
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

// OmniSharp.Models.FormatAfterKeystrokeRequest
preconditions["/formatafterkeystroke"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.Character || request.Char)
];

// OmniSharp.Models.FormatRangeRequest
preconditions["/formatrange"] = [
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
preconditions["/codeformat"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.AutoCompleteRequest
preconditions["/autocomplete"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.WordToComplete)
];

// OmniSharp.Models.FindImplementationsRequest
preconditions["/findimplementations"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.FindSymbolsRequest
preconditions["/findsymbols"] = [
    isNotNull((request: any) => request.Filter)
];

// OmniSharp.Models.FindUsagesRequest
preconditions["/findusages"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.FixUsingsRequest
preconditions["/fixusings"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.GotoDefinitionRequest
preconditions["/gotodefinition"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.NavigateUpRequest
preconditions["/navigateup"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.GotoFileRequest
preconditions["/gotofile"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.GotoRegionRequest
preconditions["/gotoregion"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.HighlightRequest
preconditions["/highlight"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.MetadataRequest
preconditions["/metadata"] = [
    isNotNull((request: any) => request.AssemblyName),
    isNotNull((request: any) => request.TypeName)
];

// OmniSharp.Models.NavigateDownRequest
preconditions["/navigatedown"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.PackageSearchRequest
preconditions["/packagesearch"] = [
    isNotNull((request: any) => request.ProjectPath),
    isNotNull((request: any) => request.Search)
];

// OmniSharp.Models.PackageSourceRequest
preconditions["/packagesource"] = [
    isNotNull((request: any) => request.ProjectPath)
];

// OmniSharp.Models.PackageVersionRequest
preconditions["/packageversion"] = [
    isNotNull((request: any) => request.ProjectPath),
    isNotNull((request: any) => request.Id)
];

// OmniSharp.Models.RenameRequest
preconditions["/rename"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.RenameTo)
];

// OmniSharp.Models.SignatureHelpRequest
preconditions["/signaturehelp"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.MembersTreeRequest
preconditions["/currentfilemembersastree"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.MembersFlatRequest
preconditions["/currentfilemembersasflat"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.TypeLookupRequest
preconditions["/typelookup"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column)
];

// OmniSharp.Models.Request[]
preconditions["/fileschanged"] = [
    isNotNull((request: any) => request)
];

// OmniSharp.Models.v1.ProjectInformationRequest
preconditions["/project"] = [
    isNotNull((request: any) => request.FileName)
];

// OmniSharp.Models.TestCommandRequest
preconditions["/gettestcontext"] = [
    isNotNull((request: any) => request.FileName),
    isNotNull((request: any) => request.Line),
    isAboveZero((request: any) => request.Line),
    isNotNull((request: any) => request.Column),
    isAboveZero((request: any) => request.Column),
    isNotNull((request: any) => request.Type),
    isAboveZero((request: any) => request.Type)
];
