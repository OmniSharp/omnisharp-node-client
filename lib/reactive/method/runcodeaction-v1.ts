import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {runcodeaction} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "runcodeaction", runcodeaction);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        runcodeaction(request: OmniSharp.Models.RunCodeActionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.RunCodeActionResponse>;
    }
}
