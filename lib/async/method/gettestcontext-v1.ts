import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {gettestcontext} from "../../helpers/preconditions";

request(AsyncClient.prototype, "gettestcontext", gettestcontext);

declare module "../async-client-base" {
    interface AsyncClient {
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GetTestCommandResponse>;
    }
}
