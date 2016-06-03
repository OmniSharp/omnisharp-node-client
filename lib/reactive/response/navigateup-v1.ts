import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "navigateup");
merge(ReactiveObservationClient.prototype, "navigateup");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ navigateup: Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ navigateup: Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ navigateup: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>[]>;
    }
}

