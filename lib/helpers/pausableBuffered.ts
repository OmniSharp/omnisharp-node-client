import {Subscriber, Observable} from '@reactivex/rxjs';

export function pausableBuffered<T>(observable: Observable<T>, pauser: Observable<boolean>): Observable<T> {
    return this.lift(new PausableBufferedOperator(observable, pauser));
}

class PausableBufferedOperator<T> /*implements Operator<T, R>*/ {
    constructor(private self: Observable<T>, private pauser: Observable<boolean>) { }

    private call(subscriber: Subscriber<T>): Subscriber<T> {
        return new PausableBufferedSubscriber(subscriber, this.self, this.pauser);
    }
}

class PausableBufferedSubscriber<T> extends Subscriber<T> {
    private _queue: T[] = [];
    constructor(destination: Subscriber<T>, private _self: Observable<T>, private _pauser: Observable<boolean>) {
        super(destination);

        let previousShouldFire: boolean;
        destination.add(
            Observable.combineLatest(_self, _pauser)
                .subscribe(([data, shouldFire]) => {
                    if (previousShouldFire !== undefined && shouldFire !== previousShouldFire) {
                        previousShouldFire = shouldFire;
                        // change in shouldFire
                        if (shouldFire) { this._drainQueue(); }
                    } else {
                        previousShouldFire = shouldFire;
                        // new data
                        if (shouldFire) {
                            this._next(data);
                        } else {
                            this._queue.push(data);
                        }
                    }
                }, e => {
                    this._drainQueue();
                    this._error(e);
                }, () => {
                    this._drainQueue();
                    this._complete();
                })
        );
    }

    private _drainQueue() {
        while (this._queue.length > 0) {
            this.destination.next(this._queue.shift());
        }
    }
}
