import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "packageRestoreStarted");
merge(ReactiveObservationClient.prototype, "packageRestoreStarted");
aggregate(ReactiveCombinationClient.prototype, "packageRestoreStarted");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ packageRestoreStarted: Observable<OmniSharp.Models.PackageRestoreMessage>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ packageRestoreStarted: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    }
}
