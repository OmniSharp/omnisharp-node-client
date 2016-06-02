import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {fixusings} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "fixusings", fixusings);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FixUsingsResponse>;
    }
}
