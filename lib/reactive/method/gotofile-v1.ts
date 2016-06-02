import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {gotofile} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "gotofile", gotofile);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        gotofile(request: OmniSharp.Models.GotoFileRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFixResponse>;
    }
}
