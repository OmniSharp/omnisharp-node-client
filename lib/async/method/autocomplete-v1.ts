import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {autocomplete} from "../../helpers/preconditions";

request(AsyncClient.prototype, "autocomplete", autocomplete);

declare module "../async-client-base" {
    interface AsyncClient {
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.AutoCompleteResponse[]>;
    }
}
