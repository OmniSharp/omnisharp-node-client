import {ReplaySubject, Observable} from "rxjs";
import {CompositeDisposable, Disposable, IDisposable} from "../disposables";
import _ from "lodash";
import {ReactiveClient} from "./reactive-client-base";
import {setMergeOrAggregate, getInternalKey} from "../helpers/decorators";

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
