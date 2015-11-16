import {OmniSharp} from "../omnisharp-server.d.ts";
import {IDisposable} from "./helpers/Disposable";
import {Observable} from "@reactivex/rxjs";
import {DriverState, Driver} from "./enums";
import {RequestContext, ResponseContext, CommandContext} from "./contexts";

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
    additionalArguments?: string[];
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
    request<TRequest, TResponse>(command: string, request?: TRequest): Observable<TResponse>;
}

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
    plugins?: IOmnisharpPlugin[];
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

declare module Omnisharp {
    interface Events {
        events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Observable<DriverState>;
        status: Observable<OmnisharpClientStatus>;
        requests: Observable<RequestContext<any>>;
        responses: Observable<ResponseContext<any, any>>;
        errors: Observable<CommandContext<any>>;
    }
}
