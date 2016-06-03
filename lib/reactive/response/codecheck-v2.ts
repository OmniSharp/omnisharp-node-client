import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "codecheck");
merge(ReactiveObservationClient.prototype, "codecheck");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ codecheck: Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ codecheck: Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ codecheck: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>[]>;
    }
}

