import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {changebuffer} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "changebuffer", changebuffer);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        changebuffer(request: OmniSharp.Models.ChangeBufferRequest, options?: OmniSharp.RequestOptions): Observable<any>;
    }
}
