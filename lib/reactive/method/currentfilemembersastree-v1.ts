import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {currentfilemembersastree} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "currentfilemembersastree", currentfilemembersastree);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        currentfilemembersastree(request: OmniSharp.Models.MembersTreeRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FileMemberTree>;
    }
}
