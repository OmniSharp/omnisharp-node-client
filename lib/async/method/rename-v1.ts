import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {rename} from "../../helpers/preconditions";

request(AsyncClient.prototype, "rename", rename);

declare module "../async-client-base" {
    interface AsyncClient {
        rename(request: OmniSharp.Models.RenameRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.RenameResponse>;
    }
}
