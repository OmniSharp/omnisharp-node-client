import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {formatRange} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "formatRange", formatRange);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
    }
}
