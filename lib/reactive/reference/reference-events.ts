import * as OmniSharp from "../../omnisharp-server";
import {DriverState, OmnisharpClientStatus} from "../../enums";
import {RequestContext, ResponseContext, CommandContext} from "../../contexts";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {reference, merge, aggregate} from "../../helpers/decorators";

reference(ReactiveClientEvents.prototype, "events");
reference(ReactiveClientEvents.prototype, "commands");
reference(ReactiveClientEvents.prototype, "state");
reference(ReactiveClientEvents.prototype, "status");
reference(ReactiveClientEvents.prototype, "requests");
reference(ReactiveClientEvents.prototype, "responses");
reference(ReactiveClientEvents.prototype, "errors");
merge(ReactiveObservationClient.prototype, "events");
merge(ReactiveObservationClient.prototype, "commands");
merge(ReactiveObservationClient.prototype, "state");
merge(ReactiveObservationClient.prototype, "status");
merge(ReactiveObservationClient.prototype, "requests");
merge(ReactiveObservationClient.prototype, "responses");
merge(ReactiveObservationClient.prototype, "errors");
aggregate(ReactiveCombinationClient.prototype, "state");
aggregate(ReactiveCombinationClient.prototype, "status");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        /*readonly*/ commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        /*readonly*/ state: Observable<DriverState>;
        /*readonly*/ status: Observable<OmnisharpClientStatus>;
        /*readonly*/ requests: Observable<RequestContext<any>>;
        /*readonly*/ responses: Observable<ResponseContext<any, any>>;
        /*readonly*/ errors: Observable<CommandContext<any>>;
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
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ state: Observable<OmniSharp.CombinationKey<DriverState>[]>;
        /*readonly*/ status: Observable<OmniSharp.CombinationKey<OmnisharpClientStatus>[]>;
    }
}
