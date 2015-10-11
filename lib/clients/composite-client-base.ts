import {ReplaySubject, Observable, CompositeDisposable, Disposable} from "rx";
import * as _ from 'lodash';
import {ClientBase} from "./client-base";
import {DriverState} from "../enums";
import {OmnisharpClientStatus} from "../interfaces";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";

export class ObservationClientBase<C extends ClientBase> implements OmniSharp.Events, Rx.IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    protected _clientsSubject = new ReplaySubject<C[]>(1);

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

    public status: Rx.Observable<OmnisharpClientStatus>;
    public requests: Rx.Observable<RequestContext<any>>;
    public responses: Rx.Observable<ResponseContext<any, any>>;
    public errors: Rx.Observable<CommandContext<any>>;

    constructor(private clients: C[] = []) {
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

        this.status = this.makeMergeObserable(client => client.status);
        this.requests = this.makeMergeObserable(client => client.requests);
        this.responses = this.makeMergeObserable(client => client.responses);
        this.errors = this.makeMergeObserable(client => client.errors);

        this.onNext();

        this._disposable.add(this._clientsSubject);
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeMergeObserable<T>(selector: (client: C) => Observable<T>) {
        return this._clientsSubject.flatMapLatest(clients => Observable.merge<T>(...clients.map(selector))).share();
    }

    public observe<T>(selector: (client: C) => Observable<T>) {
        return this.makeMergeObserable(selector);
    }

    private onNext = () => this._clientsSubject.onNext(this.clients.slice());

    public add(client: C) {
        this.clients.push(client);
        this.onNext();
        var d = Disposable.create(() => {
            _.pull(this.clients, client);
            this.onNext();
        });
        this._clientDisposable.add(d);
        return d;
    }
}

export class CombinationClientBase<C extends ClientBase> implements OmniSharp.Aggregate.Events, Rx.IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    public _clientsSubject = new ReplaySubject<C[]>(1);

    public projectAdded: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    public projectChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    public projectRemoved: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    public error: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
    public msBuildProjectDiagnostics: Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
    public packageRestoreStarted: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    public packageRestoreFinished: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    public unresolvedDependencies: Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;

    public state: Rx.Observable<OmniSharp.CombinationKey<DriverState>[]>;
    public status: Rx.Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]>;

    constructor(private clients: C[] = []) {
        this.projectAdded = this.makeCombineObserable(client => client.projectAdded);
        this.projectChanged = this.makeCombineObserable(client => client.projectChanged);
        this.projectRemoved = this.makeCombineObserable(client => client.projectRemoved);
        this.error = this.makeCombineObserable(client => client.error);
        this.msBuildProjectDiagnostics = this.makeCombineObserable(client => client.msBuildProjectDiagnostics);
        this.packageRestoreStarted = this.makeCombineObserable(client => client.packageRestoreStarted);
        this.packageRestoreFinished = this.makeCombineObserable(client => client.packageRestoreFinished);
        this.unresolvedDependencies = this.makeCombineObserable(client => client.unresolvedDependencies);

        this.state = this.makeCombineObserable(client => client.state);
        this.status = this.makeCombineObserable(client => client.status);

        this.onNext();

        this._disposable.add(this._clientsSubject);
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeCombineObserable<T>(selector: (client: C) => Observable<T>) {

        // Caches the value, so that when the underlying clients change
        // we can start with the old value of the remaining clients
        var cache: { [key: string]: T } = {};

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

    public observe<T>(selector: (client: C) => Observable<T>) {
        return this.makeCombineObserable(selector);
    }

    private onNext = () => this._clientsSubject.onNext(this.clients.slice());

    public add(client: C) {
        this.clients.push(client);
        this.onNext();
        var d = Disposable.create(() => {
            _.pull(this.clients, client);
            this.onNext();
        });
        this._clientDisposable.add(d);
        return d;
    }
}
