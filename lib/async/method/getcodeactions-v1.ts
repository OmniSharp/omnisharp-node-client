import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {getcodeactions} from "../../helpers/preconditions";

request(AsyncClient.prototype, "getcodeactions", getcodeactions);

declare module "../async-client-base" {
    interface AsyncClient {
        getcodeactions(request: OmniSharp.Models.GetCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GetCodeActionsResponse>;
    }
}
