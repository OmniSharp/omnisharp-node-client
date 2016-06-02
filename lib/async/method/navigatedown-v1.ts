import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {navigatedown} from "../../helpers/preconditions";

request(AsyncClient.prototype, "navigatedown", navigatedown);

declare module "../async-client-base" {
    interface AsyncClient {
        navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.NavigateResponse>;
    }
}
