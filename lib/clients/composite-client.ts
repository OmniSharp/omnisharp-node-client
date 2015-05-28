import {ReplaySubject, Observable} from "rx";
import * as _ from 'lodash';
import {ServerClient} from "./server-client";
import {DriverState} from "../enums";


export class ObservationClient<T extends ServerClient> implements OmniSharp.Events {
    public _clientsSubject = new ReplaySubject<ServerClient[]>(1);

    constructor(private clients: T[] = []) {

        this.observeUpdatebuffer = this.makeMergeObserable(client => client.observeUpdatebuffer);
        this.observeChangebuffer = this.makeMergeObserable(client => client.observeChangebuffer);
        this.observeCodecheck = this.makeMergeObserable(client => client.observeCodecheck);
        this.observeFormatAfterKeystroke = this.makeMergeObserable(client => client.observeFormatAfterKeystroke);
        this.observeFormatRange = this.makeMergeObserable(client => client.observeFormatRange);
        this.observeCodeformat = this.makeMergeObserable(client => client.observeCodeformat);
        this.observeAutocomplete = this.makeMergeObserable(client => client.observeAutocomplete);
        this.observeFindimplementations = this.makeMergeObserable(client => client.observeFindimplementations);
        this.observeFindsymbols = this.makeMergeObserable(client => client.observeFindsymbols);
        this.observeFindusages = this.makeMergeObserable(client => client.observeFindusages);
        this.observeGotodefinition = this.makeMergeObserable(client => client.observeGotodefinition);
        this.observeGotofile = this.makeMergeObserable(client => client.observeGotofile);
        this.observeGotoregion = this.makeMergeObserable(client => client.observeGotoregion);
        this.observeNavigateup = this.makeMergeObserable(client => client.observeNavigateup);
        this.observeNavigatedown = this.makeMergeObserable(client => client.observeNavigatedown);
        this.observeRename = this.makeMergeObserable(client => client.observeRename);
        this.observeSignatureHelp = this.makeMergeObserable(client => client.observeSignatureHelp);
        this.observeCheckalivestatus = this.makeMergeObserable(client => client.observeCheckalivestatus);
        this.observeCheckreadystatus = this.makeMergeObserable(client => client.observeCheckreadystatus);
        this.observeCurrentfilemembersastree = this.makeMergeObserable(client => client.observeCurrentfilemembersastree);
        this.observeCurrentfilemembersasflat = this.makeMergeObserable(client => client.observeCurrentfilemembersasflat);
        this.observeTypelookup = this.makeMergeObserable(client => client.observeTypelookup);
        this.observeFilesChanged = this.makeMergeObserable(client => client.observeFilesChanged);
        this.observeProjects = this.makeMergeObserable(client => client.observeProjects);
        this.observeProject = this.makeMergeObserable(client => client.observeProject);
        this.observeGetcodeactions = this.makeMergeObserable(client => client.observeGetcodeactions);
        this.observeRuncodeaction = this.makeMergeObserable(client => client.observeRuncodeaction);
        this.observeGettestcontext = this.makeMergeObserable(client => client.observeGettestcontext);

        this.projectAdded = this.makeMergeObserable(client => client.projectAdded);
        this.projectChanged = this.makeMergeObserable(client => client.projectChanged);
        this.projectRemoved = this.makeMergeObserable(client => client.projectRemoved);
        this.error = this.makeMergeObserable(client => client.error);
        this.msBuildProjectDiagnostics = this.makeMergeObserable(client => client.msBuildProjectDiagnostics);
        this.packageRestoreStarted = this.makeMergeObserable(client => client.packageRestoreStarted);
        this.packageRestoreFinished = this.makeMergeObserable(client => client.packageRestoreFinished);
        this.unresolvedDependencies = this.makeMergeObserable(client => client.unresolvedDependencies);

        this.events = this.makeMergeObserable(client => client.events);
        this.commands = this.makeMergeObserable(client => client.commands);
        this.state = this.makeMergeObserable(client => client.state);

        this.onNext();
    }

    protected makeMergeObserable<T>(selector: (client: ServerClient) => Observable<T>) {
        return this._clientsSubject.flatMapLatest(clients => Observable.merge<T>(...clients.map(selector))).share();
    }

