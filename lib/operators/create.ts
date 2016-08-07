import { Observable, Subscriber, Subscription } from 'rxjs';
export const createObservable: <T>(callback: (observer: Subscriber<T>) => Subscription | Function | void) => Observable<T> = <any>Observable.create;
