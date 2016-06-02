import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {typelookup} from "../../helpers/preconditions";

request(AsyncClient.prototype, "typelookup", typelookup);

declare module "../async-client-base" {
    interface AsyncClient {
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.TypeLookupResponse>;
    }
}
