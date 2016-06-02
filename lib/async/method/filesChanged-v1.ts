import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {filesChanged} from "../../helpers/preconditions";

request(AsyncClient.prototype, "filesChanged", filesChanged);

declare module "../async-client-base" {
    interface AsyncClient {
        filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FilesChangedResponse>;
    }
}
