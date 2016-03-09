import {Observable, Scheduler} from "rx";
import {resolve, join, delimiter} from "path";
import * as fs from "fs";
import {ILogger, Runtime} from "../enums";
import {delay, bind, memoize} from "lodash";
export type RUNTIME_CONTEXT = { runtime: Runtime, platform: string; arch: string; bootstrap?: boolean };

const request: { get(url: string): NodeJS.ReadableStream; } = require("request");
const serverVersion = require(resolve(__dirname, "../../package.json"))["omnisharp-roslyn"];
const exists = Observable.fromCallback(fs.exists);
const readFile = Observable.fromNodeCallback(fs.readFile);
const defaultDest = resolve(__dirname, "../../");
// Handle the case of homebrew mono
const PATH: string[] = process.env.PATH.split(delimiter).concat(["/usr/local/bin", "/Library/Frameworks/Mono.framework/Commands"]);

export const supportedRuntime = memoize(function(ctx: RUNTIME_CONTEXT) {
    return Observable.defer(() => {
        // On windows we'll just use the clr, it's there
        // On mac / linux if we've picked CoreClr stick with that
        if (ctx.platform === "win32" || ctx.runtime === Runtime.CoreClr) {
            return Observable.just({ runtime: ctx.runtime, path: process.env.PATH });
        }

        // We need to check if mono exists on the system
        // If it doesn't we'll just run CoreClr
        return Observable.from(<string[]>PATH)
            .map(path => join(path, "mono"))
            .concatMap(path => exists(path).map(e => ({ exists: e, path })))
            .where(x => x.exists)
            .map(x => ({ runtime: Runtime.ClrOrMono, path: [x.path].concat(PATH).join(delimiter) }))
            .take(1)
            .defaultIfEmpty({ runtime: Runtime.CoreClr, path: process.env.PATH });
    })
        .do(ct => console.log(`Supported runtime for "${Runtime[ct.runtime]}" was: ${Runtime[ct.runtime]}`))
        .shareReplay(1);
}, function({platform, arch, runtime}: RUNTIME_CONTEXT) { return `${arch}-${platform}:${Runtime[runtime]}`; });

