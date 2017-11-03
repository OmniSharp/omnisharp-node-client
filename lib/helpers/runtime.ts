import * as fs from 'fs';
import { assignWith, bind, delay, find, isNull, isUndefined, memoize, toLower } from 'lodash';
import { delimiter, join, resolve } from 'path';
import { AsyncSubject, Observable, Scheduler } from 'rxjs';
import { ILogger } from '../enums';
import { createObservable } from '../operators/create';
import { decompress } from './decompress';
import { getSupportedPlatform, supportedPlatform, SupportedPlatform } from './platform';

// tslint:disable:no-var-requires no-require-imports
const request: { get(url: string): NodeJS.ReadableStream; } = require('request');
// tslint:disable-next-line:non-literal-require
const defaultServerVersion = require(resolve(__dirname, '../../package.json'))['omnisharp-roslyn'];
const exists = Observable.bindCallback(fs.exists);
const readFile = Observable.bindNodeCallback(fs.readFile);
const defaultDest = resolve(__dirname, '../../');
// tslint:enable:no-var-requires no-require-imports

// Handle the case of homebrew mono
const PATH: string[] = find<any, string>(process.env, (v, key) => toLower(key) === 'path')
    .split(delimiter)
    .concat(['/usr/local/bin', '/Library/Frameworks/Mono.framework/Commands']);

export interface IRuntimeContext {
    platform: string;
    arch: string;
    bootstrap?: boolean;
    version?: string;
    destination?: string;
}

export class RuntimeContext {
    private _platform: SupportedPlatform;
    private _arch: string;
    private _bootstrap: string;
    private _version: string;
    private _destination: string;

    private _id: string;
    private _key: string;
    private _os: string;
    private _location: string;

    public constructor(runtimeContext: IRuntimeContext, private _logger?: ILogger) {
        if (!_logger) {
            this._logger = console;
        }

        const self = <any>this;
        assignWith(self, runtimeContext || {}, (obj, src, key) => {
            self[`_${key}`] = obj || src;
        });

        if (isNull(this._platform) || isUndefined(this._platform)) {
            this._platform = supportedPlatform;
        } else {
            this._platform = getSupportedPlatform(runtimeContext.platform);
        }

        if (isNull(this._arch) || isUndefined(this._arch)) {
            this._arch = process.arch;
        }

        if (isNull(this._version) || isUndefined(this._version)) {
            this._version = defaultServerVersion;
        }

        this._arch = this._arch === 'x86' ? 'x86' : 'x64';

        this._os = this._getOsName();
        this._key = this._getIdKey();
        this._id = `omnisharp-${this._key}`;

        if (isNull(this._location) || isUndefined(this._location)) {
            this._location = this._getRuntimeLocation();
        }

        if (isNull(this._destination) || isUndefined(this._destination)) {
            this._destination = resolve(defaultDest, this._id);
        }

        Object.freeze(this);
    }

    public get platform() { return this._platform; }
    public get arch() { return this._arch; }
    public get bootstrap() { return this._bootstrap; }
    public get version() { return this._version; }
    public get destination() { return this._destination; }
    public get id() { return this._id; }
    public get location() { return this._location; }

    public findRuntime(location: string = resolve(defaultDest)) {
        return findRuntimeById(this._id, location);
    }

    public downloadRuntime() {
        return Observable.defer(() => Observable.concat(
            // downloadSpecificRuntime("omnisharp.bootstrap", ctx, logger, dest),
            this._downloadSpecificRuntime('omnisharp')
        ))
            .subscribeOn(Scheduler.async)
            .toArray()
            .concatMap(() => Observable.bindCallback<string, any, any>(fs.writeFile)(join(this._destination, '.version'), this._version), result => result);
    }

    public downloadRuntimeIfMissing() {
        return this._ensureCurrentVersion()
            .flatMap(isCurrent =>
                this.findRuntime().isEmpty())
            .flatMap(empty => Observable.if(
                () => empty,
                this.downloadRuntime()
            ));
    }

