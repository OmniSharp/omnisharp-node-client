import {ReplaySubject, Observable} from "rxjs";
import {CompositeDisposable, Disposable, IDisposable} from "../disposables";
import _ from "lodash";
import {DriverState} from "../enums";
import {OmnisharpClientStatus} from "../enums";
import {aggregate} from "../helpers/decorators";
import OmniSharp, {Context, Models, CombinationKey} from "../omnisharp-server";
import {ReactiveClient} from "./reactive-client";

export class ReactiveCombinationClient<TClient extends ReactiveClient> implements OmniSharp.Aggregate.Events, OmniSharp.Events.Aggregate.V2, IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    public _clientsSubject = new ReplaySubject<TClient[]>(1);

    @aggregate public get diagnostic(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.DiagnosticMessage>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get projectAdded(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get projectChanged(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get projectRemoved(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get error(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get msBuildProjectDiagnostics(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get packageRestoreStarted(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get packageRestoreFinished(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get unresolvedDependencies(): Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]> { throw new Error("Implemented by decorator"); }

    @aggregate public get state(): Observable<OmniSharp.CombinationKey<DriverState>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get status(): Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]> { throw new Error("Implemented by decorator"); }

    constructor(private clients: TClient[] = []) {
        this.next();
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeAggregateObserable = <T>(selector: (client: TClient) => Observable<T>) => {

        // Caches the value, so that when the underlying clients change
        // we can start with the old value of the remaining clients
        const cache: { [key: string]: T } = {};

        /* tslint:disable:no-string-literal */
        return this._clientsSubject.switchMap(clients => {
            // clean up after ourselves.
            const removal = _.difference(_.keys(cache), clients.map(z => z.uniqueId));
            _.each(removal, z => delete cache[z]);

            return Observable.combineLatest(
                clients.map(z => selector(z).startWith(cache[z.uniqueId])),
                (...values: T[]) =>
                    values.map((value, index) => {
                        cache[clients[index].uniqueId] = value;

                        return {
                            key: clients[index].uniqueId,
                            value: value
                        };
                    })
            );
        }).share();
        /* tslint:enable:no-string-literal */

    };

    public observe<T>(selector: (client: TClient) => Observable<T>) {
        return this.makeAggregateObserable(selector);
    }

    private next = () => this._clientsSubject.next(this.clients.slice());

    public add(client: TClient) {
        this.clients.push(client);
        this.next();
        const d = Disposable.create(() => {
            _.pull(this.clients, client);
            this.next();
        });
        this._clientDisposable.add(d);
        return d;
    }

    @aggregate public get autocomplete(): Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get changebuffer(): Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get codecheck(): Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get codeformat(): Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get currentfilemembersasflat(): Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get currentfilemembersastree(): Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get filesChanged(): Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get findimplementations(): Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get findsymbols(): Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get findusages(): Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get fixusings(): Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get formatAfterKeystroke(): Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get formatRange(): Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get getcodeactions(): Observable<CombinationKey<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get gettestcontext(): Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get gotodefinition(): Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get open(): Observable<CombinationKey<Context<Models.FileOpenRequest, Models.FileOpenResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get close(): Observable<CombinationKey<Context<Models.FileCloseRequest, Models.FileCloseResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get gotofile(): Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get gotoregion(): Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get highlight(): Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get metadata(): Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get navigatedown(): Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get navigateup(): Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get packagesearch(): Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get packagesource(): Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get packageversion(): Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get project(): Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get projects(): Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get rename(): Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get runcodeaction(): Observable<CombinationKey<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get signatureHelp(): Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get typelookup(): Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]> { throw new Error("Implemented by decorator"); }
    @aggregate public get updatebuffer(): Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]> { throw new Error("Implemented by decorator"); }
}
