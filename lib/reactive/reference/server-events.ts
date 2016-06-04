import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import "../reactive-client-base";
import "../reactive-observation-client";
import "../reactive-combination-client";

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        listen(path: "projectAdded"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        listen(path: "projectChanged"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        listen(path: "projectRemoved"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        listen(path: "error"): Observable<OmniSharp.Models.ErrorMessage>;
        listen(path: "diagnostic"): Observable<OmniSharp.Models.DiagnosticMessage>;
        listen(path: "msBuildProjectDiagnostics"): Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
        listen(path: "packageRestoreStarted"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        listen(path: "packageRestoreFinished"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        listen(path: "unresolvedDependencies"): Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        listen(path: "projectAdded"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        listen(path: "projectChanged"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        listen(path: "projectRemoved"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        listen(path: "error"): Observable<OmniSharp.Models.ErrorMessage>;
        listen(path: "diagnostic"): Observable<OmniSharp.Models.DiagnosticMessage>;
        listen(path: "msBuildProjectDiagnostics"): Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
        listen(path: "packageRestoreStarted"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        listen(path: "packageRestoreFinished"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        listen(path: "unresolvedDependencies"): Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;
    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        listen(path: "projectAdded"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        listen(path: "projectChanged"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        listen(path: "projectRemoved"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        listen(path: "error"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
        listen(path: "diagnostic"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.DiagnosticMessage>[]>;
        listen(path: "msBuildProjectDiagnostics"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
        listen(path: "packageRestoreStarted"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        listen(path: "packageRestoreFinished"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        listen(path: "unresolvedDependencies"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;
    }
}
