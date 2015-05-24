/// <reference path="./omnisharp-server.d.ts" />

declare module OmnisharpClient {
    export enum Driver {
        Http = 0,
        Stdio = 1,
    }
    export enum DriverState {
        Disconnected = 0,
        Connecting = 1,
        Connected = 2,
        Error = 3,
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
    }
    export interface OmnisharpClientOptions extends IDriverOptions {
        driver?: Driver;
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
    export interface CommandWrapper<T> {
        command:string;
        value: T;
    }
    export interface RequestWrapper<T> {
        command: string;
        request: T;
    }

    export interface ResponseWrapper<TRequest, TResponse> {
        command: string;
        request: TRequest;
        response: TResponse;
    }

    export interface Context<TRequest, TResponse>
    {
        request: TRequest;
        response: TResponse;
    }

    export function findCandidates(location: string, logger: ILogger): Rx.Observable<string[]>;

    export class OmnisharpClient implements OmniSharp.Api, OmniSharp.Events {
        constructor(_options?: OmnisharpClientOptions);
        id: string;
        serverPath: string;
        projectPath: string;
        connect(_options?: OmnisharpClientOptions): void;
        disconnect(): void;
        currentState: DriverState;
        outstandingRequests: number;
        events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Rx.Observable<DriverState>;
        status: Rx.Observable<OmnisharpClientStatus>;
        requests: Rx.Observable<RequestWrapper<any>>;
        responses: Rx.Observable<ResponseWrapper<any, any>>;
        errors: Rx.Observable<CommandWrapper<any>>;
        request<TRequest, TResponse>(action: string, request?: TRequest): Rx.Observable<TResponse>;
    }

    export CompositeOmnisharpClient implements OmniSharp.Events {
        add(client: OmnisharpClient);
        remove(client: OmnisharpClient);
    }
}

declare module "omnisharp-client" {
    export = OmnisharpClient;
}
