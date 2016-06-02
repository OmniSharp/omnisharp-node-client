import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {runcodeaction} from "../../helpers/preconditions";

request(AsyncClient.prototype, "runcodeaction", runcodeaction);

declare module "../async-client-base" {
    interface AsyncClient {
        runcodeaction(request: OmniSharp.Models.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.RunCodeActionResponse>;
    }
}
