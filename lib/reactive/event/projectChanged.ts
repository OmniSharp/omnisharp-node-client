import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "projectChanged");
merge(ReactiveObservationClient.prototype, "projectChanged");
aggregate(ReactiveCombinationClient.prototype, "projectChanged");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ projectChanged: Observable<OmniSharp.Models.ProjectInformationResponse>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ projectChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
    }
}