function checkCurrentVersion(dest?: string, ctx?: RUNTIME_CONTEXT) {
    if (!dest && !ctx) {
        throw new Error("Need a destination or context");
    }

    let filename: string;
    if (ctx) {
        filename = join(defaultDest, getRuntimeId(ctx), ".version");
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
        dest = join(defaultDest, getRuntimeId(ctx));
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
    return `omnisharp-${getIdKey(ctx)}`;
}

function getIdKey(ctx: RUNTIME_CONTEXT) {
    if (ctx.platform !== "win32" && ctx.runtime === Runtime.ClrOrMono) {
        return `linux-mono`;
    }

    let runtimeName = "dnxcore50";
    if (ctx.runtime === Runtime.ClrOrMono) {
        if (ctx.platform === "win32") {
            runtimeName = "dnx451";
        } else {
            runtimeName = "mono";
        }
    }

    return `${getOsName(ctx)}-${getArch(ctx)}-${runtimeName}`;
}

export function findRuntimeById(runtimeId: string, location: string): Observable<string> {
    return Observable.merge(
            exists(resolve(location, runtimeId, "OmniSharp.exe")),
            exists(resolve(location, runtimeId, "OmniSharp"))
        )
        .filter(x => x)
        .take(1)
        .map(x => resolve(location, runtimeId))
        .share();
}

export function findRuntime(ctx: RUNTIME_CONTEXT, location: string = resolve(defaultDest)) {
    return findRuntimeById(getRuntimeId(ctx), location);
}

export function downloadRuntime(ctx: RUNTIME_CONTEXT, logger: ILogger, dest = resolve(defaultDest, getRuntimeId(ctx))) {
    return Observable.defer(() => Observable.concat(
        // downloadSpecificRuntime("omnisharp.bootstrap", ctx, logger, dest),
        downloadSpecificRuntime("omnisharp", ctx, logger, dest)
    ))
        .subscribeOn(Scheduler.async)
        .toArray();
}

export function downloadRuntimeIfMissing(ctx: RUNTIME_CONTEXT, logger: ILogger, dest: string = resolve(defaultDest, getRuntimeId(ctx))) {
    return ensureCurrentVersion(dest, ctx)
        .flatMap((isCurrent) =>
            findRuntime(ctx).isEmpty())
        .flatMap(empty => Observable.if(
            () => empty,
            downloadRuntime(ctx, logger)
        ));
}

function downloadSpecificRuntime(name: string, ctx: RUNTIME_CONTEXT, logger: ILogger, destination: string) {
    const filename = `${name}-${getIdKey(ctx)}.${ctx.platform === "win32" ? "zip" : "tar.gz"}`;
    try {
        if (!fs.existsSync(destination))
            fs.mkdirSync(destination);
    } catch (e) { /* */ }

    const url = `https://github.com/OmniSharp/omnisharp-roslyn/releases/download/${serverVersion}/${filename}`;
    const path = join(destination, filename);

    return Observable.defer(() => Observable.concat(
        downloadFile(url, path, logger).delay(100),
        Observable.defer(() => extract(ctx.platform === "win32", path, destination, logger))
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

interface IDecompressOptions {
    mode?: string;
    strip?: number;
}
interface IDecompress {
    new (options: IDecompressOptions): IDecompress;
    src(fileOrFiles: string | Buffer | string[]): IDecompress;
    dest(path: string): IDecompress;
    use(plugin: any): IDecompress;
    run(cb: Function): void;
}
interface IDecompressStatic {
    new (options: IDecompressOptions): IDecompress;
    tar(options: IDecompressOptions): any;
    tarbz2(options: IDecompressOptions): any;
    targz(options: IDecompressOptions): any;
    zip(options: IDecompressOptions): any;
}

/* tslint:disable:variable-name */
const Decompress: IDecompressStatic = require("decompress");
/* tslint:enable:variable-name */

function extract(win32: boolean, path: string, dest: string, logger: ILogger) {
    return Observable.create<void>((observer) => {
        logger.log(`Extracting ${path}`);
        console.log(path, dest);
        new Decompress({ mode: "755" })
            .src(path)
            .dest(dest)
            .run((err: any, files: any) => {
                if (err) {
                    observer.onError(err);
                    return;
                }
                logger.log(`Finished extracting ${path}`);
                observer.onCompleted();
            });
    });
}

function getArch(ctx: RUNTIME_CONTEXT) {
    return ctx.arch === "x64" ? "x64" : "x86";
}

function getOsName(ctx: RUNTIME_CONTEXT) {
    if (ctx.platform === "win32")
        return "win";
    if (ctx.platform === "darwin")
        return "osx";
    return ctx.platform;
}

/* tslint:disable:no-string-literal */
export function getRuntimeLocation(ctx: RUNTIME_CONTEXT) {
    /*if (ctx.bootstrap) {
        const bootstrap = process.platform === "win32" ? "OmniSharp.exe" : "omnisharp.bootstrap";
        return <string>process.env["OMNISHARP_BOOTSTRAP"] || resolve(__dirname, "../../", getRuntimeId(ctx), bootstrap);
    }*/

    let path: string = process.env["OMNISHARP"];

    if (!path) {
        const omnisharp = process.platform === "win32" || ctx.runtime === Runtime.ClrOrMono ? "OmniSharp.exe" : "OmniSharp";
        path = resolve(__dirname, "../../", getRuntimeId(ctx), omnisharp);
    }

    if (process.platform !== "win32" && ctx.runtime === Runtime.ClrOrMono) {
        return `mono ${path}`;
    }

    return path;
}
/* tslint:enable:no-string-literal */

