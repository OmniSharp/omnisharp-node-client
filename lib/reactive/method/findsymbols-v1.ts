import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {findsymbols} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "findsymbols", findsymbols);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        findsymbols(request: OmniSharp.Models.FindSymbolsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    }
}
