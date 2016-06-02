import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {metadata} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "metadata", metadata);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        metadata(request: OmniSharp.Models.MetadataRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.MetadataResponse>;
    }
}
