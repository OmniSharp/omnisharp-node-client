import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {gotoregion} from "../../helpers/preconditions";

request(AsyncClient.prototype, "gotoregion", gotoregion);

declare module "../async-client-base" {
    interface AsyncClient {
        gotoregion(request: OmniSharp.Models.GotoRegionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    }
}
