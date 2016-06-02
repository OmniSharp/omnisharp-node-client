import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {getcodeactions} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "getcodeactions", getcodeactions);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
    }
}
