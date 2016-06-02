import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "projectAdded");
merge(ReactiveObservationClient.prototype, "projectAdded");
aggregate(ReactiveCombinationClient.prototype, "projectAdded");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ projectAdded: Observable<OmniSharp.Models.ProjectInformationResponse>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ projectAdded: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    }
}
