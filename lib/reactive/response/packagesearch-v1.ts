import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {response, merge} from "../../helpers/decorators";

response(ReactiveClientEvents.prototype, "packagesearch");
merge(ReactiveObservationClient.prototype, "packagesearch");

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        /*readonly*/ packagesearch: Observable<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        /*readonly*/ autocomplete: Observable<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>;
    }
}

