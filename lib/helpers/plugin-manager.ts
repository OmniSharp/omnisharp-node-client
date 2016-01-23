import {each} from "lodash";
import {IOmnisharpPlugin} from "../enums";
import {Subject} from "rx";
import {CompositeDisposable} from "rx";

export class PluginManager implements Rx.IDisposable {
    private _disposable = new CompositeDisposable();
    private _pluginsChanged = new Subject<any>();
    private _currentBootstrap: string = null;

    private _observePluginsChanged = this._pluginsChanged.debounce(1000);
    public get changed() { return this._observePluginsChanged; }

    private _plugins = new Set<IOmnisharpPlugin>();
    public get plugins() { return this._plugins; }

    constructor(plugins: IOmnisharpPlugin[]) {
        each(plugins, plugin => this._plugins.add(plugin));
        this._disposable.add(this._pluginsChanged.subscribe(() => this._currentBootstrap = null));
    }

    public add(plugin: IOmnisharpPlugin) {
        this._plugins.add(plugin);
        this._pluginsChanged.onNext(true);
    }

    public remove(plugin: IOmnisharpPlugin) {
        this._plugins.delete(plugin);
        this._pluginsChanged.onNext(true);
    }

    public dispose() {
        this._disposable.dispose();
    }
}
