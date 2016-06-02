import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {findimplementations} from "../../helpers/preconditions";

request(AsyncClient.prototype, "findimplementations", findimplementations);

declare module "../async-client-base" {
    interface AsyncClient {
        findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    }
}