    public observe<T>(selector: (client: ServerClient) => Observable<T>) {
        return this.makeMergeObserable(selector);
    }

    private onNext = () => this._clientsSubject.onNext(this.clients.slice());

    public add(client: T) {
        this.clients.push(client);
        this.onNext();
    }

    public remove(client: T) {
        _.pull(this.clients, client);
        this.onNext();
    }

    public removeAll() {
        this.clients = [];
        this.onNext();
    }

    public observeUpdatebuffer: Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeChangebuffer: Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeCodecheck: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFormatAfterKeystroke: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>;
    public observeFormatRange: Observable<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>;
    public observeCodeformat: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>;
    public observeAutocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    public observeFindimplementations: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeFindsymbols: Observable<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeFindusages: Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    public observeGotodefinition: Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeGotofile: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeGotoregion: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>;
    public observeNavigateup: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeNavigatedown: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>;
    public observeRename: Observable<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>;
    public observeSignatureHelp: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>;
    public observeCheckalivestatus: Observable<OmniSharp.Context<any, boolean>>;
    public observeCheckreadystatus: Observable<OmniSharp.Context<any, boolean>>;
    public observeCurrentfilemembersastree: Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeCurrentfilemembersasflat: Observable<OmniSharp.Context<OmniSharp.Models.Request, any>>;
    public observeTypelookup: Observable<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>;
    public observeFilesChanged: Observable<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>;
    public observeProjects: Observable<OmniSharp.Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>;
    public observeProject: Observable<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>;
    public observeGetcodeactions: Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>;
    public observeRuncodeaction: Observable<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>;
    public observeGettestcontext: Observable<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>;

    public projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
    public projectRemoved: Observable<OmniSharp.Models.ProjectInformationResponse>;
    public error: Observable<OmniSharp.Models.ErrorMessage>;
    public msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    public packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
    public packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
    public unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;

    public events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    public commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    public state: Rx.Observable<DriverState>;

}

interface CombinationKey<T> {
    key: string;
    value: T;
}

export class CombinationClient<T extends ServerClient> {
    public _clientsSubject = new ReplaySubject<ServerClient[]>(1);

    constructor(private clients: T[] = []) {

        this.observeUpdatebuffer = this.makeCombineObserable(client => client.observeUpdatebuffer);
        this.observeChangebuffer = this.makeCombineObserable(client => client.observeChangebuffer);
        this.observeCodecheck = this.makeCombineObserable(client => client.observeCodecheck);
        this.observeFormatAfterKeystroke = this.makeCombineObserable(client => client.observeFormatAfterKeystroke);
        this.observeFormatRange = this.makeCombineObserable(client => client.observeFormatRange);
        this.observeCodeformat = this.makeCombineObserable(client => client.observeCodeformat);
        this.observeAutocomplete = this.makeCombineObserable(client => client.observeAutocomplete);
        this.observeFindimplementations = this.makeCombineObserable(client => client.observeFindimplementations);
        this.observeFindsymbols = this.makeCombineObserable(client => client.observeFindsymbols);
        this.observeFindusages = this.makeCombineObserable(client => client.observeFindusages);
        this.observeGotodefinition = this.makeCombineObserable(client => client.observeGotodefinition);
        this.observeGotofile = this.makeCombineObserable(client => client.observeGotofile);
        this.observeGotoregion = this.makeCombineObserable(client => client.observeGotoregion);
        this.observeNavigateup = this.makeCombineObserable(client => client.observeNavigateup);
        this.observeNavigatedown = this.makeCombineObserable(client => client.observeNavigatedown);
        this.observeRename = this.makeCombineObserable(client => client.observeRename);
        this.observeSignatureHelp = this.makeCombineObserable(client => client.observeSignatureHelp);
        this.observeCheckalivestatus = this.makeCombineObserable(client => client.observeCheckalivestatus);
        this.observeCheckreadystatus = this.makeCombineObserable(client => client.observeCheckreadystatus);
        this.observeCurrentfilemembersastree = this.makeCombineObserable(client => client.observeCurrentfilemembersastree);
        this.observeCurrentfilemembersasflat = this.makeCombineObserable(client => client.observeCurrentfilemembersasflat);
        this.observeTypelookup = this.makeCombineObserable(client => client.observeTypelookup);
        this.observeFilesChanged = this.makeCombineObserable(client => client.observeFilesChanged);
        this.observeProjects = this.makeCombineObserable(client => client.observeProjects);
        this.observeProject = this.makeCombineObserable(client => client.observeProject);
        this.observeGetcodeactions = this.makeCombineObserable(client => client.observeGetcodeactions);
        this.observeRuncodeaction = this.makeCombineObserable(client => client.observeRuncodeaction);
        this.observeGettestcontext = this.makeCombineObserable(client => client.observeGettestcontext);

        this.projectAdded = this.makeCombineObserable(client => client.projectAdded);
        this.projectChanged = this.makeCombineObserable(client => client.projectChanged);
        this.projectRemoved = this.makeCombineObserable(client => client.projectRemoved);
        this.error = this.makeCombineObserable(client => client.error);
        this.msBuildProjectDiagnostics = this.makeCombineObserable(client => client.msBuildProjectDiagnostics);
        this.packageRestoreStarted = this.makeCombineObserable(client => client.packageRestoreStarted);
        this.packageRestoreFinished = this.makeCombineObserable(client => client.packageRestoreFinished);
        this.unresolvedDependencies = this.makeCombineObserable(client => client.unresolvedDependencies);

        this.events = this.makeCombineObserable(client => client.events);
        this.commands = this.makeCombineObserable(client => client.commands);
        this.state = this.makeCombineObserable(client => client.state);

        this.onNext();
    }

