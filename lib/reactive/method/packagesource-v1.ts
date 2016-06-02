import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {packagesource} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "packagesource", packagesource);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        packagesource(request: OmniSharp.Models.PackageSourceRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageSourceResponse>;
    }
}
