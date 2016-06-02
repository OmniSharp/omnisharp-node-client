import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {packageversion} from "../../helpers/preconditions";

request(AsyncClient.prototype, "packageversion", packageversion);

declare module "../async-client-base" {
    interface AsyncClient {
        packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageVersionResponse>;
    }
}
