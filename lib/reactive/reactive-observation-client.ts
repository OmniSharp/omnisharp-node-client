import {ReplaySubject, Observable} from "rxjs";
import {CompositeDisposable, Disposable, IDisposable} from "../disposables";
import _ from "lodash";
import {ReactiveClient} from "./reactive-client-base";

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

    protected makeMergeObserable = <T>(selector: (client: TClient) => Observable<T>) => {
        return this._clientsSubject.switchMap(clients => Observable.merge<T>(...clients.map(selector))).share();
    };

    public observe<T>(selector: (client: TClient) => Observable<T>) {
        return this.makeMergeObserable(selector);
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
