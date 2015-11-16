import {OmniSharp} from "../../omnisharp-server.d.ts";
import {ReplaySubject, Observable} from "@reactivex/rxjs";
import {IDisposable, Disposable, CompositeDisposable}  from "../helpers/Disposable";
import * as _ from "lodash";
import {DriverState} from "../enums";
import {OmnisharpClientStatus} from "../interfaces";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import {merge, aggregate} from "../decorators";

export class ObservationClientBase<Client> implements OmniSharp.Events, IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    protected _clientsSubject = new ReplaySubject<Client[]>(1);

    @merge public get projectAdded(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @merge public get projectChanged(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @merge public get projectRemoved(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @merge public get error(): Observable<OmniSharp.Models.ErrorMessage> { throw new Error("Implemented by decorator"); }
    @merge public get msBuildProjectDiagnostics(): Observable<OmniSharp.Models.MSBuildProjectDiagnostics> { throw new Error("Implemented by decorator"); }
    @merge public get packageRestoreStarted(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @merge public get packageRestoreFinished(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @merge public get unresolvedDependencies(): Observable<OmniSharp.Models.UnresolvedDependenciesMessage> { throw new Error("Implemented by decorator"); }

    @merge public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { throw new Error("Implemented by decorator"); }
    @merge public get commands(): Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { throw new Error("Implemented by decorator"); }
    @merge public get state(): Observable<DriverState> { throw new Error("Implemented by decorator"); }
    @merge public get status(): Observable<OmnisharpClientStatus> { throw new Error("Implemented by decorator"); }
    @merge public get requests(): Observable<RequestContext<any>> { throw new Error("Implemented by decorator"); }
    @merge public get responses(): Observable<ResponseContext<any, any>> { throw new Error("Implemented by decorator"); }
    @merge public get errors(): Observable<CommandContext<any>> { throw new Error("Implemented by decorator"); }

    constructor(private clients: Client[] = []) {
        this.next();

        this._disposable.add(this._clientsSubject);
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeMergeObserable = _.memoize(<T>(selector: (client: Client) => Observable<T>) => {
        return this._clientsSubject.switchMap(clients => Observable.merge(...clients.map(selector))).share();
    });

    public observe<T>(selector: (client: Client) => Observable<T>) {
        return this.makeMergeObserable(selector);
    }

    private next = () => this._clientsSubject.next(this.clients.slice());

    public add(client: Client) {
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

export class CombinationClientBase<Client> implements OmniSharp.Aggregate.Events, IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    public _clientsSubject = new ReplaySubject<Client[]>(1);

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

    constructor(private clients: Client[] = []) {
        this.next();

        this._disposable.add(this._clientsSubject);
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeAggregateObserable = _.memoize(<T>(selector: (client: Client) => Observable<T>) => {

        // Caches the value, so that when the underlying clients change
        // we can start with the old value of the remaining clients
        const cache: { [key: string]: T } = {};

        /* tslint:disable:no-string-literal */
        return this._clientsSubject.switchMap(clients => {
            // clean up after ourselves.
            const removal = _.difference(_.keys(cache), clients.map(z => z["uniqueId"]));
            _.each(removal, z => delete cache[z]);

            return Observable.combineLatest(
                ...clients.map(z => selector(z).startWith(cache[z["uniqueId"]])),
                (...values: T[]) =>
                    values.map((value, index) => {
                        cache[clients[index]["uniqueId"]] = value;

                        return {
                            key: clients[index]["uniqueId"],
                            value: value
                        };
                    })
            );
        }).share();
        /* tslint:enable:no-string-literal */
    });

    public observe<T>(selector: (client: Client) => Observable<T>) {
        return this.makeAggregateObserable(selector);
    }

    private next = () => this._clientsSubject.next(this.clients.slice());

    public add(client: Client) {
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
