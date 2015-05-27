import {helpers as rxHelpers, Observable} from "rx";
import * as _ from 'lodash';
import {ServerClient} from "./server-client";
import {CompositeObservable, ICompositeObservable} from "../rx/CompositeObservable";
interface Context<TRequest, TResponse> extends OmniSharp.Context<TRequest, TResponse> { }

export interface CompositeObservable<T> extends ICompositeObservable<T> { }
export class CompositeClient<T extends ServerClient> implements OmniSharp.Events {
    constructor(clients?: T[]) {
        this.observeUpdatebuffer = CompositeObservable<Context<OmniSharp.Models.Request, any>>();
        this.observeChangebuffer = CompositeObservable<Context<OmniSharp.Models.Request, any>>();
        this.observeCodecheck = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>();
        this.observeFormatAfterKeystroke = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>();
        this.observeFormatRange = CompositeObservable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>();
        this.observeCodeformat = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>();
        this.observeAutocomplete = CompositeObservable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>();
        this.observeFindimplementations = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>();
        this.observeFindsymbols = CompositeObservable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>();
        this.observeFindusages = CompositeObservable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>();
        this.observeGotodefinition = CompositeObservable<Context<OmniSharp.Models.Request, any>>();
        this.observeGotofile = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>();
        this.observeGotoregion = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>();
        this.observeNavigateup = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>();
        this.observeNavigatedown = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>();
        this.observeRename = CompositeObservable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>();
        this.observeSignatureHelp = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>();
        this.observeCheckalivestatus = CompositeObservable<Context<any, boolean>>();
        this.observeCheckreadystatus = CompositeObservable<Context<any, boolean>>();
        this.observeCurrentfilemembersastree = CompositeObservable<Context<OmniSharp.Models.Request, any>>();
        this.observeCurrentfilemembersasflat = CompositeObservable<Context<OmniSharp.Models.Request, any>>();
        this.observeTypelookup = CompositeObservable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>();
        this.observeFilesChanged = CompositeObservable<Context<OmniSharp.Models.Request[], boolean>>();
        this.observeProjects = CompositeObservable<Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>();
        this.observeProject = CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>();
        this.observeGetcodeactions = CompositeObservable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>();
        this.observeRuncodeaction = CompositeObservable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>();
        this.observeGettestcontext = CompositeObservable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>();

        this.projectAdded = CompositeObservable<OmniSharp.Models.ProjectInformationResponse>();
        this.projectChanged = CompositeObservable<OmniSharp.Models.ProjectInformationResponse>();
        this.projectRemoved = CompositeObservable<OmniSharp.Models.ProjectInformationResponse>();
        this.error = CompositeObservable<OmniSharp.Models.ErrorMessage>();
        this.msBuildProjectDiagnostics = CompositeObservable<OmniSharp.Models.MSBuildProjectDiagnostics>();
        this.packageRestoreStarted = CompositeObservable<OmniSharp.Models.PackageRestoreMessage>();
        this.packageRestoreFinished = CompositeObservable<OmniSharp.Models.PackageRestoreMessage>();
        this.unresolvedDependencies = CompositeObservable<OmniSharp.Models.UnresolvedDependenciesMessage>();

        _.each(clients, client => this.addObserversForClient(client));
    }

    public add(client: T) {
        this.addObserversForClient(client);
    }

    public remove(client: T) {
        this.removeObserversForClient(client);
    }

    public removeAll() {
        _.each(_.keys(this), key => this[key].removeAll && this[key].removeAll());
    }

    private addObserversForClient(client: T) {
        _.each(_.keys(client), key => this[key] && this[key].add(client[key]));
    }

    private removeObserversForClient(client: T) {
        _.each(_.keys(client), key => this[key] && this[key].remove(client[key]));
    }

    public observeUpdatebuffer: CompositeObservable<Context<OmniSharp.Models.Request, any>>;
    public observeChangebuffer: CompositeObservable<Context<OmniSharp.Models.Request, any>>;
    public observeCodecheck: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFormatAfterKeystroke: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    public observeFormatRange: CompositeObservable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    public observeCodeformat: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    public observeAutocomplete: CompositeObservable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    public observeFindimplementations: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFindsymbols: CompositeObservable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeFindusages: CompositeObservable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeGotodefinition: CompositeObservable<Context<OmniSharp.Models.Request, any>>;
    public observeGotofile: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeGotoregion: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeNavigateup: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeNavigatedown: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeRename: CompositeObservable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    public observeSignatureHelp: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    public observeCheckalivestatus: CompositeObservable<Context<any, boolean>>;
    public observeCheckreadystatus: CompositeObservable<Context<any, boolean>>;
    public observeCurrentfilemembersastree: CompositeObservable<Context<OmniSharp.Models.Request, any>>;
    public observeCurrentfilemembersasflat: CompositeObservable<Context<OmniSharp.Models.Request, any>>;
    public observeTypelookup: CompositeObservable<Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    public observeFilesChanged: CompositeObservable<Context<OmniSharp.Models.Request[], boolean>>;
    public observeProjects: CompositeObservable<Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>;
    public observeProject: CompositeObservable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    public observeGetcodeactions: CompositeObservable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    public observeRuncodeaction: CompositeObservable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    public observeGettestcontext: CompositeObservable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;

    public projectAdded: CompositeObservable<OmniSharp.Models.ProjectInformationResponse>;
    public projectChanged: CompositeObservable<OmniSharp.Models.ProjectInformationResponse>;
    public projectRemoved: CompositeObservable<OmniSharp.Models.ProjectInformationResponse>;
    public error: CompositeObservable<OmniSharp.Models.ErrorMessage>;
    public msBuildProjectDiagnostics: CompositeObservable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    public packageRestoreStarted: CompositeObservable<OmniSharp.Models.PackageRestoreMessage>;
    public packageRestoreFinished: CompositeObservable<OmniSharp.Models.PackageRestoreMessage>;
    public unresolvedDependencies: CompositeObservable<OmniSharp.Models.UnresolvedDependenciesMessage>;
}
