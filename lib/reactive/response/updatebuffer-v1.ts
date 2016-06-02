import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "updatebuffer");
merge(ReactiveObservationClient.prototype, "updatebuffer");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ updatebuffer: Observable<OmniSharp.Context<OmniSharp.Models.UpdateBufferRequest, any>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

