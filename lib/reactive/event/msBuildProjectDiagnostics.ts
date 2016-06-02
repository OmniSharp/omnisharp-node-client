import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {event, merge, aggregate} from "../../helpers/decorators";

event(ReactiveClientEvents.prototype, "msBuildProjectDiagnostics");
merge(ReactiveObservationClient.prototype, "msBuildProjectDiagnostics");
aggregate(ReactiveCombinationClient.prototype, "msBuildProjectDiagnostics");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ msBuildProjectDiagnostics: Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ msBuildProjectDiagnostics: Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
    }
}
