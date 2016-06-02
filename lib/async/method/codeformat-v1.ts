import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {codeformat} from "../../helpers/preconditions";

request(AsyncClient.prototype, "codeformat", codeformat);

declare module "../async-client-base" {
    interface AsyncClient {
        codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.CodeFormatResponse>;
    }
}
