import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "navigateup");
merge(ReactiveObservationClient.prototype, "navigateup");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ navigateup: Observable<OmniSharp.Context<OmniSharp.Models.NavigateUpRequest, OmniSharp.Models.NavigateResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

