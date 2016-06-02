import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {stopserver} from "../../helpers/preconditions";

request(AsyncClient.prototype, "stopserver", stopserver);

declare module "../async-client-base" {
    interface AsyncClient {
        stopserver(options?: OmniSharp.RequestOptions): Promise<boolean>;
    }
}
