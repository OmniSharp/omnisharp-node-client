import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "updatebuffer");
merge(ReactiveObservationClient.prototype, "updatebuffer");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ updatebuffer: Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ updatebuffer: Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ updatebuffer: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.UpdateBufferRequest, any>>[]>;
    }
}

