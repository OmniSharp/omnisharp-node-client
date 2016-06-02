import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "project");
merge(ReactiveObservationClient.prototype, "project");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ project: Observable<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

