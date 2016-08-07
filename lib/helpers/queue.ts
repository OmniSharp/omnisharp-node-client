import { isPriorityCommand, isNormalCommand, isDeferredCommand } from './prioritization';
import { RequestContext, ResponseContext } from '../contexts';
import { Observable, AsyncSubject } from 'rxjs';
import { pull, bind } from 'lodash';

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

class RequestQueue {
    private queue: AsyncSubject<ResponseContext<any, any>>[] = [];
    private requests: AsyncSubject<ResponseContext<any, any>>[] = [];

    constructor(private concurrency: number, private complete: () => void) { }

    public enqueue(item: AsyncSubject<ResponseContext<any, any>>) {
        this.queue.push(item);
    }

    public get full() {
        return this.requests.length >= this.concurrency;
    }

    public get pending() {
        return this.queue.length > 0;
    }

    public drain() {
        let i = 0;
        const slots = this.concurrency - this.requests.length;
        do {
            const item = this.queue.shift() !;
            this.requests.push(item);
            item.subscribe({
                complete: () => {
                    pull(this.requests, item);
                    this.complete();
                }
            });

            item.next(null!);
            item.complete();

            if (this.full) return;
        } while (this.queue.length && ++i < slots);
    }
}

type DELAYED_OBSERVABLE = Observable<ResponseContext<any, any>>;

export class Queue<TResponse> {
    private _priority: RequestQueue;
    private _normal: RequestQueue;
    private _deferred: RequestQueue;
    private _processing = false;

    constructor(private _concurrency: number, private _requestCallback: (context: RequestContext<any>) => TResponse) {
        // Keep deferred concurrency at a min of two, this lets us get around long running requests jamming the pipes.
        const _deferredConcurrency = Math.max(Math.floor(_concurrency / 4), 2);
        const complete = bind(this._complete, this);
        this._priority = new RequestQueue(1, complete);
        this._normal = new RequestQueue(_concurrency, complete);
        this._deferred = new RequestQueue(_deferredConcurrency, complete);
    }

    public enqueue(context: RequestContext<any>): TResponse {
        const subject = new AsyncSubject<ResponseContext<any, any>>();
        const observable = subject
            .asObservable()
            .mergeMap<ResponseContext<any, any>>(x => <any>this._requestCallback(context));

        // Doing a little bit of tickery here
        // Going to return this Observable, as if it were promise like.
        // And we will only commit to the promise once someone calls then on it.
        // This way another client, can cast the result to an observable, and gain cancelation
        const promiseLike: PromiseLike<ResponseContext<any, any>> = <any>observable;
        promiseLike.then = <any>((fulfilled: Function, rejected: Function) => {
            return observable.toPromise().then(<any>fulfilled, <any>rejected);
        });

        const queue = getQueue(context);
        if (queue === QueuePriority.Priority) this._priority.enqueue(subject);
        if (queue === QueuePriority.Normal) this._normal.enqueue(subject);
        if (queue === QueuePriority.Deferred) this._deferred.enqueue(subject);

        this.drain();

        return <any>observable;
    }

    private drain() {
        if (this._processing) return;
        // Request inflight
        if (this._priority.full) return;
        if (this._normal.full && this._deferred.full) return;

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

    private _complete() {
        this._processing = false;
        this.drain();
    }
}
