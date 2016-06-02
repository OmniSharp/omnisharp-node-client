import * as OmniSharp from "../../omnisharp-server";
import {AsyncClient} from "../async-client-base";
import {request} from "../../helpers/decorators";
import {project} from "../../helpers/preconditions";

request(AsyncClient.prototype, "project", project);

declare module "../async-client-base" {
    interface AsyncClient {
        project(request: OmniSharp.Models.v1.ProjectInformationRequest, options?: OmniSharp.RequestOptions): Promise<OmniSharp.Models.ProjectInformationResponse>;
    }
}
