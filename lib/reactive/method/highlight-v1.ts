import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {highlight} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "highlight", highlight);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.HighlightResponse>;
    }
}
