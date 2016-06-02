import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {findusages} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "findusages", findusages);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        findusages(request: OmniSharp.Models.FindUsagesRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    }
}
