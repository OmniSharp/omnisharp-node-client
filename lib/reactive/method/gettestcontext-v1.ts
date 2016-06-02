import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {gettestcontext} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "gettestcontext", gettestcontext);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        gettestcontext(request: OmniSharp.Models.TestCommandRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GetTestCommandResponse>;
    }
}
