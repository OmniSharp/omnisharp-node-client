import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {codecheck} from "../../helpers/preconditions";

request(AsyncClient.prototype, "codecheck", codecheck);

declare module "../async-client-base" {
    interface AsyncClient {
        codecheck(request: OmniSharp.Models.V2.CodeCheckRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.V2.CodeCheckResponse>;
    }
}
