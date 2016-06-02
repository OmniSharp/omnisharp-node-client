import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {formatAfterKeystroke} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "formatAfterKeystroke", formatAfterKeystroke);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FormatRangeResponse>;
    }
}
