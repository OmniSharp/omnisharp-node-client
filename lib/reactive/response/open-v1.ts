import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "open");
merge(ReactiveObservationClient.prototype, "open");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ open: Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ open: Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ open: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>[]>;
    }
}

