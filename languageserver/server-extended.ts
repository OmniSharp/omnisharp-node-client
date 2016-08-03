
import {
    StreamMessageReader, StreamMessageWriter,
    createConnection, IConnection, TextDocumentSyncKind,
    TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
    InitializeParams, InitializeResult, TextDocumentPositionParams,
    CompletionItem, CompletionItemKind, CodeLens, Hover, Location,
    CompletionList,
    SignatureHelp, SignatureInformation, ParameterInformation,
    SymbolInformation, SymbolKind, Range, Command, TextEdit,
    NotificationType, Files, TextDocumentIdentifier, CodeActionContext, WorkspaceEdit, ServerCapabilities
} from "vscode-languageserver";
import { /* NotificationType, */ RequestType } from 'vscode-jsonrpc';

export interface ExtendedServerCapabilities {
    extended: {
        getCodeActionsProvider?: boolean;
        runCodeActionProvider?: boolean;
    }
}


export interface GetCodeActionsParams {
    /**
     * The document in which the command was invoked.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The range for which the command was invoked.
     */
    range: Range;

    /**
     * Context carrying additional information.
     */
    context: CodeActionContext;
}

export interface CodeActionList {
    codeActions: CodeAction[];
}

export interface CodeAction {
    name: string;
    identifier: string;
}

export interface RunCodeActionParams extends GetCodeActionsParams {
    /**
     * The identifier of the code action to execute
     */
    identifier: string;
}

export namespace Methods {
    export namespace Extended {
        export const GetCodeActionsRequest = '__extended/textDocument/getCodeActions'
        export const RunCodeActionRequest = '__extended/textDocument/runCodeAction'
    }
}

/**
 * A request to rename a symbol.
 */
export namespace GetCodeActionsRequest {
    export const type: RequestType<GetCodeActionsParams, CodeActionList, void> = { get method() { return Methods.Extended.GetCodeActionsRequest; } };
}

/**
 * A request to rename a symbol.
 */
export namespace RunCodeActionRequest {
    export const type: RequestType<RunCodeActionParams, WorkspaceEdit, void> = { get method() { return Methods.Extended.RunCodeActionRequest; } };
}
