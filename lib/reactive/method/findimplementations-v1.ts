import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {findimplementations} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "findimplementations", findimplementations);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        findimplementations(request: OmniSharp.Models.FindImplementationsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    }
}
