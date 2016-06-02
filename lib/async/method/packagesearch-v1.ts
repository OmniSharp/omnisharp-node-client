import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {packagesearch} from "../../helpers/preconditions";

request(AsyncClient.prototype, "packagesearch", packagesearch);

declare module "../async-client-base" {
    interface AsyncClient {
        packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.PackageSearchResponse>;
    }
}
