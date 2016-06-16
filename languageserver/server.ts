import {Models, ReactiveClient, Runtime, DriverState} from "../lib/omnisharp-client";
import _ from "lodash";

import {
    StreamMessageReader, StreamMessageWriter,
    createConnection, IConnection, TextDocumentSyncKind,
    TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
    InitializeParams, InitializeResult, TextDocumentPositionParams,
    CompletionItem, CompletionItemKind, CodeLens, Hover, Location,
    CompletionList,
    SignatureHelp, SignatureInformation, ParameterInformation,
    SymbolInformation, SymbolKind, Range, Command, TextEdit,
    NotificationType, Files
} from "vscode-languageserver";

let connection: IConnection = createConnection(new StreamMessageReader(process.stdin), new StreamMessageWriter(process.stdout));

let client: ReactiveClient;

// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites.
connection.onInitialize((params) => {
    client = new ReactiveClient({
        projectPath: params.rootPath,
        runtime: Runtime.CoreClr,
        logger: {
            log: (message) => { connection.telemetry.logEvent({ type: "log", message }); },
            error: (message) => { connection.telemetry.logEvent({ type: "error", message }); }
        }
    });

    client.connect();

    client.observe.diagnostic.subscribe(({Results}) => {
        _.each(Results, result => {
            connection.sendDiagnostics({
                uri: toUri(result),
                diagnostics: _.map(result.QuickFixes, getDiagnostic)
            });
        });
    });

    client.observe.events.subscribe(event => {
        connection.telemetry.logEvent(event);
    });

    client.observe.requests.subscribe(event => {
        connection.telemetry.logEvent(event);
    });

    client.observe.responses.subscribe(event => {
        connection.telemetry.logEvent(event);
    });

    return client.state
        .filter(x => x === DriverState.Connected)
        .take(1)
        .do(() => {
            // Kick code checking on.
            client.diagnostics({});
        })
        .map(() => ({
            capabilities: {
                //textDocumentSync: TextDocumentSyncKind.Full,
                // Not currently supported
                textDocumentSync: TextDocumentSyncKind.Incremental,
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
        }))
        .toPromise();
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
            FileName: fromUri(change),
            FromDisk: true
        });
    });
});

// ** Do we need this yet? **
// connection.onCompletionResolve((item: CompletionItem) => {
// });

connection.onDidChangeTextDocument(({textDocument, contentChanges}) => {
    // The editor itself might not support TextDocumentSyncKind.Incremental
    // So we check to see if we're getting ranges or not.
    if (contentChanges.length === 1 && !contentChanges[0].range) {
        // TextDocumentSyncKind.Full
        client.updatebuffer({
            FileName: fromUri(textDocument),
            Buffer: contentChanges[0].text
        });
    } else if (contentChanges.length > 0) {
        // TextDocumentSyncKind.Incremental
        const changes = _.map(contentChanges, change =>
            (<Models.LinePositionSpanTextChange>{
                NewText: change.text,
                FileName: fromUri(textDocument),
                StartColumn: change.range.start.character,
                StartLine: change.range.start.line,
                EndColumn: change.range.end.character,
                EndLine: change.range.end.line,
            }));
        client.updatebuffer({
            FileName: fromUri(textDocument),
            Changes: changes
        });
    }
});

connection.onDidOpenTextDocument(({textDocument}) => {
    client.open({
        FileName: fromUri(textDocument)
    });
    client.updatebuffer({
        FileName: fromUri(textDocument),
        Buffer: textDocument.text
    });
});

connection.onDidCloseTextDocument(({textDocument}) => {
    client.close({
        FileName: fromUri(textDocument)
    });
});

connection.onDidSaveTextDocument(({textDocument}) => {
    client.updatebuffer({
        FileName: fromUri(textDocument),
        FromDisk: true
    });
});

connection.onDefinition(({textDocument, position}) => {
    return client.gotodefinition({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line
    })
        .map(getLocationPoint)
        .toPromise();
});

connection.onCompletion(({textDocument, position}: TextDocumentPositionParams) => {
    return client
        .autocomplete({
            FileName: fromUri(textDocument),
            Column: position.character,
            Line: position.line,
            WantDocumentationForEveryCompletionResult: true,
            WantKind: true,
            WantImportableTypes: true,
            WantMethodHeader: true,
            WantReturnType: true,
            WantSnippet: false,
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
        .map(items => (<CompletionList>{
            isIncomplete: false, items
        }))
        .toPromise();
});
//connection.onCompletionResolve((x) => {});

connection.onHover(({textDocument, position}) => {
    return client.typelookup({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line
    })
        .map(result => (<Hover>{
            contents: `${result.Type || ''} ${result.Documentation || ''}`,
        }))
        .toPromise();
});

connection.onSignatureHelp(({textDocument, position}) => {
    return client.signatureHelp({
        FileName: fromUri(textDocument),
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
        FileName: fromUri(textDocument),
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
        FileName: fromUri(textDocument),
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
        FileName: fromUri(textDocument)
    })
        .map(results => {
            return _.map(results, location => {
                return <CodeLens>{
                    data: {
                        FileName: toUri(location),
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
                // TODO: ...?
                title: `References (${x.QuickFixes.length})`,
                command: `References (${x.QuickFixes.length})`
            };
            return codeLens;
        })
        .toPromise();
});

/*
// Requires new endpoint
connection.onDocumentFormatting(({textDocument, options}) => {
    return client.formatRange({
        FileName: getPath(textDocument),
    })
});
*/

connection.onDocumentRangeFormatting(({textDocument, options, range}) => {
    return client.formatRange({
        FileName: fromUri(textDocument),
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
        FileName: fromUri(textDocument),
        Character: ch,
        Line: position.line,
        Column: position.character
    })
        .map(getTextEdits)
        .toPromise();
});

connection.onRenameRequest(({textDocument, position, newName}) => {
    return client.rename({
        FileName: fromUri(textDocument),
        Line: position.line,
        Column: position.character,
        RenameTo: newName
    })
        .map(item => {
            const changes: { [uri: string]: TextEdit[]; } = {};
            _.each(item.Changes, result => {
                changes[toUri(result)] = getTextEdits(result);
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
        uri: toUri(fix),
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
    let sev = DiagnosticSeverity.Error;
    if (item.LogLevel === "Warning") {
        sev = DiagnosticSeverity.Warning;
    }
    if (item.LogLevel === "Hidden") {
        sev = DiagnosticSeverity.Hint;
    }
    if (item.LogLevel === "Information") {
        sev = DiagnosticSeverity.Information;
    }

    return <Diagnostic>{
        severity: sev,
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

function fromUri(document: { uri: string; }) {
    return Files.uriToFilePath(document.uri);
}

function toUri(result: { FileName: string; }) {
    return toUriString(result.FileName);
}

// TODO: this code isn't perfect
function toUriString(path: string) {
    return `file://${process.platform === "win32" ? "/" : ""}${path.replace(":", encodeURIComponent(":"))}`;
}
