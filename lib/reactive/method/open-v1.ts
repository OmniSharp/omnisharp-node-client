import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {open} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "open", open);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        open(request: OmniSharp.Models.FileOpenRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileOpenResponse>;
    }
}
