import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {projects} from "../../helpers/preconditions";

request(AsyncClient.prototype, "projects", projects);

declare module "../async-client-base" {
    interface AsyncClient {
        projects(request: OmniSharp.Models.v1.WorkspaceInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.WorkspaceInformationResponse>;
    }
}
