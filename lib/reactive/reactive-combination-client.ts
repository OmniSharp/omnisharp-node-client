import * as OmniSharp from "../omnisharp-server";
import {ReplaySubject, Observable} from "rxjs";
import {CompositeDisposable, Disposable, IDisposable} from "../disposables";
import {DriverState, OmnisharpClientStatus} from "../enums";
import _ from "lodash";
import {ReactiveClient} from "./reactive-client";
import {setMergeOrAggregate, getInternalKey, makeObservable} from "../helpers/decorators";

export class ReactiveCombinationClient<TClient extends ReactiveClient> implements IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    public _clientsSubject = new ReplaySubject<TClient[]>(1);

    constructor(private clients: TClient[] = []) {
        this.next();
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeObservable = <T>(selector: (client: TClient) => Observable<T>) => {

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

    public listenTo<T>(selector: (client: TClient) => Observable<T>) {
        return this.makeObservable(selector);
    }

    public listen<T>(selector: string) {
        const key = getInternalKey(selector);
        let value = this[key];
        if (!value) {
            return setMergeOrAggregate(this, selector);
        }
        return value;
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
}

makeObservable(ReactiveCombinationClient.prototype, "state", "state");
makeObservable(ReactiveCombinationClient.prototype, "status", "status");

export interface ReactiveCombinationClient {
    /*readonly*/ responses: Observable<OmniSharp.CombinationKey<DriverState>[]>;
    /*readonly*/ errors: Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]>;
}

// <#GENERATED />
makeObservable(ReactiveCombinationClient.prototype, "getteststartinfo", "/v2/getteststartinfo");
makeObservable(ReactiveCombinationClient.prototype, "runtest", "/v2/runtest");
makeObservable(ReactiveCombinationClient.prototype, "autocomplete", "/autocomplete");
makeObservable(ReactiveCombinationClient.prototype, "changebuffer", "/changebuffer");
makeObservable(ReactiveCombinationClient.prototype, "codecheck", "/v2/codecheck");
makeObservable(ReactiveCombinationClient.prototype, "codeformat", "/codeformat");
makeObservable(ReactiveCombinationClient.prototype, "close", "/close");
makeObservable(ReactiveCombinationClient.prototype, "open", "/open");
makeObservable(ReactiveCombinationClient.prototype, "filesChanged", "/filesChanged");
makeObservable(ReactiveCombinationClient.prototype, "findimplementations", "/findimplementations");
makeObservable(ReactiveCombinationClient.prototype, "findsymbols", "/findsymbols");
makeObservable(ReactiveCombinationClient.prototype, "findusages", "/findusages");
makeObservable(ReactiveCombinationClient.prototype, "fixusings", "/fixusings");
makeObservable(ReactiveCombinationClient.prototype, "formatAfterKeystroke", "/formatAfterKeystroke");
makeObservable(ReactiveCombinationClient.prototype, "formatRange", "/formatRange");
makeObservable(ReactiveCombinationClient.prototype, "getcodeactions", "/v2/getcodeactions");
makeObservable(ReactiveCombinationClient.prototype, "gotodefinition", "/gotodefinition");
makeObservable(ReactiveCombinationClient.prototype, "gotofile", "/gotofile");
makeObservable(ReactiveCombinationClient.prototype, "gotoregion", "/gotoregion");
makeObservable(ReactiveCombinationClient.prototype, "highlight", "/highlight");
makeObservable(ReactiveCombinationClient.prototype, "currentfilemembersasflat", "/currentfilemembersasflat");
makeObservable(ReactiveCombinationClient.prototype, "currentfilemembersastree", "/currentfilemembersastree");
makeObservable(ReactiveCombinationClient.prototype, "metadata", "/metadata");
makeObservable(ReactiveCombinationClient.prototype, "navigatedown", "/navigatedown");
makeObservable(ReactiveCombinationClient.prototype, "navigateup", "/navigateup");
makeObservable(ReactiveCombinationClient.prototype, "packagesearch", "/packagesearch");
makeObservable(ReactiveCombinationClient.prototype, "packagesource", "/packagesource");
makeObservable(ReactiveCombinationClient.prototype, "packageversion", "/packageversion");
makeObservable(ReactiveCombinationClient.prototype, "rename", "/rename");
makeObservable(ReactiveCombinationClient.prototype, "runcodeaction", "/v2/runcodeaction");
makeObservable(ReactiveCombinationClient.prototype, "signatureHelp", "/signatureHelp");
makeObservable(ReactiveCombinationClient.prototype, "gettestcontext", "/gettestcontext");
makeObservable(ReactiveCombinationClient.prototype, "typelookup", "/typelookup");
makeObservable(ReactiveCombinationClient.prototype, "updatebuffer", "/updatebuffer");
makeObservable(ReactiveCombinationClient.prototype, "project", "/project");
makeObservable(ReactiveCombinationClient.prototype, "projects", "/projects");
makeObservable(ReactiveCombinationClient.prototype, "checkalivestatus", "/checkalivestatus");
makeObservable(ReactiveCombinationClient.prototype, "checkreadystatus", "/checkreadystatus");
makeObservable(ReactiveCombinationClient.prototype, "stopserver", "/stopserver");
makeObservable(ReactiveCombinationClient.prototype, "projectAdded", "projectAdded");
makeObservable(ReactiveCombinationClient.prototype, "projectChanged", "projectChanged");
makeObservable(ReactiveCombinationClient.prototype, "projectRemoved", "projectRemoved");
makeObservable(ReactiveCombinationClient.prototype, "error", "error");
makeObservable(ReactiveCombinationClient.prototype, "diagnostic", "diagnostic");
makeObservable(ReactiveCombinationClient.prototype, "msBuildProjectDiagnostics", "msBuildProjectDiagnostics");
makeObservable(ReactiveCombinationClient.prototype, "packageRestoreStarted", "packageRestoreStarted");
makeObservable(ReactiveCombinationClient.prototype, "packageRestoreFinished", "packageRestoreFinished");
makeObservable(ReactiveCombinationClient.prototype, "unresolvedDependencies", "unresolvedDependencies");

export interface ReactiveCombinationClient {
    /*readonly*/ getteststartinfo: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, any>>[]>;
    /*readonly*/ runtest: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, any>>[]>;
    /*readonly*/ autocomplete: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    /*readonly*/ changebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    /*readonly*/ codecheck: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>[]>;
    /*readonly*/ codeformat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
    /*readonly*/ close: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>[]>;
    /*readonly*/ open: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>[]>;
    /*readonly*/ filesChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
    /*readonly*/ findimplementations: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    /*readonly*/ findsymbols: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    /*readonly*/ findusages: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    /*readonly*/ fixusings: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
    /*readonly*/ formatAfterKeystroke: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    /*readonly*/ formatRange: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    /*readonly*/ getcodeactions: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
    /*readonly*/ gotodefinition: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    /*readonly*/ gotofile: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    /*readonly*/ gotoregion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    /*readonly*/ highlight: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    /*readonly*/ currentfilemembersasflat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
    /*readonly*/ currentfilemembersastree: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
    /*readonly*/ metadata: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    /*readonly*/ navigatedown: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
    /*readonly*/ navigateup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
    /*readonly*/ packagesearch: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    /*readonly*/ packagesource: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    /*readonly*/ packageversion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    /*readonly*/ rename: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    /*readonly*/ runcodeaction: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
    /*readonly*/ signatureHelp: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
    /*readonly*/ gettestcontext: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    /*readonly*/ typelookup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    /*readonly*/ updatebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    /*readonly*/ project: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
    /*readonly*/ projects: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    /*readonly*/ checkalivestatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>>;
    /*readonly*/ checkreadystatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>>;
    /*readonly*/ stopserver: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>>;
    /*readonly*/ projectAdded: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    /*readonly*/ projectChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    /*readonly*/ projectRemoved: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    /*readonly*/ error: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
    /*readonly*/ diagnostic: Observable<OmniSharp.CombinationKey<OmniSharp.Models.DiagnosticMessage>[]>;
    /*readonly*/ msBuildProjectDiagnostics: Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
    /*readonly*/ packageRestoreStarted: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    /*readonly*/ packageRestoreFinished: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    /*readonly*/ unresolvedDependencies: Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;
    listen(path: "/v2/getteststartinfo"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, any>>[]>;
    listen(path: "/v2/runtest"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, any>>[]>;
    listen(path: "/autocomplete"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    listen(path: "/changebuffer"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    listen(path: "/codecheck"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    listen(path: "/codeformat"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
    listen(path: "/close"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>[]>;
    listen(path: "/open"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>[]>;
    listen(path: "/filesChanged"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
    listen(path: "/findimplementations"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    listen(path: "/findsymbols"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    listen(path: "/findusages"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    listen(path: "/fixusings"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>[]>;
    listen(path: "/formatAfterKeystroke"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    listen(path: "/formatRange"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    listen(path: "/getcodeactions"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
    listen(path: "/gotodefinition"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    listen(path: "/gotofile"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    listen(path: "/gotoregion"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    listen(path: "/highlight"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    listen(path: "/currentfilemembersasflat"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
    listen(path: "/currentfilemembersastree"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>[]>;
    listen(path: "/metadata"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>[]>;
    listen(path: "/navigatedown"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>[]>;
    listen(path: "/navigateup"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
    listen(path: "/packagesearch"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    listen(path: "/packagesource"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    listen(path: "/packageversion"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    listen(path: "/rename"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    listen(path: "/runcodeaction"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
    listen(path: "/signatureHelp"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
    listen(path: "/gettestcontext"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;
    listen(path: "/typelookup"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    listen(path: "/updatebuffer"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    listen(path: "/v2/codecheck"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>[]>;
    listen(path: "/v2/getcodeactions"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
    listen(path: "/v2/runcodeaction"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
    listen(path: "/project"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>[]>;
    listen(path: "/projects"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    listen(path: "/checkalivestatus"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    listen(path: "/checkreadystatus"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    listen(path: "/stopserver"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    listen(path: "projectAdded"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    listen(path: "projectChanged"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    listen(path: "projectRemoved"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    listen(path: "error"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
    listen(path: "diagnostic"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.DiagnosticMessage>[]>;
    listen(path: "msBuildProjectDiagnostics"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
    listen(path: "packageRestoreStarted"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    listen(path: "packageRestoreFinished"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    listen(path: "unresolvedDependencies"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;

}
