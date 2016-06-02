import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {open} from "../../helpers/preconditions";

request(AsyncClient.prototype, "open", open);

declare module "../async-client-base" {
    interface AsyncClient {
        open(request: OmniSharp.Models.FileOpenRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileOpenResponse>;
    }
}
