import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {signatureHelp} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "signatureHelp", signatureHelp);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.SignatureHelp>;
    }
}
