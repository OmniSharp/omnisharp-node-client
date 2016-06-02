import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {gotodefinition} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "gotodefinition", gotodefinition);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        gotodefinition(request: OmniSharp.Models.GotoDefinitionRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.GotoDefinitionResponse>;
    }
}
