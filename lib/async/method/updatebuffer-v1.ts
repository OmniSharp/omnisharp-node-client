import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {updatebuffer} from "../../helpers/preconditions";

request(AsyncClient.prototype, "updatebuffer", updatebuffer);

declare module "../async-client-base" {
    interface AsyncClient {
        updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Promise<any>;
    }
}
