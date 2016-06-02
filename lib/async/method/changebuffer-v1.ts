import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {changebuffer} from "../../helpers/preconditions";

request(AsyncClient.prototype, "changebuffer", changebuffer);

declare module "../async-client-base" {
    interface AsyncClient {
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
    }
}
