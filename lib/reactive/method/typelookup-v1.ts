import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {typelookup} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "typelookup", typelookup);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        typelookup(request: OmniSharp.Models.TypeLookupRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.TypeLookupResponse>;
    }
}
