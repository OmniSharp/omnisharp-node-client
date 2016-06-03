import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClientEvents} from "../reactive-client-base";
import {ReactiveObservationClient} from "../reactive-observation-client";
import {ReactiveCombinationClient} from "../reactive-combination-client";

declare module "../reactive-client-base" {
    interface ReactiveClientEvents {
        observe(path: "/projectAdded"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        observe(path: "/projectChanged"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        observe(path: "/projectRemoved"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        observe(path: "/error"): Observable<OmniSharp.Models.ErrorMessage>;
        observe(path: "/diagnostic"): Observable<OmniSharp.Models.DiagnosticMessage>;
        observe(path: "/msBuildProjectDiagnostics"): Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
        observe(path: "/packageRestoreStarted"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        observe(path: "/packageRestoreFinished"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        observe(path: "/unresolvedDependencies"): Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;

    }
}

declare module "../reactive-observation-client" {
    interface ReactiveObservationClient {
        observe(path: "/projectAdded"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        observe(path: "/projectChanged"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        observe(path: "/projectRemoved"): Observable<OmniSharp.Models.ProjectInformationResponse>;
        observe(path: "/error"): Observable<OmniSharp.Models.ErrorMessage>;
        observe(path: "/diagnostic"): Observable<OmniSharp.Models.DiagnosticMessage>;
        observe(path: "/msBuildProjectDiagnostics"): Observable<OmniSharp.Models.MSBuildProjectDiagnostics>;
        observe(path: "/packageRestoreStarted"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        observe(path: "/packageRestoreFinished"): Observable<OmniSharp.Models.PackageRestoreMessage>;
        observe(path: "/unresolvedDependencies"): Observable<OmniSharp.Models.UnresolvedDependenciesMessage>;

    }
}

declare module "../reactive-combination-client" {
    interface ReactiveCombinationClient {
        observe(path: "/projectAdded"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        observe(path: "/projectChanged"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        observe(path: "/projectRemoved"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ProjectInformationResponse>[]>;
        observe(path: "/error"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.ErrorMessage>[]>;
        observe(path: "/diagnostic"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.DiagnosticMessage>[]>;
        observe(path: "/msBuildProjectDiagnostics"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.MSBuildProjectDiagnostics>[]>;
        observe(path: "/packageRestoreStarted"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        observe(path: "/packageRestoreFinished"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.PackageRestoreMessage>[]>;
        observe(path: "/unresolvedDependencies"): Observable<OmniSharp.CombinationKey<OmniSharp.Models.UnresolvedDependenciesMessage>[]>;

    }
}
