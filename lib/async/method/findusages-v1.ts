import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {findusages} from "../../helpers/preconditions";

request(AsyncClient.prototype, "findusages", findusages);

declare module "../async-client-base" {
    interface AsyncClient {
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    }
}
