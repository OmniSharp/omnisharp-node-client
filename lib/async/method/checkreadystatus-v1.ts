import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {checkreadystatus} from "../../helpers/preconditions";

request(AsyncClient.prototype, "checkreadystatus", checkreadystatus);

declare module "../async-client-base" {
    interface AsyncClient {
        checkreadystatus(options?: OmniSharp.RequestOptions): Promise<boolean>;
    }
}
