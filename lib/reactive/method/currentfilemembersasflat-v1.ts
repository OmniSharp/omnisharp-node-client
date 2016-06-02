import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {currentfilemembersasflat} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "currentfilemembersasflat", currentfilemembersasflat);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        currentfilemembersasflat(request: OmniSharp.Models.MembersFlatRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.QuickFix[]>;
    }
}
