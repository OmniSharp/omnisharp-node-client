import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "findimplementations");
merge(ReactiveObservationClient.prototype, "findimplementations");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ findimplementations: Observable<OmniSharp.Context<OmniSharp.Models.FindImplementationsRequest, OmniSharp.Models.QuickFixResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

