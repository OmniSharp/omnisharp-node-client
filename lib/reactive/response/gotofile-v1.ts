import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "gotofile");
merge(ReactiveObservationClient.prototype, "gotofile");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ gotofile: Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ gotofile: Observable<OmniSharp.Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ gotofile: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.GotoFileRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    }
}

