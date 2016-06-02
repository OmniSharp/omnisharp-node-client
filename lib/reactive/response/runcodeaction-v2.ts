import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "runcodeaction");
merge(ReactiveObservationClient.prototype, "runcodeaction");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ runcodeaction: Observable<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

