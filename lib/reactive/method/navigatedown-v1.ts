import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {navigatedown} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "navigatedown", navigatedown);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        navigatedown(request: OmniSharp.Models.NavigateDownRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.NavigateResponse>;
    }
}
