import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {currentfilemembersasflat} from "../../helpers/preconditions";

request(AsyncClient.prototype, "currentfilemembersasflat", currentfilemembersasflat);

declare module "../async-client-base" {
    interface AsyncClient {
        currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.QuickFix[]>;
    }
}
