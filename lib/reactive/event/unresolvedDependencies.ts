import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "unresolvedDependencies");
merge(ReactiveObservationClient.prototype, "unresolvedDependencies");
aggregate(ReactiveCombinationClient.prototype, "unresolvedDependencies");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ unresolvedDependencies: Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ unresolvedDependencies: Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;
    }
}
