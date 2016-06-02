import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {checkreadystatus} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "checkreadystatus", checkreadystatus);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        checkreadystatus(options?: OmniSharp.RequestOptions): Observable<boolean>;
    }
}
