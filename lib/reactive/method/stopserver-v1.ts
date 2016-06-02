import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {stopserver} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "stopserver", stopserver);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        stopserver(options?: OmniSharp.RequestOptions): Observable<boolean>;
    }
}
