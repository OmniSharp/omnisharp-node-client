import {Models, ReactiveClient} from "../lib/omnisharp-client";
import _ from "lodash";
import {Observable} from "rxjs";

import {
    IPCMessageReader, IPCMessageWriter,
    createConnection, IConnection, TextDocumentSyncKind,
    TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
    InitializeParams, InitializeResult, TextDocumentPositionParams,
    CompletionItem, CompletionItemKind, CodeLens
} from "vscode-languageserver";

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites.
let client: ReactiveClient;
connection.onInitialize((params): InitializeResult => {
    client = new ReactiveClient({
        projectPath: params.rootPath,
    });
    client.connect();

    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Full,
            // Not currently supported
            //textDocumentSync: TextDocumentSyncKind.Incremental,
            completionProvider: {
                //resolveProvider: true
            },
            codeLensProvider: {
                resolveProvider: true
            },
            definitionProvider: true,
            codeActionProvider: true,
            documentFormattingProvider: true,
            documentOnTypeFormattingProvider: {
                firstTriggerCharacter: "}",
                moreTriggerCharacter: [";"]
            },
            documentRangeFormattingProvider: true,
            //documentSymbolProvider: true,
            hoverProvider: true,
            referencesProvider: true,
            renameProvider: true,
            signatureHelpProvider: true,
            workspaceSymbolProvider: true
        }
    };
});

connection.onExit(() => {
    client.disconnect();
});
/* not yet doing this... */
// connection.onDidChangeConfiguration((change) => {
// });

connection.onDidChangeWatchedFiles((change) => {
    _.each(change.changes, change => {
        client.updatebuffer({
            FileName: change.uri,
            FromDisk: true
        });
    });
});

// ** Do we need this yet? **
// connection.onCompletionResolve((item: CompletionItem) => {
// });


connection.onDidChangeTextDocument(({textDocument, contentChanges}) => {
    // if (contentChanges.length > 0) {
    //     // Needs a new API.
    //     // _.map(contentChanges, change => {
    //     //     return <Models.ChangeBufferRequest>{
    //     //         FileName: textDocument.uri,
    //     //         StartColumn: change.range.start,
    //     //         StartLine: change.range.end,
    //     //         EndColumn: change.rangeLength,
    //     //         EndLine: change.ra
    //     //     };
    //     // })
    //     // client.changebuffer({
    //     //     FileName: textDocument.uri,
    //     // })
    // }
    if (contentChanges.length > 1) {
        throw new Error("uh oh...");
    }
    client.updatebuffer({
        FileName: textDocument.uri,
        Buffer: contentChanges[0].text
    });
});

connection.onDidOpenTextDocument(({textDocument}) => {
    client.open({
        FileName: textDocument.uri
    });
    client.updatebuffer({
        FileName: textDocument.uri,
        Buffer: textDocument.text
    });
});

connection.onDidCloseTextDocument(({textDocument}) => {
    client.close({
        FileName: textDocument.uri
    });
});

connection.onDefinition(({textDocument, position}) => {
    return client.gotodefinition({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line
    });
});

connection.onCompletion(({textDocument, position}: TextDocumentPositionParams) => {
    return client.autocomplete({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line,
        WantDocumentationForEveryCompletionResult: true,
        WantKind: true,
        WantImportableTypes: true,
        WantMethodHeader: true,
        WantReturnType: true,
        WantSnippet: true
    }).map(x => _.map(x, value => {
        return <CompletionItem>{
            label: value.DisplayText,
            detail: value.Description,
            documentation: value.MethodHeader,
            filterText: value.CompletionText,
            kind: CompletionItemKind[value.Kind],
            sortText: value.DisplayText
        };
    }));
});

function toDiagnostic(item: Models.DiagnosticLocation) {
    return <Diagnostic>{
        severity: DiagnosticSeverity[item.LogLevel],
        message: item.Text,
        range: {
            start: {
                line: item.Line,
                character: item.Column
            },
            end: {
                line: item.EndLine,
                character: item.EndColumn
            }
        }
    };
}

client.observe.diagnostic.subscribe(({Results}) => {
    _.each(Results, result => {
        connection.sendDiagnostics({
            uri: result.FileName,
            diagnostics: _.map(result.QuickFixes, toDiagnostic)
        });
    });
});
// Kick code checking on.
client.request("/v2/codecheck", {});
//connection.onCompletionResolve((x) => {});
//connection.onDidSaveTextDocument((x) => {});

connection.onHover(({textDocument, position}) => {
    return client.typelookup({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line
    });
});

connection.onSignatureHelp(({textDocument, position}) => {
    return client.signatureHelp({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line
    });
});

connection.onReferences(({context, textDocument, position}) => {
    return client.findusages({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line,
        ExcludeDefinition: !context.includeDeclaration
    });
});

//connection.onDocumentHighlight((x) => {});
//connection.onDocumentSymbol((x) => {});

connection.onWorkspaceSymbol(({query}) => {
    return client.findsymbols({ Filter: query });
});

connection.onCodeAction(({textDocument, range, context}) => {
    return client.getcodeactions({
        FileName: textDocument.uri,
        Selection: {
            Start: {
                Column: range.start.character,
                Line: range.start.line
            },
            End: {
                Column: range.end.character,
                Line: range.end.line
            }
        }
    });
});

connection.onCodeLens(({textDocument}) => {
    return client.currentfilemembersasflat({
        FileName: textDocument.uri
    })
        .map(results => {
            return _.map(results, location => {
                return <CodeLens>{
                    data: {
                        FileName: location.FileName,
                        Column: location.Column,
                        Line: location.Line,
                    },
                    range: {
                        start: {
                            character: location.Column,
                            line: location.Line,
                        },
                        end: {
                            character: location.EndColumn,
                            line: location.EndLine
                        }
                    }
                };
            });
        });
});

connection.onCodeLensResolve((codeLens) => {
    return client.findusages(codeLens.data)
        .map(x => {
            codeLens.command = {
                title: `References (${x.QuickFixes.length})`,
                command: ``
            };
            return codeLens;
        });
});

/*
// Requires new endpoint
connection.onDocumentFormatting(({textDocument, options}) => {
    return client.formatRange({
        FileName: textDocument.uri,
    })
});
*/

connection.onDocumentRangeFormatting(({textDocument, options, range}) => {
    return client.formatRange({
        FileName: textDocument.uri,
        Column: range.start.character,
        Line: range.start.line,
        EndColumn: range.end.character,
        EndLine: range.end.line,
    });
});

connection.onDocumentOnTypeFormatting(({textDocument, options, position, ch}) => {
    return client.formatAfterKeystroke({
        FileName: textDocument.uri,
        Character: ch,
        Line: position.line,
        Column: position.character
    });
});

connection.onRenameRequest(({textDocument, position, newName}) => {
    return client.rename({
        FileName: textDocument.uri,
        Line: position.line,
        Column: position.character,
        RenameTo: newName
    });
});

// Listen on the connection
connection.listen();
