import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "codecheck");
merge(ReactiveObservationClient.prototype, "codecheck");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ codecheck: Observable<OmniSharp.Context<OmniSharp.Models.V2.CodeCheckRequest, OmniSharp.Models.V2.CodeCheckResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

