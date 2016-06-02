import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {signatureHelp} from "../../helpers/preconditions";

request(AsyncClient.prototype, "signatureHelp", signatureHelp);

declare module "../async-client-base" {
    interface AsyncClient {
        signatureHelp(request: OmniSharp.Models.SignatureHelpRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.SignatureHelp>;
    }
}