    public downloadFile(url: string, path: string) {
        if (this._logger) {
            this._logger.log(`Downloading ${path}`);
        }
        return createObservable<void>(observer => {
            request.get(url)
                .pipe(fs.createWriteStream(path))
                .on('error', bind(observer.error, observer))
                .on('finish', () => {
                    if (this._logger) {
                        this._logger.log(`Finished downloading ${path}`);
                    }
                    observer.next(void 0);
                    observer.complete();
                });
        });
    }

    private _getIdKey() {
        return `${this._os}-${this._arch}`;
    }

    private _getOsName() {
        if (this._platform === SupportedPlatform.Windows) { return 'win'; }

        const name = SupportedPlatform[this._platform];
        if (name) { return name.toLowerCase(); }
        return name;
    }

    /* tslint:disable:no-string-literal */
    private _getRuntimeLocation() {
        let path: string = process.env['OMNISHARP']!;

        if (!path) {
            const omnisharp = process.platform === 'win32' ? 'OmniSharp.exe' : 'run';
            path = resolve(__dirname, '../../', this._id, omnisharp);
        }

        return path;
    }
    /* tslint:enable:no-string-literal */

    private _checkCurrentVersion() {
        const filename = join(this._destination, '.version');

        return exists(filename)
            .flatMap(isCurrent =>
                this.findRuntime().isEmpty(), (ex, isEmpty) => ex && !isEmpty)
            .flatMap(ex => Observable.if(
                () => ex,
                Observable.defer(() => readFile(filename).map(content => content.toString().trim() === this._version)),
                Observable.of(false)
            ));
    }

    private _ensureCurrentVersion() {
        let dest = this._destination;

        return this._checkCurrentVersion()
            .flatMap(isCurrent => Observable.if(
                () => !isCurrent,
                Observable.defer(() => createObservable(observer => {
                    dest = dest || defaultDest;
                    // tslint:disable-next-line:no-require-imports
                    require('rimraf')(dest, (err: any) => {
                        if (err) { observer.error(err); return; }
                        delay(() => {
                            observer.next(isCurrent);
                            observer.complete();
                        }, 500);
                    });
                })),
                Observable.of(isCurrent)
            ));
    }

    private _downloadSpecificRuntime(name: string) {
        const filename = `${name}-${this._key}.${this._platform === SupportedPlatform.Windows ? 'zip' : 'tar.gz'}`;
        const destination = this._destination;
        try {
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination);
            }
        } catch (e) { /* */ }

        const url = `https://github.com/OmniSharp/omnisharp-roslyn/releases/download/${this._version}/${filename}`;
        const path = join(destination, filename);

        return Observable.defer(() => Observable.concat(
            this.downloadFile(url, path).delay(100),
            Observable.defer(() => this._extract(this._platform === SupportedPlatform.Windows, path, destination))
        )
            .do({ complete: () => { try { fs.unlinkSync(path); } catch (e) { /* */ } } })
            .subscribeOn(Scheduler.async))
            .map(() => name);
    }

    private _extract(win32: boolean, path: string, dest: string) {
        if (this._logger) {
            this._logger.log(`Extracting ${path}`);
        }
        return decompress(path, dest, { mode: '755' });
    }
}

export const isSupportedRuntime = (ctx: RuntimeContext) => {
    return Observable.defer(() => {
        // On windows we'll just use the clr, it's there
        // On mac / linux if we've picked CoreClr stick with that
        return Observable.of({ path: process.env.PATH });
    });
};

function findOmnisharpExecuable(runtimeId: string, location: string): Observable<boolean> {
    return Observable.merge(
        exists(resolve(location, runtimeId, 'OmniSharp.exe')),
        exists(resolve(location, runtimeId, 'run'))
    )
        .filter(x => x)
        .take(1)
        .share();
}

export function findRuntimeById(runtimeId: string, location: string): Observable<string> {
    return findOmnisharpExecuable(runtimeId, location)
        .map(x => resolve(location, runtimeId))
        .share();
}
