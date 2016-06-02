import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {request} from "../../helpers/decorators";
import {project} from "../../helpers/preconditions";

request(ReactiveClient.prototype, "project", project);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.ProjectInformationResponse>;
    }
}
