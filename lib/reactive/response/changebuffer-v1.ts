import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "changebuffer");
merge(ReactiveObservationClient.prototype, "changebuffer");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ changebuffer: Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ changebuffer: Observable<OmniSharp.Context<OmniSharp.Models.ChangeBufferRequest, any>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ changebuffer: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.ChangeBufferRequest, any>>[]>;
    }
}

