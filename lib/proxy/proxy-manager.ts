// So we need to be able to load workers, by path?
// Load those workers into the overall context (Omni like?)
import * as _ from "lodash";
import {Observable, Disposable, CompositeDisposable} from "rx";
import {ProxyClientV1} from "./proxy-client-v1";
import {ProxyClientV2} from "./proxy-client-v2";
import {ProxyClientBase} from "./proxy-client-base";
import {OmnisharpClientOptions} from "../interfaces";
import {ChildProcess, spawn, fork} from "child_process";
import {join} from "path";
import {ClientProxyWrapper, MessageHandlers} from "./client-proxy-wrapper";
import {clientKey, ClientRequest} from "./constants";

// Setup the new process env.
if (process.platform === 'win32') {
    var env: any = { ATOM_SHELL_INTERNAL_RUN_AS_NODE: '1' };
} else {
    var env: any = _.defaults({ ATOM_SHELL_INTERNAL_RUN_AS_NODE: '1' }, process.env);
}

export class ProxyManager implements Rx.IDisposable {
    private _disposable = new CompositeDisposable();
    private _proxies = new Map<string, ProxyClientV1 | ProxyClientV2>();
    private _proxyDisposables = new Map<string, Disposable>();
    private _process: ChildProcess;
    private _handlers: MessageHandlers;

    constructor() {
        // Spawn a special windows only node client... so that we can shutdown nicely.
        var serverArguments: any[] = [join(__dirname, "proxy-server.js")];
        this._process = fork(join(__dirname, "proxy-server.js"));
        this._handlers = new MessageHandlers(this._process);

        this._disposable.add(this._handlers);

        this._disposable.add(Disposable.create(() => {
            if (this._process) {
                this._process.kill();
                this._process = null;
            }
            this._proxies.clear();
            this._proxyDisposables.clear();
        }));
    }

    public dispose() {
        this._disposable.dispose();
    }

    public getClientV1(options: OmnisharpClientOptions) {
        return this._getClient(ProxyClientV1, 1, options) as ProxyClientV1;
    }

    public getClientV2(options: OmnisharpClientOptions) {
        return this._getClient(ProxyClientV2, 2, options) as ProxyClientV2;
    }

    private _getClient(type: typeof ProxyClientV1 | typeof ProxyClientV2, version: number, options: OmnisharpClientOptions) {
        if (!this._proxies.has(key)) {
            var key = options.projectPath;
            var clientId = _.uniqueId('proxy-client');

            var cd = new CompositeDisposable();
            this._proxyDisposables.set(key, cd);
            this._disposable.add(cd);

            var wrapper = new ClientProxyWrapper(this._handlers, clientId, cd);
            cd.add(wrapper);

            var client = new type(options, wrapper);
            cd.add(client);

            cd.add(Disposable.create(() => {
                if (this._proxies.has(key)) {
                    this._proxies.delete(key);
                }
                if (this._proxyDisposables.has(key)) {
                    this._proxyDisposables.delete(key);
                }
            }));

            var options = _.clone(options);
            delete options.logger;
            var message = <ClientRequest>{
                client: clientId,
                version,
                options: options,
                type: clientKey
            };
            this._process.send(message);

            cd.add(Disposable.create(() => {
                if (this._process) {
                    message.dispose = true;
                    this._process.send(message);
                }
            }));

            this._proxies.set(key, client);
        }
        return this._proxies.get(key);
    }
}
