import {Observable, Scheduler} from "rx";
import {resolve, join, delimiter} from "path";
import * as fs from "fs";
import {exec} from "child_process";
import {ILogger, Runtime} from "../enums";
import {startsWith, delay, bind, memoize} from "lodash";
import {EOL} from "os";
export type RUNTIME_CONTEXT = { runtime: Runtime, platform: string; arch: string; bootstrap?: boolean };

const request: { get(url: string): NodeJS.ReadableStream; } = require("request");
const serverVersion = require(resolve(__dirname, "../../package.json"))["omnisharp-roslyn"];
const readdir = Observable.fromNodeCallback<string[]>(fs.readdir);
const exists = Observable.fromCallback(fs.exists);
const readFile = Observable.fromNodeCallback(fs.readFile);
const defaultDest = resolve(__dirname, "../../");
//const runtimes = resolve(defaultDest, "runtimes");
const dnu = "bin/dnu" + (process.platform === "win32" ? ".cmd" : "");
// Handle the case of homebrew mono
const PATH = ["/usr/local/bin", "/Library/Frameworks/Mono.framework/Commands"].concat(process.env.PATH.split(delimiter));

export const supportedRuntime = memoize(function(ctx: RUNTIME_CONTEXT) {
    return Observable.defer(() => {
        // On windows we'll just use the clr, it's there
        // On mac / linux if we've picked CoreClr stick with that
        if (ctx.platform === "win32" || ctx.runtime === Runtime.CoreClr) {
            return Observable.just(ctx.runtime);
        }

        // We need to check if mono exists on the system
        // If it doesn't we'll just run CoreClr
        return Observable.from(<string[]>PATH)
            .map(path => join(path, "mono"))
            .concatMap(path => exists(path))
            .where(x => x)
            .map(x => Runtime.ClrOrMono)
            .take(1)
            .defaultIfEmpty(Runtime.CoreClr);
    })
        .do(rt => console.log(`Supported runtime for "${Runtime[ctx.runtime]}" was: ${Runtime[rt]}`))
        .shareReplay(1);
}, function({platform, arch, runtime}: RUNTIME_CONTEXT) { return `${arch}-${platform}:${Runtime[runtime]}`; });

function checkCurrentVersion(dest?: string, ctx?: RUNTIME_CONTEXT) {
    if (!dest && !ctx) {
        throw new Error("Need a destination or context");
    }

    let filename: string;
    if (ctx) {
        filename = join(defaultDest, getRuntimeName(ctx), ".version");
    } else {
        filename = join(dest, ".version");
    }

    return exists(filename)
        .flatMap(ex => Observable.if(
            () => ex,
            Observable.defer(() => readFile(filename).map(content => content.toString().trim() === serverVersion)),
            Observable.just(false)
        ));
}

function ensureCurrentVersion(dest?: string, ctx?: RUNTIME_CONTEXT) {
    if (!dest && !ctx) {
        throw new Error("Need a destination or context");
    }

    if (ctx) {
        dest = join(defaultDest, getRuntimeName(ctx));
    }

    return checkCurrentVersion(dest, ctx)
        .flatMap(isCurrent => Observable.if(
            () => !isCurrent,
            Observable.defer(() => Observable.create<any>(observer => {
                dest = dest || defaultDest;
                require("rimraf")(dest, (err: any) => {
                    if (err) { observer.onError(err); return; }

                    delay(() =>
                        fs.mkdir(dest, (er) => {
                            //if (er) { observer.onError(er); return; }
                            fs.writeFile(join(dest, ".version"), serverVersion, (e) => {
                                if (e) { observer.onError(e); return; }
                                observer.onNext(isCurrent);
                                observer.onCompleted();
                            });
                        }), 500);
                });
            })),
            Observable.just(isCurrent)
        ));
}

export function getRuntimeId(ctx: RUNTIME_CONTEXT) {
    return `dnx-${getIdKey(ctx)}`;
}

function getIdKey(ctx: RUNTIME_CONTEXT) {
    if (ctx.platform !== "win32" && ctx.runtime === Runtime.ClrOrMono) {
        return `mono`;
    }
    return `${getRuntimeName(ctx)}-${getOsName(ctx)}-${getArch(ctx)}`;
}

export function findRuntimeById(runtimeId: string, logger: ILogger, location: string): Observable<string> {
    return readdir(location)
        .flatMap(x => x)
        .filter(x => startsWith(x, runtimeId))
        .max()
        .onErrorResumeNext(Observable.empty<number>())
        .map(z => z.toString())
        .share();
}

export function findRuntime(ctx: RUNTIME_CONTEXT, logger: ILogger, location: string = resolve(defaultDest, getRuntimeName(ctx), "runtimes")) {
    return findRuntimeById(getRuntimeId(ctx), logger, location);
}

