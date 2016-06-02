import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {codeformat} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "codeformat", codeformat);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        codeformat(request: OmniSharp.Models.CodeFormatRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.CodeFormatResponse>;
    }
}
