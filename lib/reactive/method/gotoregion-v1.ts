import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {gotoregion} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "gotoregion", gotoregion);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    }
}
