import { Models, ReactiveClient, Runtime, DriverState } from '../lib/omnisharp-client';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import {
    StreamMessageReader, StreamMessageWriter,
    createConnection, IConnection, TextDocumentSyncKind,
    TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
    InitializeParams, InitializeResult, TextDocumentPositionParams,
    CompletionItem, CompletionItemKind, CodeLens, Hover, Location,
    CompletionList,
    SignatureHelp, SignatureInformation, ParameterInformation,
    SymbolInformation, SymbolKind, Range, Command, TextEdit,
    NotificationType, Files, ServerCapabilities, Position
} from 'vscode-languageserver';

import { ExtendedServerCapabilities, CodeAction, CodeActionList, GetCodeActionsParams, GetCodeActionsRequest, Highlight, HighlightNotification, ImplementationRequest, NavigateRequest, RunCodeActionParams, RunCodeActionRequest, PublishHighlightParams, ClientCapabilities } from './server-extended';

let connection: IConnection = createConnection(new StreamMessageReader(process.stdin), new StreamMessageWriter(process.stdout));
let client: ReactiveClient;
const openEditors = new Set<string>();

const ExcludeClassifications = [
    Models.HighlightClassification.Number,
    Models.HighlightClassification.ExcludedCode,
    Models.HighlightClassification.Comment,
    Models.HighlightClassification.String,
    Models.HighlightClassification.Punctuation,
    Models.HighlightClassification.Operator,
    Models.HighlightClassification.Keyword
];

// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites.
connection.onInitialize((params) => {
    const enablePackageRestore = (<ClientCapabilities>params.capabilities).enablePackageRestore === undefined || (<ClientCapabilities>params.capabilities).enablePackageRestore;

    client = new ReactiveClient({
        projectPath: params.rootPath,
        runtime: Runtime.CoreClr,
        logger: {
            log: (message) => { connection.telemetry.logEvent({ type: 'log', message }); },
            error: (message) => { connection.telemetry.logEvent({ type: 'error', message }); }
        },
        serverOptions: {
            dotnet: { enablePackageRestore }
        }
    });

    client.observe.diagnostic.subscribe(({Results}) => {
        _.each(Results, result => {
            connection.sendDiagnostics({
                uri: toUri(result),
                diagnostics: _.map(result.QuickFixes, getDiagnostic)
            });
        });
    });

    if ((<ClientCapabilities>params.capabilities).highlightProvider) {
        const highlightsContext = new Map<string, Highlight[]>();

        client.observe.updatebuffer.subscribe(context => {
            if (openEditors.has(context.request.FileName!)) {
                client.highlight({
                    FileName: context.request.FileName,
                    ExcludeClassifications
                });
            }
        });

        client.observe.close.subscribe(context => {
            if (highlightsContext.has(context.request.FileName!)) {
                highlightsContext.delete(context.request.FileName!);
            }
        });

        client.observe.highlight
            .bufferToggle(client.observe.highlight.throttleTime(100), () => Observable.timer(100))
            .concatMap((items) => {
                const highlights = _(items)
                    .reverse()
                    .uniqBy(x => x.request.FileName!)
                    .map(context => {
                        if (!highlightsContext.has(context.request.FileName!)) {
                            highlightsContext.set(context.request.FileName!, []);
                        }

                        const newHighlights = getHighlights(context.response.Highlights);
                        const currentHighlights = highlightsContext.get(context.request.FileName!) !;
                        const added = _.differenceBy(newHighlights, currentHighlights, x => x.id);
                        const removeHighlights = _.differenceBy(currentHighlights, newHighlights, x => x.id);

                        highlightsContext.set(context.request.FileName!, newHighlights);

                        return {
                            uri: toUri({ FileName: context.request.FileName! }),
                            added,
                            removed: _.map(removeHighlights, x => x.id)
                        };
                    })
                    .value();

                return Observable.from(highlights).concatMap(x => Observable.of(x).delay(10));
            })
            .subscribe(item => connection.sendNotification(HighlightNotification.type, item));
    }

    client.observe.events.subscribe(event => {
        connection.console.info(JSON.stringify(event));
    });

    client.observe.requests.subscribe(event => {
        connection.console.info(JSON.stringify(event));
    });

    client.observe.responses.subscribe(event => {
        connection.console.info(JSON.stringify(event));
    });

    /*
     * Little big of magic here
     * This will wait for the server to update all the buffers after a rename operation
     * And then update the diagnostics for all of the buffers.
     */
    client.observe.rename
        .mergeMap(rename => {
            return client.observe.updatebuffer
                .debounceTime(1000)
                .take(1)
                .mergeMap(() => {
                    // TODO: Add a nicer way to queue many files here to omnisharp...
                    return Observable.merge(..._.map(rename.response.Changes, item => client.diagnostics({ FileName: item.FileName })));
                });
        })
        .subscribe();

    client.connect();

    return client.state
        .filter(x => x === DriverState.Connected)
        .take(1)
        .do(() => {
            // Kick code checking on.
            client.diagnostics({});
        })
        .map(() => ({
            capabilities: <ExtendedServerCapabilities & ServerCapabilities>{
                textDocumentSync: TextDocumentSyncKind.Full,
                // Not currently supported, see issue #289
                //textDocumentSync: TextDocumentSyncKind.Incremental,
                completionProvider: {
                    //resolveProvider: true
                },
                codeLensProvider: {
                    resolveProvider: true
                },
                definitionProvider: true,
                documentFormattingProvider: true,
                documentOnTypeFormattingProvider: {
                    firstTriggerCharacter: '}',
                    moreTriggerCharacter: [';']
                },
                documentRangeFormattingProvider: true,
                //documentSymbolProvider: true,
                hoverProvider: true,
                referencesProvider: true,
                renameProvider: true,
                signatureHelpProvider: {
                    triggerCharacters: ['(']
                },
                workspaceSymbolProvider: true,
                extended: {
                    getCodeActionsProvider: true,
                    runCodeActionProvider: true,
                    implementationProvider: true,
                    navigateProvider: true,
                    highlightProvider: true
                }
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
                StartColumn: change.range!.start.character,
                StartLine: change.range!.start.line,
                EndColumn: change.range!.end.character,
                EndLine: change.range!.end.line,
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
    openEditors.add(fromUri(textDocument));
});

connection.onDidCloseTextDocument(({textDocument}) => {
    client.close({
        FileName: fromUri(textDocument)
    });
    openEditors.delete(fromUri(textDocument));
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
            WordToComplete: ''
        }).map(x => _.map(x, value => {
            return <CompletionItem>{
                label: value.DisplayText,
                detail: value.Description,
                documentation: value.MethodHeader,
                filterText: value.CompletionText,
                kind: <any>CompletionItemKind[<any>value.Kind],
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
            kind: <any>SymbolKind[<any>fix.Kind] || SymbolKind.Variable,
            name: fix.Text,
            location: getLocation(fix)
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
                    data: _.defaults({ FileName: fromUri(textDocument) }, location),
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
                command: `references`
            };

            codeLens.data = {
                location: getLocation(codeLens.data)
            };
            return codeLens;
        })
        .toPromise();
});

// Requires new endpoint
connection.onDocumentFormatting(({textDocument, options}) => {
    return client.codeformat({
        WantsTextChanges: true,
        FileName: fromUri(textDocument),
    })
        .map(getTextEdits)
        .toPromise();
});

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
        RenameTo: newName,
        ApplyTextChanges: false,
        WantsTextChanges: true
    })
        .map(toWorkspaceEdit)
        .toPromise();
});

/* EXTENDED ENDPOINTS */
connection.onRequest(GetCodeActionsRequest.type, ({textDocument, range, context}) => {
    return client.getcodeactions({
        FileName: fromUri(textDocument),
        Selection: fromRange(range)
    })
        .map(item => {
            const codeActions = _.map(item.CodeActions, codeAction => {
                return {
                    name: codeAction.Name,
                    identifier: codeAction.Identifier
                };
            });

            return { codeActions };
        })
        .toPromise();
});

