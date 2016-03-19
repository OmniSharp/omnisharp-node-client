import {Observable} from "rx";
import * as fs from "fs";
import {exec} from "child_process";
import {RuntimeContext} from "./runtime";
import {join} from "path";
import {IOmnisharpPlugin, ILogger} from "../enums";

const bootstrappedPlugins = new Map<string, string>();
const exists = Observable.fromCallback(fs.exists),
    readFile: (file: string) => Observable<any> = Observable.fromNodeCallback(fs.readFile);
const md5: (value: any) => string = require("md5");

export function getPluginPath(solutionLocation: string, ctx: RuntimeContext, requestedPlugins: IOmnisharpPlugin[], logger: ILogger) {
    const plugins: any[] = [];
    const hashStrings: any[] = [];
    let hash: string;
    requestedPlugins.forEach(plugin => {
        plugins.push(plugin);
    });

    return Observable.create<string>(observer => {
        logger.log("Bootstrapping " + solutionLocation);
        // Include the plugins defined in omnisharp.json, they could have changed.
        exists(join(solutionLocation, "omnisharp.json"))
            .where(x => !!x)
            .flatMap(x => readFile(join(solutionLocation, "omnisharp.json")))
            .map(x => JSON.parse(x.toString()))
            .tapOnNext(obj => {
                if (obj.plugins) { hashStrings.push(obj.plugins); }
            })
            .subscribeOnCompleted(() => {
                hash = md5(JSON.stringify(plugins.concat(hashStrings)));

                if (bootstrappedPlugins.has(hash)) {
                    observer.onNext(bootstrappedPlugins.get(hash));
                    observer.onCompleted();
                    return;
                }

                const command = [ctx.location, "-s", solutionLocation].concat(
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
                    if (error) {
                        observer.onError(error);
                        return;
                    }
                    const location = stdout.toString().trim();
                    if (location)                     {
                        // restore(location, ctx, logger).subscribe(observer);
                        return;
                    }
                    observer.onNext(ctx.location);
                    observer.onCompleted();
                });
            });
    })
        .map(path => path && path || ctx.location)
        .do(result => {
            if (!bootstrappedPlugins.has(hash))
                bootstrappedPlugins.set(hash, result);
            logger.log("Finished bootstrapping " + solutionLocation);
        });
}
