import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {gotodefinition} from "../../helpers/preconditions";

request(AsyncClient.prototype, "gotodefinition", gotodefinition);

declare module "../async-client-base" {
    interface AsyncClient {
        gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.GotoDefinitionResponse>;
    }
}
