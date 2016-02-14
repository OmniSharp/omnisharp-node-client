import {Observable, Subscriber, Subscription} from "rxjs";
export function createObservable<T>(callback: (observer: Subscriber<T>) => Subscription | Function | void ): Observable<T> {
    return <Observable<T>>Observable.create(callback);
}
