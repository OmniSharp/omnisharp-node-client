import {Subscriber, Observable, Operator} from "rxjs";
import "rxjs/add/operator/pairwise";

export function prioritizeBuffered<T>(pauser: Observable<boolean>): Observable<T> {
    return (<any>this).lift(new PausableBufferedOperator(this, pauser));
}

Observable.prototype.prioritizeBuffered = prioritizeBuffered;

export interface PausableBufferedSignature<T> {
    (pauser: Observable<boolean>): Observable<T>;
}

declare module "rxjs/Observable" {
  interface Observable<T> {
    prioritizeBuffered: PausableBufferedSignature<T>;
  }
}

class PausableBufferedOperator<T> implements Operator<T, T> {
    constructor(private self: Observable<T>, private pauser: Observable<boolean>) { }
    public call(subscriber: Subscriber<T>): Subscriber<T> {
        return new PausableBufferedSubscriber(subscriber, this.self, this.pauser);
    }
}

class PausableBufferedSubscriber<T> extends Subscriber<T> {
    private _queue: T[] = [];
    constructor(destination: Subscriber<T>, private _self: Observable<T>, private _pauser: Observable<boolean>) {
        super(destination);

        destination.add(
            Observable.combineLatest(_self, _pauser.startWith(undefined).pairwise(), (data, sf) => <[T, boolean, boolean]>[data, sf[0], sf[1]])
                .subscribe(([data, previousShouldFire, shouldFire]) => {
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
