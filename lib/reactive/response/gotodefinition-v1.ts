import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "gotodefinition");
merge(ReactiveObservationClient.prototype, "gotodefinition");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ gotodefinition: Observable<OmniSharp.Context<OmniSharp.Models.GotoDefinitionRequest, OmniSharp.Models.GotoDefinitionResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

