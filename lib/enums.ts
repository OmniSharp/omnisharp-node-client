import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import * as OmniSharp from './omnisharp-server';
import { RequestContext, ResponseContext, CommandContext } from './contexts';

export enum DriverState {
    Disconnected,
    Downloading,
    Downloaded,
    //Bootstrapping,
    //Bootstrapped,
    Connecting,
    Connected,
    Error
}

export enum Runtime {
    ClrOrMono,
    CoreClr
}

export interface ILogger {
    log(...values: any[]): void;
    error(...values: any[]): void;
}

export interface IDriverCoreOptions {
    projectPath: string;
    remote?: boolean;
    debug?: boolean; // Start the debug server? (Run from source, to attach with a debug host like VS)
    serverPath?: string; // Start a given server, perhaps in a different directory.
    findProject?: boolean; // Should try and find the project using the project finder
    logger?: ILogger;
    timeout?: number; // timeout in seconds
    runtime?: Runtime;
    additionalArguments?: string[];
    plugins?: IOmnisharpPlugin[];
    version?: string;
}

export interface IDriverOptions extends IDriverCoreOptions {
    onEvent: (event: OmniSharp.Stdio.Protocol.EventPacket) => void;
    onCommand: (event: OmniSharp.Stdio.Protocol.ResponsePacket) => void;
    onState: (state: DriverState) => void;
}

export interface IDriver extends IDisposable {
    id: string;
    connect(): void;
    currentState: DriverState;
    disconnect(): void;
    serverPath: string;
    projectPath: string;
    runtime: Runtime;
}

export interface IAsyncDriver extends IDriver {
    request<TRequest, TResponse>(command: string, request?: TRequest): PromiseLike<TResponse>;
    onEvent(callback: (event: OmniSharp.Stdio.Protocol.EventPacket) => void): IDisposable;
    onState(callback: (state: DriverState) => void): IDisposable;
}

export interface IReactiveDriver extends IDriver {
    request<TRequest, TResponse>(command: string, request?: TRequest): Observable<TResponse>;
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    state: Observable<DriverState>;
}

export interface IPluginDriver extends IDriver {
    updatePlugins(plugins: IOmnisharpPlugin): void;
}

export function isPluginDriver(driver: any): driver is IPluginDriver { return !!(<any>driver).updatePlugins; }

export interface CoreClientOptions extends IDriverCoreOptions {
    statusSampleTime?: number;
    responseSampleTime?: number;
    concurrency?: number;
    concurrencyTimeout?: number;
    serverOptions?: {
        dotnet?: {
            alias?: string;
            projects?: string;
            enablePackageRestore?: boolean;
            packageRestoreTimeout?: number;
        };
        formattingOptions?: {
            newLine?: string;
            useTabs?: boolean;
            tabSize?: number;
            indentationSize?: number;
        }
    };
}

export interface InternalCoreClientOptions extends IDriverCoreOptions {
    statusSampleTime: number;
    responseSampleTime: number;
    concurrency: number;
    concurrencyTimeout: number;
    omnisharp: {
        dnx: {
            alias?: string;
            projects?: string;
            enablePackageRestore?: string;
            packageRestoreTimeout?: number;
        };
        formattingOptions: {
            newLine?: string;
            useTabs?: boolean;
            tabSize?: number;
        }
    };
}

export interface AsyncClientOptions extends CoreClientOptions {
    driver?: (options: IDriverOptions) => IAsyncDriver;
}

export interface ReactiveClientOptions extends CoreClientOptions {
    driver?: (options: IDriverOptions) => IReactiveDriver;
}

export interface InternalAsyncClientOptions extends InternalCoreClientOptions {
    driver: (options: IDriverOptions) => IAsyncDriver;
}

export interface InternalReactiveClientOptions extends InternalCoreClientOptions {
    driver: (options: IDriverOptions) => IReactiveDriver;
}

export interface IOmnisharpPlugin {
    name?: string;
    version?: string;
    location?: string;
}

export interface OmnisharpClientStatus {
    state: DriverState;
    outgoingRequests: number;
    hasOutgoingRequests: boolean;
}

export module Omnisharp {
    export interface Events {
        events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Observable<DriverState>;
        status: Observable<OmnisharpClientStatus>;
        requests: Observable<RequestContext<any>>;
        responses: Observable<ResponseContext<any, any>>;
        errors: Observable<CommandContext<any>>;
    }
}
