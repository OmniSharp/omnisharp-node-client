import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "gotoregion");
merge(ReactiveObservationClient.prototype, "gotoregion");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ gotoregion: Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ gotoregion: Observable<OmniSharp.Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ gotoregion: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.GotoRegionRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    }
}

