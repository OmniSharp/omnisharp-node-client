import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {filesChanged} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "filesChanged", filesChanged);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        filesChanged(request: OmniSharp.Models.Request[], options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.FilesChangedResponse>;
    }
}
