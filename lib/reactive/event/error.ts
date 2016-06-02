import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "error");
merge(ReactiveObservationClient.prototype, "error");
aggregate(ReactiveCombinationClient.prototype, "error");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ error: Observable<OmniSharp.Models.ErrorMessage>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ error: Observable<OmniSharp.Models.ErrorMessage>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ error: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
    }
}
