import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {projects} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "projects", projects);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.WorkspaceInformationResponse>;
    }
}