    protected makeCombineObserable<T>(selector: (client: ServerClient) => Observable<T>) {

        // Caches the value, so that when the underlying clients change
        // we can start with the old value of the remaining clients
        var cache : { [key: string]: T } = {};

        return this._clientsSubject.flatMapLatest(clients => {
            // clean up after ourselves.
            var removal = _.difference(_.keys(cache), clients.map(z => z.uniqueId));
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
            )
        }).share();
    }

    public observe<T>(selector: (client: ServerClient) => Observable<T>) {
        return this.makeCombineObserable(selector);
    }

    private onNext = () => this._clientsSubject.onNext(this.clients.slice());

    public add(client: T) {
        this.clients.push(client);
        this.onNext();
    }

    public remove(client: T) {
        _.pull(this.clients, client);
        this.onNext();
    }

    public removeAll() {
        this.clients = [];
        this.onNext();
    }

    public observeUpdatebuffer: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, any>>[]>;
    public observeChangebuffer: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, any>>[]>;
    public observeCodecheck: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeFormatAfterKeystroke: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>[]>;
    public observeFormatRange: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    public observeCodeformat: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
    public observeAutocomplete: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    public observeFindimplementations: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeFindsymbols: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeFindusages: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeGotodefinition: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, any>>[]>;
    public observeGotofile: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeGotoregion: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeNavigateup: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    public observeNavigatedown: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    public observeRename: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    public observeSignatureHelp: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
    public observeCheckalivestatus: Observable<CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    public observeCheckreadystatus: Observable<CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    public observeCurrentfilemembersastree: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, any>>[]>;
    public observeCurrentfilemembersasflat: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, any>>[]>;
    public observeTypelookup: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    public observeFilesChanged: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>[]>;
    public observeProjects: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.WorkspaceInformationResponse, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    public observeProject: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
    public observeGetcodeactions: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>[]>;
    public observeRuncodeaction: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>[]>;
    public observeGettestcontext: Observable<CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;

    public projectAdded: Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    public projectChanged: Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    public projectRemoved: Observable<CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    public error: Observable<CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
    public msBuildProjectDiagnostics: Observable<CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
    public packageRestoreStarted: Observable<CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    public packageRestoreFinished: Observable<CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    public unresolvedDependencies: Observable<CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;

    public events: Rx.Observable<CombinationKey<OmniSharp.Stdio.Protocol.EventPacket>[]>;
    public commands: Rx.Observable<CombinationKey<OmniSharp.Stdio.Protocol.ResponsePacket>[]>;
    public state: Rx.Observable<CombinationKey<DriverState>[]>;

}
