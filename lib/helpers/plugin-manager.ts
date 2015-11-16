import {each} from "lodash";
import {IOmnisharpPlugin} from "../interfaces";
import {exec} from "child_process";
import {Observable, Subject, Subscriber} from "@reactivex/rxjs";
import {bootstrapLocation} from "../omnisharp-path";
import * as fs from "fs";
import {join} from "path";
import {fromCallback, fromNodeCallback} from "./fromCallback";
const exists = fromCallback(fs.exists),
    readFile: (file: string) => Observable<any> = fromNodeCallback(fs.readFile);
const md5: (value: any) => string = require("md5");

export class PluginManager {
    private _plugins: Set<IOmnisharpPlugin>;
    private _pluginsChanged = new Subject<any>();
    private _bootstrappedPlugins = new Map<string, string>();
    private _currentBootstrap: string = null;

    constructor(private _solutionLocation: string, plugins: IOmnisharpPlugin[]) {
        this._plugins = new Set<IOmnisharpPlugin>();

        each(plugins, plugin => this._plugins.add(plugin));

        this._pluginsChanged.subscribe(() => this._currentBootstrap = null);
    }

    public getOmnisharpPath() {
        if (this._currentBootstrap) return Observable.of(this._currentBootstrap);

        let hash: string;
        const plugins : IOmnisharpPlugin[] = [];
        const hashStrings : string[] = [];
        this._plugins.forEach(plugin => {
            plugins.push(plugin);
        });

        return (<Observable<string>> Observable.create((subscriber: Subscriber<string>) => {
            // Include the plugins defined in omnisharp.json, they could have changed.
            exists(join(this._solutionLocation, "omnisharp.json"))
                .filter(x => !!x)
                .flatMap(x => readFile(join(this._solutionLocation, "omnisharp.json")))
                .map(x => JSON.parse(x.toString()))
                .do(obj => {
                        if (obj.plugins) {
                            hashStrings.push(obj.plugins);
                        }
                    }, null, () => {
                    hash = md5(JSON.stringify(plugins.concat(hashStrings)));

                    if (this._bootstrappedPlugins.has(hash)) {
                        subscriber.next(this._bootstrappedPlugins.get(hash));
                        subscriber.complete();
                        return;
                    }

                    const command = [bootstrapLocation, "-s", this._solutionLocation].concat(
                        plugins.map(x => {
                            if (x.location) {
                                return `--plugins ${x.location}`;
                            } else if (x.version) {
                                return `--plugin-name ${x.name}@${x.version}`;
                            } else {
                                return `--plugin-name ${x.name}`;
                            }
                        })).join(" ");

                    exec(command, function(error, stdout) {
                        subscriber.next(stdout.toString());
                        subscriber.complete();
                    });
                });
        })).do(result => {
            this._currentBootstrap = result;
            this._bootstrappedPlugins.set(hash, result);
        });
    }

    public add(plugin: IOmnisharpPlugin) {
        this._plugins.add(plugin);
        this._pluginsChanged.next(true);
    }

    public remove(plugin: IOmnisharpPlugin) {
        this._plugins.delete(plugin);
        this._pluginsChanged.next(true);
    }
}
