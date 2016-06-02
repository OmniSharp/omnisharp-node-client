import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {close} from "../../helpers/preconditions";

request(AsyncClient.prototype, "close", close);

declare module "../async-client-base" {
    interface AsyncClient {
        close(request: OmniSharp.Models.FileCloseRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileCloseResponse>;
    }
}
