import * as OmniSharp from "./omnisharp-server";
import {IDisposable} from "./disposables";
import {Observable} from "rxjs";
import {RequestContext, ResponseContext, CommandContext} from "./contexts";

export enum Driver {
    Http,
    Stdio,
    //TODO: Websocket,
}

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

export interface IStaticDriver {
    new (options: IDriverOptions): IDriver;
}

export interface ILogger {
    log(...values: any[]): void;
    error(...values: any[]): void;
}

export interface IDriverOptions {
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

export interface IDriver extends IDisposable {
    id: string;
    connect(): void;
    currentState: DriverState;
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Observable<DriverState>;
    disconnect(): void;
    serverPath: string;
    projectPath: string;
    runtime: Runtime;
    request<TRequest, TResponse>(command: string, request?: TRequest): Observable<TResponse>;
}

export interface IPluginDriver extends IDriver {
    updatePlugins(plugins: IOmnisharpPlugin): void;
}

export function isPluginDriver(driver: any): driver is IPluginDriver { return !!(<any>driver).updatePlugins; }

export interface OmnisharpClientOptions extends IDriverOptions {
    driver?: Driver;
    oneBasedIndices?: boolean;
    statusSampleTime?: number;
    responseSampleTime?: number;
    concurrency?: number;
    concurrencyTimeout?: number;
    omnisharp?: {
        dnx?: {
            alias?: string;
            projects?: string;
            enablePackageRestore?: string;
            packageRestoreTimeout?: number;
        };
        formattingOptions?: {
            newLine?: string;
            useTabs?: boolean;
            tabSize?: number;
        }
    };
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
