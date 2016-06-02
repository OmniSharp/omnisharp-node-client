import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "findusages");
merge(ReactiveObservationClient.prototype, "findusages");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ findusages: Observable<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

