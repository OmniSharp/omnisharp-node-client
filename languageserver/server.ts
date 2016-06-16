import {Models, ReactiveClient, Runtime, DriverState} from "../lib/omnisharp-client";
import _ from "lodash";

import {
    StreamMessageReader, StreamMessageWriter,
    createConnection, IConnection, TextDocumentSyncKind,
    TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
    InitializeParams, InitializeResult, TextDocumentPositionParams,
    CompletionItem, CompletionItemKind, CodeLens, Hover, Location,
    SignatureHelp, SignatureInformation, ParameterInformation,
    SymbolInformation, SymbolKind, Range, Command, TextEdit
} from "vscode-languageserver";

let connection: IConnection = createConnection(new StreamMessageReader(process.stdin), new StreamMessageWriter(process.stdout));

let client: ReactiveClient;

// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites.
connection.onInitialize((params) => {
    client = new ReactiveClient({
        projectPath: params.rootPath,
        runtime: Runtime.CoreClr
    });

    client.connect();

    client.observe.diagnostic.subscribe(({Results}) => {
        _.each(Results, result => {
            connection.sendDiagnostics({
                uri: result.FileName,
                diagnostics: _.map(result.QuickFixes, getDiagnostic)
            });
        });
    });

    // Kick code checking on.
    client.request("/v2/codecheck", {});

    // TEMP?  Is this needed?
    client.observe.events.subscribe(x => {
        connection.telemetry.logEvent(x);
    });

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
            //documentFormattingProvider: true,
            documentOnTypeFormattingProvider: {
                firstTriggerCharacter: "}",
                moreTriggerCharacter: [";"]
            },
            documentRangeFormattingProvider: true,
            //documentSymbolProvider: true,
            hoverProvider: true,
            referencesProvider: true,
            renameProvider: true,
            signatureHelpProvider: {
                triggerCharacters: ["("]
            },
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
    if (contentChanges.length > 0) {
        // TextDocumentSyncKind.Incremental
        const changes = _.map(contentChanges, change =>
            (<Models.LinePositionSpanTextChange>{
                NewText: change.text,
                FileName: textDocument.uri,
                StartColumn: change.range.start.character,
                StartLine: change.range.start.line,
                EndColumn: change.range.end.character,
                EndLine: change.range.end.line,
            }));
        client.updatebuffer({
            FileName: textDocument.uri,
            Changes: changes
        });
    } else {
        // TextDocumentSyncKind.Full
        client.updatebuffer({
            FileName: textDocument.uri,
            Buffer: contentChanges[0].text
        });
    }
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

connection.onDidSaveTextDocument((x) => {
    client.updatebuffer({
        FileName: x.textDocument.uri,
        FromDisk: true
    });
});

connection.onDefinition(({textDocument, position}) => {
    return client.gotodefinition({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line
    })
        .map(getLocationPoint)
        .toPromise();
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
        WantSnippet: true,
        WordToComplete: ""
    }).map(x => _.map(x, value => {
        return <CompletionItem>{
            label: value.DisplayText,
            detail: value.Description,
            documentation: value.MethodHeader,
            filterText: value.CompletionText,
            kind: CompletionItemKind[value.Kind],
            sortText: value.DisplayText
        };
    }))
        .toPromise();
});
//connection.onCompletionResolve((x) => {});

connection.onHover(({textDocument, position}) => {
    return client.typelookup({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line
    })
        .map(result => (<Hover>{
            contents: result.Documentation,
        }))
        .toPromise();
});

connection.onSignatureHelp(({textDocument, position}) => {
    return client.signatureHelp({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line
    })
        .map(result => (<SignatureHelp>{
            activeParameter: result.ActiveParameter,
            activeSignature: result.ActiveSignature,
            signatures: _.map(result.Signatures, z => (<SignatureInformation>{
                documentation: z.Documentation,
                label: z.Label,
                parameters: _.map(z.Parameters, param => (<ParameterInformation>{
                    documentation: param.Documentation,
                    label: param.Label,
                }))
            }))
        }))
        .toPromise();
});

connection.onReferences(({context, textDocument, position}) => {
    return client.findusages({
        FileName: textDocument.uri,
        Column: position.character,
        Line: position.line,
        ExcludeDefinition: !context.includeDeclaration
    })
        .map(result => _.map(<Models.DiagnosticLocation[]>result.QuickFixes, getLocation))
        .toPromise();
});

//connection.onDocumentHighlight((x) => {});
//connection.onDocumentSymbol((x) => {});

connection.onWorkspaceSymbol(({query}) => {
    return client.findsymbols({ Filter: query })
        .map(results => _.map(<Models.SymbolLocation[]>results.QuickFixes, fix => (<SymbolInformation>{
            kind: SymbolKind[fix.Kind] || SymbolKind.Variable,
            name: fix.Text,
            location: getLocation(fix)
        })))
        .toPromise();
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
    })
        .map(z => _.map(z.CodeActions, action => (<Command>{
            command: action.Identifier,
            title: action.Name
        })))
        .toPromise();
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
                    range: getRange(location)
                };
            });
        })
        .toPromise();
});

connection.onCodeLensResolve((codeLens) => {
    return client.findusages(codeLens.data)
        .map(x => {
            codeLens.command = {
                title: `References (${x.QuickFixes.length})`,
                command: ``
            };
            return codeLens;
        })
        .toPromise();
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
    })
        .map(getTextEdits)
        .toPromise();
});

connection.onDocumentOnTypeFormatting(({textDocument, options, position, ch}) => {
    return client.formatAfterKeystroke({
        FileName: textDocument.uri,
        Character: ch,
        Line: position.line,
        Column: position.character
    })
        .map(getTextEdits)
        .toPromise();
});

connection.onRenameRequest(({textDocument, position, newName}) => {
    return client.rename({
        FileName: textDocument.uri,
        Line: position.line,
        Column: position.character,
        RenameTo: newName
    })
        .map(item => {
            const changes: { [uri: string]: TextEdit[]; } = {};
            _.each(item.Changes, result => {
                changes[result.FileName] = getTextEdits(result);
            });
            return { changes };
        })
        .toPromise();
});

// Listen on the connection
connection.listen();

function getRange(fix: { StartColumn: number; StartLine: number; EndColumn: number; EndLine: number; }): Range;
function getRange(fix: { Column: number; Line: number; EndColumn: number; EndLine: number; }): Range;
function getRange(fix: { Column: number; Line: number; StartColumn: number; StartLine: number; EndColumn: number; EndLine: number; }) {
    return <Range>{
        start: {
            character: fix.Column || fix.StartColumn || 0,
            line: fix.Line || fix.StartLine || 0
        },
        end: {
            character: fix.EndColumn,
            line: fix.EndLine
        }
    };
}

function getLocationPoint(fix: { Column: number; Line: number; FileName: string; }) {
    return getLocation(_.assign(fix, { EndColumn: fix.Column, EndLine: fix.Line }));
}

function getLocation(fix: { Column: number; Line: number; EndColumn: number; EndLine: number; FileName: string; }) {
    return <Location>{
        uri: fix.FileName,
        range: getRange(fix)
    };
}

function getTextEdit(change: Models.LinePositionSpanTextChange) {
    return <TextEdit>{
        range: getRange(change),
        newText: change.NewText,
    };
}

function getTextEdits(response: { Changes: Models.LinePositionSpanTextChange[] }) {
    return _.map(response.Changes, getTextEdit);
}

function getDiagnostic(item: Models.DiagnosticLocation) {
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
