import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {packagesearch} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "packagesearch", packagesearch);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        packagesearch(request: OmniSharp.Models.PackageSearchRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSearchResponse>;
    }
}
