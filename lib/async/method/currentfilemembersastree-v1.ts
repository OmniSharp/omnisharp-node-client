import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {currentfilemembersastree} from "../../helpers/preconditions";

request(AsyncClient.prototype, "currentfilemembersastree", currentfilemembersastree);

declare module "../async-client-base" {
    interface AsyncClient {
        currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.FileMemberTree>;
    }
}
