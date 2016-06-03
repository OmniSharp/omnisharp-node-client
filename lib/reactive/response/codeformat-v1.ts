import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "codeformat");
merge(ReactiveObservationClient.prototype, "codeformat");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ codeformat: Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ codeformat: Observable<OmniSharp.Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ codeformat: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.CodeFormatRequest, OmniSharp.Models.CodeFormatResponse>>[]>;
    }
}

