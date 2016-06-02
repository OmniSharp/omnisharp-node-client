import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {findsymbols} from "../../helpers/preconditions";

request(AsyncClient.prototype, "findsymbols", findsymbols);

declare module "../async-client-base" {
    interface AsyncClient {
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFixResponse>;
    }
}
