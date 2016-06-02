import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {packageversion} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "packageversion", packageversion);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        packageversion(request: OmniSharp.Models.PackageVersionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.PackageVersionResponse>;
    }
}
