import {DriverState, Driver} from "./enums";
import {RequestContext, ResponseContext, CommandContext} from "./clients/contexts";

export interface IStaticDriver {
    new (options: IDriverOptions): IDriver;
}

export interface ILogger {
    log(...values: any[]);
    error(...values: any[]);
}

export interface IDriverOptions {
    projectPath?: string;
    remote?: boolean;
    debug?: boolean; // Start the debug server? (Run from source, to attach with a debug host like VS)
    serverPath?: string; // Start a given server, perhaps in a different directory.
    findProject?: boolean; // Should try and find the project using the project finder
    logger?: ILogger;
    timeout?: number; // timeout in seconds
    additionalArguments?: string[];
}

export interface IDriver {
    id: string;
    connect({projectPath}: IDriverOptions);
    currentState: DriverState;
    events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Rx.Observable<DriverState>;
    outstandingRequests: number;
    disconnect();
    serverPath: string;
    projectPath: string;
    request<TRequest, TResponse>(command: string, request?: TRequest): Rx.Observable<TResponse>;
}

export interface OmnisharpClientOptions extends IDriverOptions {
    driver?: Driver;
    oneBasedIndices?: boolean;
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
    }
}

export interface OmnisharpClientStatus {
    state: DriverState;
    requestsPerSecond: number;
    responsesPerSecond: number;
    eventsPerSecond: number;
    operationsPerSecond: number;
    outgoingRequests: number;
    hasOutgoingRequests: boolean;
}

declare module Omnisharp {
    interface Events {
        events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Rx.Observable<DriverState>;
        status: Rx.Observable<OmnisharpClientStatus>;
        requests: Rx.Observable<RequestContext<any>>;
        responses: Rx.Observable<ResponseContext<any, any>>;
        errors: Rx.Observable<CommandContext<any>>;
    }
}
