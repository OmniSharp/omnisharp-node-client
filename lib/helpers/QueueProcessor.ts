import { bind, defer, pull } from 'lodash';
import { AsyncSubject, Observable } from 'rxjs';
import { RequestContext } from '../contexts/RequestContext';
import { ResponseContext } from '../contexts/ResponseContext';
import { RequestQueue } from './RequestQueue';
import { isDeferredCommand, isPriorityCommand } from './prioritization';

enum QueuePriority {
    Priority,
    Normal,
    Deferred,
}

function getQueue(context: RequestContext<any>) {
    if (isPriorityCommand(context)) {
        return QueuePriority.Priority;
    }
    if (isDeferredCommand(context)) {
        return QueuePriority.Deferred;
    }
    return QueuePriority.Normal;
}

type DELAYED_OBSERVABLE = Observable<ResponseContext<any, any>>;

export class QueueProcessor<TResponse> {
    private _priority: RequestQueue;
    private _normal: RequestQueue;
    private _deferred: RequestQueue;
    private _processing = false;

    public constructor(private _concurrency: number, private _requestCallback: (context: RequestContext<any>) => TResponse) {
        // Keep deferred concurrency at a min of two, this lets us get around long running requests jamming the pipes.
        const _deferredConcurrency = Math.max(Math.floor(_concurrency / 4), 2);
        this._priority = new RequestQueue(1);
        this._normal = new RequestQueue(_concurrency);
        this._deferred = new RequestQueue(_deferredConcurrency);
    }

    public enqueue(context: RequestContext<any>): TResponse {
        const subject = new AsyncSubject<ResponseContext<any, any>>();
        const observable = subject
            .asObservable()
            .do({ error: this._complete, complete: this._complete })
            .mergeMap(x => <any>this._requestCallback(context));

        // Doing a little bit of tickery here
        // Going to return this Observable, as if it were promise like.
        // And we will only commit to the promise once someone calls then on it.
        // This way another client, can cast the result to an observable, and gain cancelation
        const promiseLike: PromiseLike<ResponseContext<any, any>> = <any>observable;
        promiseLike.then = <any>((fulfilled: Function, rejected: Function) => {
            return observable.toPromise().then(<any>fulfilled, <any>rejected);
        });

        const queue = getQueue(context);
        if (queue === QueuePriority.Priority) { this._priority.enqueue(subject); }
        if (queue === QueuePriority.Normal) { this._normal.enqueue(subject); }
        if (queue === QueuePriority.Deferred) { this._deferred.enqueue(subject); }

        defer(() => this._drain());

        return <any>observable;
    }

    private _drain() {
        if (this._processing) { return; }
        // Request inflight
        if (this._priority.full) { return; }
        if (this._normal.full && this._deferred.full) { return; }

        this._processing = true;

        if (this._priority.pending) {
            this._priority.drain();
            return;
        }

        if (this._normal.pending) {
            this._normal.drain();
        }

        if (this._deferred.pending) {
            this._deferred.drain();
        }
    }

    private _complete = () => {
        this._processing = false;
        this._drain();
    }
}
