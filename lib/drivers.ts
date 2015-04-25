export enum Driver {
    Http,
    Stdio,
    //TODO: Websocket,
}

export enum DriverState {
    Disconnected,
    Connecting,
    Connected,
}

export interface IStaticDriver {
    new (options: IDriverOptions): IDriver;
}

export interface IDriverOptions {
    projectPath: string;
    remote?: boolean;
    debug?: boolean; // Start the debug server? (Run from source, to attach with a debug host like VS)
    serverPath?: boolean; // Start a given server, perhaps in a different directory.
}

export interface IDriver {
    connect();
    currentState: DriverState;
    events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Rx.Observable<DriverState>;
    outstandingRequests: number;
    disconnect();
    request<TRequest, TResponse>(command: string, request?: TRequest): Rx.Observable<TResponse>;
}
