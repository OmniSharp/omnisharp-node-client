import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {metadata} from "../../helpers/preconditions";

request(AsyncClient.prototype, "metadata", metadata);

declare module "../async-client-base" {
    interface AsyncClient {
        metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.MetadataResponse>;
    }
}
