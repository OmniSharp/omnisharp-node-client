import * as _ from "lodash";
import {ChildProcess} from "child_process";
import {Observable, Disposable, CompositeDisposable, AsyncSubject} from "rx";
import {requestKey, observeKey, Message, ObservationMessage, ObservationRequest, ExecuteMethodRequestMessage, ExecuteMethodResponseMessage} from "./constants";

export class MessageHandlers implements Rx.IDisposable {
    private _disposable = new CompositeDisposable();
    private _requestHandlers = new Map<string, Set<(message: ExecuteMethodResponseMessage) => boolean>>();
    private _observeHandlers = new Map<string, Set<(message: ObservationMessage) => void>>();

    constructor(private _process: ChildProcess) {
        var handler = m => this._handle(m);
        this._process.on('message', handler);
        this._disposable.add(Disposable.create(() => {
            this._process.removeListener('message', handler);
        }));
    }

    public dispose() {
        this._disposable.dispose();
    }

    public request(clientId: string, methodName: string, handler: (result: any) => void, ...args: any[]) {
        if (!this._requestHandlers.has(clientId)) {
            this._requestHandlers.set(clientId, new Set<(message: ExecuteMethodResponseMessage) => boolean>());
        }
        var set = this._requestHandlers.get(clientId);

        set.add(({client, result, method}: ExecuteMethodResponseMessage) => {
            if (clientId === client && method === methodName) {
                handler(result);
                return true;
            }
            return false;
        });
        var message = <ExecuteMethodRequestMessage>{
            method: methodName,
            type: requestKey,
            client: clientId,
            args: args
        };
        this._process.send(message);
    }

    public addObserveHandler(clientId: string, eventName: string, handler: (result: any) => void) {
        if (!this._observeHandlers.has(clientId)) {
            this._observeHandlers.set(clientId, new Set<(message: ObservationMessage) => void>());
        }
        var set = this._observeHandlers.get(clientId);

        var method = ({event, result, client}: ObservationMessage) => {
            if (clientId === client && event === eventName) {
                handler(result);
                return true;
            }
            return false;
        };
        set.add(method);

        var message = <ObservationRequest>{
            event: eventName,
            type: observeKey,
            client: clientId
        };
        this._process.send(message);

        return Disposable.create(() => {
            set.delete(method);
            message.dispose = true;
            this._process.send(message);
        });
    }

    private _handle(m: Message) {
        if (m.type === requestKey) {
            this._handleRequest(m as ExecuteMethodResponseMessage);
        } else if (m.type === observeKey) {
            this._handleObserve(m as ObservationMessage);
        }
    }

    private _handleRequest(m: ExecuteMethodResponseMessage) {
        var handlers = this._requestHandlers.get(m.client);
        if (handlers) {
            var iterator = handlers.values();
            var it = iterator.next();
            while (!it.done) {
                if (it.value(m)) {
                    handlers.delete(it.value);
                    return;
                }
                it = iterator.next();
            }
        }
    }

    private _handleObserve(m: ObservationMessage) {
        var handlers = this._observeHandlers.get(m.client);
        if (handlers) {
            var iterator = handlers.values();
            var it = iterator.next();
            while (!it.done) {
                if (it.value(m)) {
                    return;
                }
                it = iterator.next();
            }
        }
    }
}

export class ClientProxyWrapper implements Rx.IDisposable {
    private _disposable = new CompositeDisposable();

    constructor(private _handlers: MessageHandlers, private _key: string, disposer: Rx.IDisposable) {
        this._disposable.add(disposer);
    }

    public get key() { return this._key; }

    public dispose() {
        this._disposable.dispose();
    }

    public request(methodName: string, returnResult: boolean, ...args: any[]) {
        if (returnResult) {
            var response = new AsyncSubject<any>();
            var handler = (result) => _.defer(() => {
                response.onNext(result);
                response.onCompleted();
            });

            this._handlers.request(this._key, methodName, handler, ...args);
            return response;
        } else {
            this._handlers.request(this._key, methodName, _.noop, ...args);
        }

    }

    public observe(eventName: string) {
        return Observable.create((observer) => {
            var handler = result => _.defer(() => {
                observer.onNext(result);
            });
            return this._handlers.addObserveHandler(this._key, eventName, handler);
        }).share();
    }
}
