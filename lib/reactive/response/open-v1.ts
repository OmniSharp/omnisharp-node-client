import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "open");
merge(ReactiveObservationClient.prototype, "open");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ open: Observable<OmniSharp.Context<OmniSharp.Models.FileOpenRequest, OmniSharp.Models.FileOpenResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

