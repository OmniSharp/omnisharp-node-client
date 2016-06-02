import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {checkalivestatus} from "../../helpers/preconditions";

request(AsyncClient.prototype, "checkalivestatus", checkalivestatus);

declare module "../async-client-base" {
    interface AsyncClient {
        checkalivestatus(options?: OmniSharp.RequestOptions): Promise<boolean>;
    }
}
