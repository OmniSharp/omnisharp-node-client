import * as _ from "lodash";
import {Observable, Disposable, CompositeDisposable} from "rx";
import {OmnisharpClientOptions} from "../interfaces";
import {ClientBase} from "../clients/client-base";
import {ClientV1} from "../clients/client-v1";
import {ClientV2} from "../clients/client-v2";
import {requestKey, observeKey, clientKey, Message, ClientRequest, ObservationMessage, ObservationRequest, ExecuteMethodRequestMessage, ExecuteMethodResponseMessage} from "./constants";

export class ProxyServer {
    private _disposable = new CompositeDisposable();
    private _clients = new Map<string, ClientV1 | ClientV2>();
    private _observers = new Map<string, Map<string, Rx.IDisposable>>();

    public handleClientRequest({client, version, dispose, options}: ClientRequest) {
        if (dispose) {
            if (!this._clients.has(client)) return;
            var instance = this._clients.get(client);
            instance.dispose();
        } else {
            if (this._clients.has(client)) return;

            var instance: ClientV1 | ClientV2;
            if (version == 1) {
                instance = new ClientV1(options);
            } else if (version == 2) {
                instance = new ClientV2(options);
            }

            this._clients.set(client, instance);
        }
    }

    public handleMethodRequest({method, args, type, client}: ExecuteMethodRequestMessage) {
        var instance = this._clients.get(client);
        var ret = instance[method](...args);
        if (ret) {
            ret.take(1).subscribe(result => {
                var message = <ExecuteMethodResponseMessage>{ client, type, method, result };
                process.send(message);
            });
        };
    }

    public handleObserveRequest({event, type, client, dispose}: ObservationRequest) {
        var instance = this._clients.get(client);
        if (!this._observers.has(client)) {
            this._observers.set(client, new Map<string, Rx.IDisposable>());
        }
        var map = this._observers.get(client);

        if (dispose) {
            var disposer = map.get(event);
            if (disposer) {
                disposer.dispose();
                map.delete(event);
            }
        } else {
            map.set(event, instance[event].subscribe(result => {
                var message = <ObservationMessage>{ event, type, result, client };
                process.send(message);
            }));
        }
    }
}

var server = new ProxyServer();

process.on('message', function(message: Message) {
    if (message.type === requestKey) {
        server.handleMethodRequest(message as ExecuteMethodRequestMessage);
    } else if (message.type === observeKey) {
        server.handleObserveRequest(message as ObservationRequest);
    } else if (message.type === clientKey) {
        server.handleClientRequest(message as ClientRequest);
    }
});

process.stdin.resume();
