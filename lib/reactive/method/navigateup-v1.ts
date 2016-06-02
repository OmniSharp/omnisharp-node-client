import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {navigateup} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "navigateup", navigateup);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        navigateup(request: OmniSharp.Models.NavigateUpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
    }
}
