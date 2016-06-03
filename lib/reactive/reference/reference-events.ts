import * as OmniSharp from "../../omnisharp-server";
import {DriverState, OmnisharpClientStatus} from "../../enums";
import {RequestContext, ResponseContext, CommandContext} from "../../contexts";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {reference, makeObservable} from "../../helpers/decorators";

reference(ReactiveClientEvents.prototype, "events", "events");
reference(ReactiveClientEvents.prototype, "commands", "commands");
reference(ReactiveClientEvents.prototype, "state", "state");
reference(ReactiveClientEvents.prototype, "status", "status");
reference(ReactiveClientEvents.prototype, "requests", "requests");
reference(ReactiveClientEvents.prototype, "responses", "responses");
reference(ReactiveClientEvents.prototype, "errors", "errors");

makeObservable(ReactiveObservationClient.prototype, "events", "events");
makeObservable(ReactiveObservationClient.prototype, "commands", "commands");
makeObservable(ReactiveObservationClient.prototype, "state", "state");
makeObservable(ReactiveObservationClient.prototype, "status", "status");
makeObservable(ReactiveObservationClient.prototype, "requests", "requests");
makeObservable(ReactiveObservationClient.prototype, "responses", "responses");
makeObservable(ReactiveObservationClient.prototype, "errors", "errors");
makeObservable(ReactiveCombinationClient.prototype, "state", "state");
makeObservable(ReactiveCombinationClient.prototype, "status", "status");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents extends OmniSharp.Events {
        listen(path: "events"): Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        listen(path: "commands"): Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        listen(path: "state"): Observable<DriverState>;
        listen(path: "status"): Observable<OmnisharpClientStatus>;
        listen(path: "requests"): Observable<RequestContext<any>>;
        listen(path: "responses"): Observable<ResponseContext<any, any>>;
        listen(path: "errors"): Observable<CommandContext<any>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        /*readonly*/ commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        /*readonly*/ state: Observable<DriverState>;
        /*readonly*/ status: Observable<OmnisharpClientStatus>;
        /*readonly*/ requests: Observable<RequestContext<any>>;
        /*readonly*/ responses: Observable<ResponseContext<any, any>>;
        /*readonly*/ errors: Observable<CommandContext<any>>;
        listen(path: "events"): Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        listen(path: "commands"): Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        listen(path: "state"): Observable<DriverState>;
        listen(path: "status"): Observable<OmnisharpClientStatus>;
        listen(path: "requests"): Observable<RequestContext<any>>;
        listen(path: "responses"): Observable<ResponseContext<any, any>>;
        listen(path: "errors"): Observable<CommandContext<any>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ responses: Observable<OmniSharp.CombinationKey<DriverState>[]>;
        /*readonly*/ errors: Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]>;
        listen(path: "responses"): Observable<OmniSharp.CombinationKey<DriverState>[]>;
        listen(path: "errors"): Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]>;
    }
}
