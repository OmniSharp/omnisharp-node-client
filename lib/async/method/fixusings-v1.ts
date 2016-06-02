import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {fixusings} from "../../helpers/preconditions";

request(AsyncClient.prototype, "fixusings", fixusings);

declare module "../async-client-base" {
    interface AsyncClient {
        fixusings(request: OmniSharp.Models.FixUsingsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FixUsingsResponse>;
    }
}
