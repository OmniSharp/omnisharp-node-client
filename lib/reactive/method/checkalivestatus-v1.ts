import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {checkalivestatus} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "checkalivestatus", checkalivestatus);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        checkalivestatus(options?: OmniSharp.RequestOptions): Observable<boolean>;
    }
}
