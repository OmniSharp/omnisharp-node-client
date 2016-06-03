import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";
import {response, merge, aggregate} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "signatureHelp");
merge(ReactiveObservationClient.prototype, "signatureHelp");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ signatureHelp: Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ signatureHelp: Observable<OmniSharp.Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        /*readonly*/ signatureHelp: Observable<OmniSharp.CombinationKey<Context<OmniSharp.Models.SignatureHelpRequest, OmniSharp.Models.SignatureHelp>>[]>;
    }
}

