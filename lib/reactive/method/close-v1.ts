import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {close} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "close", close);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        close(request: OmniSharp.Models.FileCloseRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileCloseResponse>;
    }
}
