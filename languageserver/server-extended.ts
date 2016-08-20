
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
        implementationProvider?: boolean;
        navigateProvider?: boolean;
        highlightProvider?: boolean;
    }
}

export interface ClientCapabilities {
    highlightProvider?: boolean;
    enablePackageRestore?: boolean;
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

export interface NavigateParams extends TextDocumentPositionParams {
    direction: 'up' | 'down';
}

export interface CodeActionList {
    codeActions: CodeAction[];
}

export interface CodeAction {
    name: string;
    identifier: string;
}

export interface PublishHighlightParams {
    uri: string;
    added: Highlight[];
    removed: string[];
}

export interface Highlight {
    id: string;
    range: Range;
    kind: string;
    // projects: string[];
}

export type Implementation = Location | Location[];

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
        export const ImplementationRequest = '__extended/textDocument/implementation'
        export const NavigateRequest = '__extended/textDocument/navigate'
        export const PublishHighlightNotification = '__extended/textDocument/publishHighlight'
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

/**
 * A request to find implementation
 */
export namespace ImplementationRequest {
    export const type: RequestType<TextDocumentPositionParams, Implementation, void> = { get method() { return Methods.Extended.ImplementationRequest; } };
}

/**
 * A request to find implementation
 */
export namespace NavigateRequest {
    export const type: RequestType<NavigateParams, Position, void> = { get method() { return Methods.Extended.NavigateRequest; } };
}

/**
 * Diagnostics notification are sent from the server to the client to signal
 * results of validation runs.
 */
export namespace HighlightNotification {
    export const type: NotificationType<PublishHighlightParams> = { get method() { return Methods.Extended.PublishHighlightNotification; } };
}
