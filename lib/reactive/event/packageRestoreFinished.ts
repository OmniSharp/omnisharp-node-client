import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "packageRestoreFinished");
merge(ReactiveObservationClient.prototype, "packageRestoreFinished");
aggregate(ReactiveCombinationClient.prototype, "packageRestoreFinished");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ packageRestoreFinished: Observable<OmniSharp.Models.PackageRestoreMessage>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ packageRestoreFinished: Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
    }
}
