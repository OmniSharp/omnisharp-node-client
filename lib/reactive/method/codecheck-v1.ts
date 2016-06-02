import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {codecheck} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "codecheck", codecheck);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        codecheck(request: OmniSharp.Models.CodeCheckRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    }
}
