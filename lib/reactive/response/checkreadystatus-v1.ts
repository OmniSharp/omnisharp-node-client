import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "checkreadystatus");
merge(ReactiveObservationClient.prototype, "checkreadystatus");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ checkreadystatus: Observable<OmniSharp.Context<any, boolean>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ checkreadystatus: Observable<OmniSharp.Context<any, boolean>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ checkreadystatus: Observable<OmniSharp.CombinationKey<Context<any, boolean>>>;
    }
}

