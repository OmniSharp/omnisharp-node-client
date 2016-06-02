import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {packagesource} from "../../helpers/preconditions";

request(AsyncClient.prototype, "packagesource", packagesource);

declare module "../async-client-base" {
    interface AsyncClient {
        packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSourceResponse>;
    }
}
