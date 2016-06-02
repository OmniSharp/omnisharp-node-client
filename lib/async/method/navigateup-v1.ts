import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {navigateup} from "../../helpers/preconditions";

request(AsyncClient.prototype, "navigateup", navigateup);

declare module "../async-client-base" {
    interface AsyncClient {
        navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
    }
}
