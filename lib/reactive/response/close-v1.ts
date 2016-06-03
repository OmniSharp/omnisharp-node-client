import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "close");
merge(ReactiveObservationClient.prototype, "close");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ close: Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ close: Observable<OmniSharp.Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ close: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.FileCloseRequest, OmniSharp.Models.FileCloseResponse>>[]>;
    }
}

