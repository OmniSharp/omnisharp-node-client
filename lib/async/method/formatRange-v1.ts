import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {formatRange} from "../../helpers/preconditions";

request(AsyncClient.prototype, "formatRange", formatRange);

declare module "../async-client-base" {
    interface AsyncClient {
        formatRange(request: OmniSharp.Models.FormatRangeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FormatRangeResponse>;
    }
}
