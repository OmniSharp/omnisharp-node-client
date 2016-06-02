import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {autocomplete} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "autocomplete", autocomplete);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        autocomplete(request: OmniSharp.Models.AutoCompleteRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.AutoCompleteResponse[]>;
    }
}
