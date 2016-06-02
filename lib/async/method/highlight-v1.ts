import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {highlight} from "../../helpers/preconditions";

request(AsyncClient.prototype, "highlight", highlight);

declare module "../async-client-base" {
    interface AsyncClient {
        highlight(request: OmniSharp.Models.HighlightRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.HighlightResponse>;
    }
}
