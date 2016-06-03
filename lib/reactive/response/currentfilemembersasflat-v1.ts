import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "currentfilemembersasflat");
merge(ReactiveObservationClient.prototype, "currentfilemembersasflat");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ currentfilemembersasflat: Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ currentfilemembersasflat: Observable<OmniSharp.Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ currentfilemembersasflat: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.MembersFlatRequest, OmniSharp.Models.QuickFix[]>>[]>;
    }
}

