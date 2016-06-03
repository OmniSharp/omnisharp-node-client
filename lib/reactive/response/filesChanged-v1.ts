import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "filesChanged");
merge(ReactiveObservationClient.prototype, "filesChanged");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ filesChanged: Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ filesChanged: Observable<OmniSharp.Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ filesChanged: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.Request[], OmniSharp.Models.FilesChangedResponse>>[]>;
    }
}

