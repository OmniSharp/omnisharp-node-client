import {Observable} from "rx";
import {resolve, join} from "path";
import * as fs from "fs";
import {ILogger, Runtime} from "./enums";
import {startsWith, delay, bind} from "lodash";
const request: { get(url: string): NodeJS.ReadableStream; } = require("request");

export type PROC = { platform: string; arch: string; };
const serverVersion = require(resolve(__dirname, "../package.json"))["omnisharp-roslyn"];
const readdir = Observable.fromNodeCallback<string[]>(fs.readdir);
const runtimes = resolve(__dirname, "../roslyn/", "runtimes");

function getArch(proc: PROC) {
    return proc.arch === "x64" ? "x64" : "x86";
}

function getRuntimeName(runtime: Runtime, proc: PROC) {
    if (proc.platform === "win32")
        return runtime === Runtime.ClrOrMono ? "clr" : "coreclr";
    return runtime === Runtime.ClrOrMono ? "mono" : "coreclr";
}

function getOsName(proc: PROC) {
    if (proc.platform === "win32")
        return "win";
    return proc.platform;
}

function checkCurrentVersion(dest = resolve(__dirname, "../roslyn/")) {
    return Observable.create<boolean>((observer) => {
        fs.exists(join(dest, ".version"), (exists) => {
            if (!exists) {
                observer.onNext(exists);
                observer.onCompleted();
                return;
            }

            fs.readFile(join(dest, ".version"), (er, data) => {
                if (er) {
                    observer.onError(er);
                    return;
                }

                observer.onNext(data.toString().trim() === serverVersion);
                observer.onCompleted();
            });
        });
    });
}

function ensureCurrentVersion(dest = resolve(__dirname, "../roslyn/")) {
    return checkCurrentVersion(dest)
        .flatMap(isCurrent => Observable.create<void>((observer) => {
            if (!isCurrent) {
                require("rimraf")(dest, (err: any) => {
                    if (err) { observer.onError(err); return; }

                    delay(() =>
                        fs.mkdir(dest, (er) => {
                            if (er) { observer.onError(er); return; }
                            fs.writeFile(join(dest, ".version"), serverVersion, (e) => {
                                if (e) { observer.onError(e); return; }
                                observer.onNext(null);
                                observer.onCompleted();
                            });
                        }), 500);
                });
                return;
            }
            observer.onNext(null);
            observer.onCompleted();
        }));
}

export function getRuntimeId(runtime: Runtime, proc: PROC) {
    return `dnx-${getIdKey(runtime, proc)}`;
}

function getIdKey(runtime: Runtime, proc: PROC) {
    if (proc.platform !== "win32" && runtime === Runtime.ClrOrMono) {
        return `mono`;
    }
    return `${getRuntimeName(runtime, proc)}-${getOsName(proc)}-${getArch(proc)}`;
}

export function findRuntimeById(runtimeId: string, logger: ILogger, location: string = runtimes): Observable<string> {
    return ensureCurrentVersion()
        .flatMap(() => readdir(location)
            .flatMap(x => x)
            .filter(x => startsWith(x, runtimeId))
            .max()
            .onErrorResumeNext(Observable.empty<number>())
            .map(z => z.toString())
        )
        .share();
}

export function findRuntime(runtime: Runtime, proc: PROC, logger: ILogger, location: string = runtimes) {
    return findRuntimeById(getRuntimeId(runtime, proc), logger, location);
}

export function downloadRuntime(runtime: Runtime, proc: PROC, logger: ILogger, dest = resolve(__dirname, "../roslyn/")) {
    const key = getIdKey(runtime, proc);
    const extractStuff = (name: string, destination: string) => {
        try {
            fs.mkdirSync(destination);
        } catch (e) { /* */ }

        const url = `https://github.com/OmniSharp/omnisharp-roslyn/releases/download/${serverVersion}/${name}`;
        const path = join(destination, name);
        logger.log(`Downloading ${path}`);

        return Observable.create<void>((observer) => {
            request.get(url)
                .pipe(fs.createWriteStream(path))
                .on("error", (e: any) => observer.onError(e))
                .on("finish", () => {
                    observer.onNext(null);
                    observer.onCompleted();
                });
        })
            .do(null, null, () => logger.log(`Finished downloading ${path}`))
            .concatMap(() => extract(proc.platform === "win32", fs.createReadStream(path), path, destination, logger))
            .do(null, null, () => fs.unlinkSync(path))
            .do(null, null, () => logger.log(`Finished extracting ${path}`))
            .concatMap(Observable.of(path));
    };

    return ensureCurrentVersion()
        .flatMap(() => extractStuff(`omnisharp-${key}.${zipOrTar(proc)}`, dest))
        .flatMap(() => extractStuff(`omnisharp.bootstrap-${key}.${zipOrTar(proc)}`, join(dest, "boot")))
        .toArray();
}

function zipOrTar(proc: PROC) {
    return proc.platform === "win32" ? "zip" : "tar.gz";
}

function extract(win32: boolean, stream: NodeJS.ReadableStream, path: string, dest: string, logger: ILogger) {
    if (win32) {
        return unzip(stream, path, dest, logger);
    } else {
        return untar(stream, path, dest, logger);
    }
}

function unzip(stream: NodeJS.ReadableStream, path: string, dest: string, logger: ILogger) {
    return Observable.create<void>((observer) => {
        logger.log(`Extracting ${path}`);
        stream
            .pipe(require("unzip").Extract({ path: dest }))
            .on("error", bind(observer.onError, observer))
            .on("close", () => {
                observer.onNext(null);
                observer.onCompleted();
            });
    });
}

function untar(stream: NodeJS.ReadableStream, path: string, dest: string, logger: ILogger) {
    return Observable.create<void>((observer) => {
        logger.log(`Extracting ${path}`);
        stream
            .pipe(require("zlib").createGunzip())
            .pipe(require("tar").Extract({ path: dest }))
            .on("error", bind(observer.onError, observer))
            .on("close", () => {
                observer.onNext(null);
                observer.onCompleted();
            });
    });
}
