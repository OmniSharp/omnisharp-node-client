import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "diagnostic");
merge(ReactiveObservationClient.prototype, "diagnostic");
aggregate(ReactiveCombinationClient.prototype, "diagnostic");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ diagnostic: Observable<OmniSharp.Models.DiagnosticMessage>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ diagnostic: Observable<OmniSharp.Models.DiagnosticMessage>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ diagnostic: Observable<OmniSharp.CombinationKey<OmniSharp.Models.DiagnosticMessage>[]>;
    }
}
