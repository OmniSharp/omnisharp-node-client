import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {formatAfterKeystroke} from "../../helpers/preconditions";

request(AsyncClient.prototype, "formatAfterKeystroke", formatAfterKeystroke);

declare module "../async-client-base" {
    interface AsyncClient {
        formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
    }
}
