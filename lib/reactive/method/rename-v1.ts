import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {rename} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "rename", rename);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RenameResponse>;
    }
}
