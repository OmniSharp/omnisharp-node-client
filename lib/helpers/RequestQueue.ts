import { bind, pull } from 'lodash';
import { AsyncSubject, Observable } from 'rxjs';
import { ResponseContext } from '../contexts/ResponseContext';
import { isDeferredCommand, isPriorityCommand } from './prioritization';

export class RequestQueue {
    private queue: AsyncSubject<ResponseContext<any, any>>[] = [];
    private requests: AsyncSubject<ResponseContext<any, any>>[] = [];

    public constructor(private concurrency: number) { }

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
            const item = this.queue.shift()!;
            this.requests.push(item);
            item.subscribe({
                error: () => {
                    pull(this.requests, item);
                },
                complete: () => {
                    pull(this.requests, item);
                }
            });

            item.next(null!);
            item.complete();

            if (this.full) { return; }
        } while (this.queue.length && ++i < slots);
    }
}
