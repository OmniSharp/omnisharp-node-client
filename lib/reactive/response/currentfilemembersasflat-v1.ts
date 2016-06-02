import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "currentfilemembersasflat");
merge(ReactiveObservationClient.prototype, "currentfilemembersasflat");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ currentfilemembersasflat: Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

