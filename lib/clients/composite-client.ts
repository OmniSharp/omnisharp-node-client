import {helpers as rxHelpers, Observable} from "rx";
import * as _ from 'lodash';
import {ServerClient} from "./server-client";
import {CompositeObservable, ICompositeObservable} from "../rx/CompositeObservable";
interface Context<TRequest, TResponse> extends OmniSharp.Context<TRequest, TResponse> {}

export class CompositeClient implements OmniSharp.Events {
    static clientKeys = _.keys(ServerClient.prototype);
    private _keys: string[];
    private _clients: ServerClient[] = [];

    constructor(clients?: ServerClient[]) {
        _.each(clients, client => this.addObserversForClient(client));
    }

    public add(client: ServerClient) {
        this.addObserversForClient(client);
    }

    public remove(client: ServerClient) {
        this.removeObserversForClient(client);
    }

    private setupKeys(client: ServerClient) {
        _.each(client, (value: any, key) => {
            if (value.subscribe && _.contains(CompositeClient.clientKeys, key)) { // assume its an observable
                this._keys.push(key)
                this[key] = CompositeObservable();
            }
        });
    }

    private addObserversForClient(client: ServerClient) {
        if (!this._keys || !this._keys.length) { this.setupKeys(client); }

        _(this._keys).each(key => this[key].add(client[key]));
        this._clients.push(client);
    }

    private removeObserversForClient(client: ServerClient) {
        if (!this._keys || !this._keys.length) { this.setupKeys(client); }

        _(this._keys).each(key => this[key].remove(client[key]));
        _.pull(this._clients, client);
    }

    public observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
    public observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
    public observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    public observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    public observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    public observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    public observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
    public observeGotofile: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeGotoregion: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    public observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    public observeCheckalivestatus: Rx.Observable<Context<any, boolean>>;
    public observeCheckreadystatus: Rx.Observable<Context<any, boolean>>;
    public observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
    public observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, any>>;
    public observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    public observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>;
    public observeProjects: Rx.Observable<Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>;
    public observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    public observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    public observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    public observeGettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;

    public projectAdded: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectChanged: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectRemoved: Rx.Observable<OmniSharp.Models.ProjectInformationResponse>;
    public error: Rx.Observable<OmniSharp.Models.ErrorMessage>;
    public msBuildProjectDiagnostics: Rx.Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    public packageRestoreStarted: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    public packageRestoreFinished: Rx.Observable<OmniSharp.Models.PackageRestoreMessage>;
    public unresolvedDependencies: Rx.Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
}
