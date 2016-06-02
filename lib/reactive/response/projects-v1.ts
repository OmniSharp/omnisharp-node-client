import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "projects");
merge(ReactiveObservationClient.prototype, "projects");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ projects: Observable<OmniSharp.Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