connection.onRequest(RunCodeActionRequest.type, ({textDocument, range, context, identifier}) => {
    return client.runcodeaction({
        FileName: fromUri(textDocument),
        Selection: fromRange(range),
        Identifier: identifier,
        WantsTextChanges: true,
        ApplyTextChanges: false
    })
        .map(toWorkspaceEdit)
        .toPromise();
});

connection.onRequest(ImplementationRequest.type, ({textDocument, position}) => {
    return client.findimplementations({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line
    })
        .map(z => z.QuickFixes)
        .map(getLocationPoints)
        .toPromise();
});

connection.onRequest(NavigateRequest.type, ({textDocument, position, direction}) => {
    let request: Observable<Models.NavigateResponse>;
    if (direction === 'up') {
        request = client.navigateup({
            FileName: fromUri(textDocument),
            Column: position.character,
            Line: position.line
        });
    } else {
        request = client.navigatedown({
            FileName: fromUri(textDocument),
            Column: position.character,
            Line: position.line
        });
    }
    return request
        .map(getPosition)
        .toPromise();
});

// Listen on the connection
connection.listen();

function getRange(item: { StartColumn: number; StartLine: number; EndColumn: number; EndLine: number; }): Range;
function getRange(item: { Column: number; Line: number; EndColumn: number; EndLine: number; }): Range;
function getRange(item: { Column?: number; Line?: number; StartColumn?: number; StartLine?: number; EndColumn: number; EndLine: number; }) {
    return <Range>{
        start: {
            character: item.Column || item.StartColumn || 0,
            line: item.Line || item.StartLine || 0
        },
        end: {
            character: item.EndColumn,
            line: item.EndLine
        }
    };
}

function getHighlights(highlights: Models.HighlightSpan[]) {
    return _.map(highlights, getHighlight);
}

function getHighlight(highlight: Models.HighlightSpan) {
    const range = getRange(highlight);
    return <Highlight>{
        id: `${range.start.line}:${range.start.character}|${range.end.line}:${range.end.character}|${highlight.Kind}`,
        range: range,
        kind: highlight.Kind,
    };
}

function getLocationPoints(fix: { Column: number; Line: number; FileName: string; }[]) {
    return _.map(fix, getLocationPoint);
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

function getPosition(model: Models.NavigateResponse) {
    return Position.create(model.Line, model.Column)
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
    if (item.LogLevel === 'Warning') {
        sev = DiagnosticSeverity.Warning;
    }
    if (item.LogLevel === 'Hidden') {
        sev = DiagnosticSeverity.Hint;
    }
    if (item.LogLevel === 'Information') {
        sev = DiagnosticSeverity.Information;
    }

    return <Diagnostic>{
        severity: sev,
        message: item.Text,
        range: getRange(item)
    };
}

function fromUri(document: { uri: string; }) {
    return Files.uriToFilePath(document.uri);
}

function fromRange(range: Range): Models.V2.Range {
    return {
        Start: {
            Column: range.start.character,
            Line: range.start.line
        },
        End: {
            Column: range.end.character,
            Line: range.end.line
        }
    };
}

function toUri(result: { FileName: string; }) {
    return toUriString(result.FileName);
}

function toWorkspaceEdit(item: { Changes: Models.ModifiedFileResponse[] }) {
    const changes: { [uri: string]: TextEdit[]; } = {};
    _.each(_.groupBy(item.Changes, x => x.FileName), (result, key) => {
        changes[toUriString(key)] = _.flatMap(
            result,
            item => {
                return _.map(item.Changes, getTextEdit);
            });
    });
    return { changes };
}

// TODO: this code isn't perfect
function toUriString(path: string) {
    return `file://${process.platform === 'win32' ? '/' : ''}${path.replace(':', encodeURIComponent(':'))}`;
}