export function downloadRuntime(ctx: RUNTIME_CONTEXT, logger: ILogger, dest = resolve(defaultDest, getRuntimeName(ctx))) {
    return Observable.defer(() => Observable.concat(
        downloadSpecificRuntime("omnisharp.bootstrap", ctx, logger, dest),
        downloadSpecificRuntime("omnisharp", ctx, logger, dest)
    ))
        .subscribeOn(Scheduler.async)
        .toArray();
}

export function downloadRuntimeIfMissing(ctx: RUNTIME_CONTEXT, logger: ILogger, dest: string = resolve(defaultDest, getRuntimeName(ctx))) {
    return ensureCurrentVersion(dest, ctx)
        .flatMap((isCurrent) =>
            findRuntime(ctx, logger).isEmpty())
        .flatMap(empty => Observable.if(
            () => empty,
            downloadRuntime(ctx, logger)
        ));
}

function downloadSpecificRuntime(name: string, ctx: RUNTIME_CONTEXT, logger: ILogger, destination: string) {
    const filename = `${name}-${getIdKey(ctx)}.${zipOrTar(ctx)}`;
    try {
        if (!fs.existsSync(destination))
            fs.mkdirSync(destination);
    } catch (e) { /* */ }

    const url = `https://github.com/OmniSharp/omnisharp-roslyn/releases/download/${serverVersion}/${filename}`;
    const path = join(destination, filename);

    return Observable.defer(() => Observable.concat(
        downloadFile(url, path, logger),
        Observable.defer(() => extract(ctx.platform === "win32", fs.createReadStream(path), path, destination, logger))
    )
        .tapOnCompleted(() => { try { fs.unlinkSync(path); } catch (e) { /* */ } })
        .subscribeOn(Scheduler.async))
        .map(() => name);
}

function downloadFile(url: string, path: string, logger: ILogger) {
    logger.log(`Downloading ${path}`);
    return Observable.create<void>((observer) => {
        request.get(url)
            .pipe(fs.createWriteStream(path))
            .on("error", bind(observer.onError, observer))
            .on("finish", () => {
                logger.log(`Finished downloading ${path}`);
                observer.onCompleted();
            });
    });
}

function extract(win32: boolean, stream: NodeJS.ReadableStream, path: string, dest: string, logger: ILogger) {
    return Observable.create<void>((observer) => {
        logger.log(`Extracting ${path}`);
        if (win32) {
            stream = stream
                .pipe(require("unzip").Extract({ path: dest }));
        } else {
            stream = stream
                .pipe(require("zlib").createGunzip())
                .pipe(require("tar").Extract({ path: dest }));
        }

        stream
            .on("error", bind(observer.onError, observer))
            .on("close", () => {
                logger.log(`Finished extracting ${path}`);
                observer.onCompleted();
            });
    });
}

export function restore(target: string, ctx: RUNTIME_CONTEXT, logger: ILogger, location: string = resolve(defaultDest, getRuntimeName(ctx))) {
    const runtimeId = getRuntimeId(ctx);
    return readdir(location).flatMap(x => x)
        .filter(x => startsWith(x, runtimeId)).max()
        .map(x => join(location, x, dnu))
        .flatMap(dnuPath =>
            Observable.create<string>(observer => {
                exec(`${dnuPath} restore`, function(error, stdout) {
                    if (error) {
                        observer.onError(error);
                        return;
                    }
                    const results = stdout.toString().split(EOL);
                    results.forEach(r => logger.log(r));
                    observer.onNext(target);
                    observer.onCompleted();
                });
            }))
        .subscribeOn(Scheduler.async);
}

function getArch(ctx: RUNTIME_CONTEXT) {
    return ctx.arch === "x64" ? "x64" : "x86";
}

function getRuntimeName({runtime, platform}: RUNTIME_CONTEXT) {
    if (platform === "win32")
        return runtime === Runtime.ClrOrMono ? "clr" : "coreclr";
    return runtime === Runtime.ClrOrMono ? "mono" : "coreclr";
}

function getOsName(ctx: RUNTIME_CONTEXT) {
    if (ctx.platform === "win32")
        return "win";
    return ctx.platform;
}

function zipOrTar(ctx: RUNTIME_CONTEXT) {
    return ctx.platform === "win32" ? "zip" : "tar.gz";
}

/* tslint:disable:no-string-literal */
export function getRuntimeLocation(ctx: RUNTIME_CONTEXT) {
    if (ctx.bootstrap) {
        const bootstrap = process.platform === "win32" ? "omnisharp.bootstrap.cmd" : "omnisharp.bootstrap";
        return <string>process.env["OMNISHARP_BOOTSTRAP"] || resolve(__dirname, "../../", getRuntimeName(ctx), bootstrap);
    }
    const omnisharp = process.platform === "win32" ? "run.cmd" : "run";
    return <string>process.env["OMNISHARP"] || resolve(__dirname, "../../", getRuntimeName(ctx), omnisharp);
}
/* tslint:enable:no-string-literal */

