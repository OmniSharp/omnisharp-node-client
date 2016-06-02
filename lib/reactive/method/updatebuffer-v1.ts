import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {updatebuffer} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "updatebuffer", updatebuffer);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        updatebuffer(request: OmniSharp.Models.UpdateBufferRequest, options?: OmniSharp.RequestOptions): Observable<any>;
    }
}
