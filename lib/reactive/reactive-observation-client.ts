import * as OmniSharp from "../omnisharp-server";
import {ReplaySubject, Observable} from "rxjs";
import {CompositeDisposable, Disposable, IDisposable} from "../disposables";
import _ from "lodash";
import {ReactiveClient} from "./reactive-client";
import {setMergeOrAggregate, getInternalKey, makeObservable} from "../helpers/decorators";
import {DriverState, OmnisharpClientStatus} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";

export class ReactiveObservationClient<TClient extends ReactiveClient> implements IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    protected _clientsSubject = new ReplaySubject<TClient[]>(1);

    constructor(private clients: TClient[] = []) {
        this.next();
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeObservable = <T>(selector: (client: TClient) => Observable<T>) => {
        return this._clientsSubject.switchMap(clients => Observable.merge<T>(...clients.map(selector))).share();
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

makeObservable(ReactiveObservationClient.prototype, "events", "events");
makeObservable(ReactiveObservationClient.prototype, "commands", "commands");
makeObservable(ReactiveObservationClient.prototype, "state", "state");
makeObservable(ReactiveObservationClient.prototype, "status", "status");
makeObservable(ReactiveObservationClient.prototype, "requests", "requests");
makeObservable(ReactiveObservationClient.prototype, "responses", "responses");
makeObservable(ReactiveObservationClient.prototype, "errors", "errors");

export interface ReactiveObservationClient {
    /*readonly*/ events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    /*readonly*/ commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    /*readonly*/ state: Observable<DriverState>;
    /*readonly*/ status: Observable<OmnisharpClientStatus>;
    /*readonly*/ requests: Observable<RequestContext<any>>;
    /*readonly*/ responses: Observable<ResponseContext<any, any>>;
    /*readonly*/ errors: Observable<CommandContext<any>>;
}

// <#GENERATED />
makeObservable(ReactiveObservationClient.prototype, "getteststartinfo", "/v2/getteststartinfo");
makeObservable(ReactiveObservationClient.prototype, "runtest", "/v2/runtest");
makeObservable(ReactiveObservationClient.prototype, "autocomplete", "/autocomplete");
makeObservable(ReactiveObservationClient.prototype, "changebuffer", "/changebuffer");
makeObservable(ReactiveObservationClient.prototype, "codecheck", "/v2/codecheck");
makeObservable(ReactiveObservationClient.prototype, "codeformat", "/codeformat");
makeObservable(ReactiveObservationClient.prototype, "close", "/close");
makeObservable(ReactiveObservationClient.prototype, "open", "/open");
makeObservable(ReactiveObservationClient.prototype, "filesChanged", "/filesChanged");
makeObservable(ReactiveObservationClient.prototype, "findimplementations", "/findimplementations");
makeObservable(ReactiveObservationClient.prototype, "findsymbols", "/findsymbols");
makeObservable(ReactiveObservationClient.prototype, "findusages", "/findusages");
makeObservable(ReactiveObservationClient.prototype, "fixusings", "/fixusings");
makeObservable(ReactiveObservationClient.prototype, "formatAfterKeystroke", "/formatAfterKeystroke");
makeObservable(ReactiveObservationClient.prototype, "formatRange", "/formatRange");
makeObservable(ReactiveObservationClient.prototype, "getcodeactions", "/v2/getcodeactions");
makeObservable(ReactiveObservationClient.prototype, "gotodefinition", "/gotodefinition");
makeObservable(ReactiveObservationClient.prototype, "gotofile", "/gotofile");
makeObservable(ReactiveObservationClient.prototype, "gotoregion", "/gotoregion");
makeObservable(ReactiveObservationClient.prototype, "highlight", "/highlight");
makeObservable(ReactiveObservationClient.prototype, "currentfilemembersasflat", "/currentfilemembersasflat");
makeObservable(ReactiveObservationClient.prototype, "currentfilemembersastree", "/currentfilemembersastree");
makeObservable(ReactiveObservationClient.prototype, "metadata", "/metadata");
makeObservable(ReactiveObservationClient.prototype, "navigatedown", "/navigatedown");
makeObservable(ReactiveObservationClient.prototype, "navigateup", "/navigateup");
makeObservable(ReactiveObservationClient.prototype, "packagesearch", "/packagesearch");
makeObservable(ReactiveObservationClient.prototype, "packagesource", "/packagesource");
makeObservable(ReactiveObservationClient.prototype, "packageversion", "/packageversion");
makeObservable(ReactiveObservationClient.prototype, "rename", "/rename");
makeObservable(ReactiveObservationClient.prototype, "runcodeaction", "/v2/runcodeaction");
makeObservable(ReactiveObservationClient.prototype, "signatureHelp", "/signatureHelp");
makeObservable(ReactiveObservationClient.prototype, "gettestcontext", "/gettestcontext");
makeObservable(ReactiveObservationClient.prototype, "typelookup", "/typelookup");
makeObservable(ReactiveObservationClient.prototype, "updatebuffer", "/updatebuffer");
makeObservable(ReactiveObservationClient.prototype, "project", "/project");
makeObservable(ReactiveObservationClient.prototype, "projects", "/projects");
makeObservable(ReactiveObservationClient.prototype, "checkalivestatus", "/checkalivestatus");
makeObservable(ReactiveObservationClient.prototype, "checkreadystatus", "/checkreadystatus");
makeObservable(ReactiveObservationClient.prototype, "stopserver", "/stopserver");
makeObservable(ReactiveObservationClient.prototype, "projectAdded", "projectAdded");
makeObservable(ReactiveObservationClient.prototype, "projectChanged", "projectChanged");
makeObservable(ReactiveObservationClient.prototype, "projectRemoved", "projectRemoved");
makeObservable(ReactiveObservationClient.prototype, "error", "error");
makeObservable(ReactiveObservationClient.prototype, "diagnostic", "diagnostic");
makeObservable(ReactiveObservationClient.prototype, "msBuildProjectDiagnostics", "msBuildProjectDiagnostics");
makeObservable(ReactiveObservationClient.prototype, "packageRestoreStarted", "packageRestoreStarted");
makeObservable(ReactiveObservationClient.prototype, "packageRestoreFinished", "packageRestoreFinished");
makeObservable(ReactiveObservationClient.prototype, "unresolvedDependencies", "unresolvedDependencies");

export interface ReactiveObservationClient {
    /*readonly*/ getteststartinfo: Observable<OmniSharp.Context<any, any>>;
    /*readonly*/ runtest: Observable<OmniSharp.Context<any, any>>;
    /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    /*readonly*/ changebuffer: Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    /*readonly*/ codecheck: Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
    /*readonly*/ codeformat: Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
    /*readonly*/ close: Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
    /*readonly*/ open: Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
    /*readonly*/ filesChanged: Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
    /*readonly*/ findimplementations: Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
    /*readonly*/ findsymbols: Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    /*readonly*/ findusages: Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    /*readonly*/ fixusings: Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    /*readonly*/ formatAfterKeystroke: Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
    /*readonly*/ formatRange: Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    /*readonly*/ getcodeactions: Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    /*readonly*/ gotodefinition: Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    /*readonly*/ gotofile: Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
    /*readonly*/ gotoregion: Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
    /*readonly*/ highlight: Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    /*readonly*/ currentfilemembersasflat: Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
    /*readonly*/ currentfilemembersastree: Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
    /*readonly*/ metadata: Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    /*readonly*/ navigatedown: Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
    /*readonly*/ navigateup: Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
    /*readonly*/ packagesearch: Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    /*readonly*/ packagesource: Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    /*readonly*/ packageversion: Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    /*readonly*/ rename: Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    /*readonly*/ runcodeaction: Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    /*readonly*/ signatureHelp: Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
    /*readonly*/ gettestcontext: Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    /*readonly*/ typelookup: Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    /*readonly*/ updatebuffer: Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    /*readonly*/ project: Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
    /*readonly*/ projects: Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    /*readonly*/ checkalivestatus: Observable<OmniSharp.Context<any, boolean>>;
    /*readonly*/ checkreadystatus: Observable<OmniSharp.Context<any, boolean>>;
    /*readonly*/ stopserver: Observable<OmniSharp.Context<any, boolean>>;
    /*readonly*/ projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
    /*readonly*/ projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
    /*readonly*/ projectRemoved: Observable<OmniSharp.Models.ProjectInformationResponse>;
    /*readonly*/ error: Observable<OmniSharp.Models.ErrorMessage>;
    /*readonly*/ diagnostic: Observable<OmniSharp.Models.DiagnosticMessage>;
    /*readonly*/ msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    /*readonly*/ packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
    /*readonly*/ packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
    /*readonly*/ unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    listen(path: "/v2/getteststartinfo"): Observable<OmniSharp.Context<any, any>>;
    listen(path: "/v2/runtest"): Observable<OmniSharp.Context<any, any>>;
    listen(path: "/autocomplete"): Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    listen(path: "/changebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    listen(path: "/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.CodeCheckRequest, OmniSharp.Models.QuickFixResponse>>;
    listen(path: "/codeformat"): Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
    listen(path: "/close"): Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
    listen(path: "/open"): Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
    listen(path: "/filesChanged"): Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
    listen(path: "/findimplementations"): Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
    listen(path: "/findsymbols"): Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    listen(path: "/findusages"): Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    listen(path: "/fixusings"): Observable<OmniSharp.Context<OmniSharp.Models.FixUsingsRequest, OmniSharp.Models.FixUsingsResponse>>;
    listen(path: "/formatAfterKeystroke"): Observable<OmniSharp.Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>;
    listen(path: "/formatRange"): Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    listen(path: "/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.GetCodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    listen(path: "/gotodefinition"): Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    listen(path: "/gotofile"): Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
    listen(path: "/gotoregion"): Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
    listen(path: "/highlight"): Observable<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>;
    listen(path: "/currentfilemembersasflat"): Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
    listen(path: "/currentfilemembersastree"): Observable<OmniSharp.Context<OmniSharp.Models.MembersTreeRequest, OmniSharp.Models.FileMemberTree>>;
    listen(path: "/metadata"): Observable<OmniSharp.Context<OmniSharp.Models.MetadataRequest, OmniSharp.Models.MetadataResponse>>;
    listen(path: "/navigatedown"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateDownRequest, OmniSharp.Models.NavigateResponse>>;
    listen(path: "/navigateup"): Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
    listen(path: "/packagesearch"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    listen(path: "/packagesource"): Observable<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>;
    listen(path: "/packageversion"): Observable<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>;
    listen(path: "/rename"): Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    listen(path: "/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.RunCodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    listen(path: "/signatureHelp"): Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
    listen(path: "/gettestcontext"): Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;
    listen(path: "/typelookup"): Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    listen(path: "/updatebuffer"): Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    listen(path: "/v2/codecheck"): Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
    listen(path: "/v2/getcodeactions"): Observable<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>;
    listen(path: "/v2/runcodeaction"): Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    listen(path: "/project"): Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
    listen(path: "/projects"): Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    listen(path: "/checkalivestatus"): Observable<OmniSharp.Context<any, boolean>>;
    listen(path: "/checkreadystatus"): Observable<OmniSharp.Context<any, boolean>>;
    listen(path: "/stopserver"): Observable<OmniSharp.Context<any, boolean>>;
    listen(path: "projectAdded"): Observable<OmniSharp.Models.ProjectInformationResponse>;
    listen(path: "projectChanged"): Observable<OmniSharp.Models.ProjectInformationResponse>;
    listen(path: "projectRemoved"): Observable<OmniSharp.Models.ProjectInformationResponse>;
    listen(path: "error"): Observable<OmniSharp.Models.ErrorMessage>;
    listen(path: "diagnostic"): Observable<OmniSharp.Models.DiagnosticMessage>;
    listen(path: "msBuildProjectDiagnostics"): Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    listen(path: "packageRestoreStarted"): Observable<OmniSharp.Models.PackageRestoreMessage>;
    listen(path: "packageRestoreFinished"): Observable<OmniSharp.Models.PackageRestoreMessage>;
    listen(path: "unresolvedDependencies"): Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;

}
