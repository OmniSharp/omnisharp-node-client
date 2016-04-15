import {merge} from "../helpers/decorators";
import {ReplaySubject, Observable} from "rxjs";
import {CompositeDisposable, Disposable, IDisposable} from "../disposables";
import _ from "lodash";
import {DriverState} from "../enums";
import {OmnisharpClientStatus} from "../enums";
import {RequestContext, ResponseContext, CommandContext} from "../contexts";
import OmniSharp, {Models, Context} from "../omnisharp-server";
import {ReactiveClient} from "./reactive-client";

export class ReactiveObservationClient implements OmniSharp.Events, OmniSharp.Events.V2, IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientDisposable = new CompositeDisposable();
    protected _clientsSubject = new ReplaySubject<ReactiveClient[]>(1);

    @merge public get projectAdded(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @merge public get projectChanged(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @merge public get projectRemoved(): Observable<OmniSharp.Models.ProjectInformationResponse> { throw new Error("Implemented by decorator"); }
    @merge public get error(): Observable<OmniSharp.Models.ErrorMessage> { throw new Error("Implemented by decorator"); }
    @merge public get msBuildProjectDiagnostics(): Observable<OmniSharp.Models.MSBuildProjectDiagnostics> { throw new Error("Implemented by decorator"); }
    @merge public get packageRestoreStarted(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @merge public get packageRestoreFinished(): Observable<OmniSharp.Models.PackageRestoreMessage> { throw new Error("Implemented by decorator"); }
    @merge public get unresolvedDependencies(): Observable<OmniSharp.Models.UnresolvedDependenciesMessage> { throw new Error("Implemented by decorator"); }

    @merge public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { throw new Error("Implemented by decorator"); }
    @merge public get commands(): Observable<OmniSharp.Stdio.Protocol.ResponsePacket> { throw new Error("Implemented by decorator"); }
    @merge public get state(): Observable<DriverState> { throw new Error("Implemented by decorator"); }
    @merge public get status(): Observable<OmnisharpClientStatus> { throw new Error("Implemented by decorator"); }
    @merge public get requests(): Observable<RequestContext<any>> { throw new Error("Implemented by decorator"); }
    @merge public get responses(): Observable<ResponseContext<any, any>> { throw new Error("Implemented by decorator"); }
    @merge public get errors(): Observable<CommandContext<any>> { throw new Error("Implemented by decorator"); }

    constructor(private clients: ReactiveClient[] = []) {
        this.next();
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) return;
        this._disposable.dispose();
    }

    protected makeMergeObserable = <T>(selector: (client: ReactiveClient) => Observable<T>) => {
        return this._clientsSubject.switchMap(clients => Observable.merge<T>(...clients.map(selector))).share();
    };

    public observe<T>(selector: (client: ReactiveClient) => Observable<T>) {
        return this.makeMergeObserable(selector);
    }

    private next = () => this._clientsSubject.next(this.clients.slice());

    public add(client: ReactiveClient) {
        this.clients.push(client);
        this.next();
        const d = Disposable.create(() => {
            _.pull(this.clients, client);
            this.next();
        });
        this._clientDisposable.add(d);
        return d;
    }

    @merge public get autocomplete(): Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>> { throw new Error("Implemented by decorator"); }
    @merge public get changebuffer(): Observable<Context<Models.ChangeBufferRequest, any>> { throw new Error("Implemented by decorator"); }
    @merge public get codecheck(): Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get codeformat(): Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get currentfilemembersasflat(): Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>> { throw new Error("Implemented by decorator"); }
    @merge public get currentfilemembersastree(): Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>> { throw new Error("Implemented by decorator"); }
    @merge public get filesChanged(): Observable<Context<Models.Request[], Models.FilesChangedResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get findimplementations(): Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get findsymbols(): Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get findusages(): Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get fixusings(): Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get formatAfterKeystroke(): Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get formatRange(): Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get getcodeactions(): Observable<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get gettestcontext(): Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get gotodefinition(): Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get gotofile(): Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get gotoregion(): Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get highlight(): Observable<Context<Models.HighlightRequest, Models.HighlightResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get metadata(): Observable<Context<Models.MetadataRequest, Models.MetadataResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get navigatedown(): Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get navigateup(): Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get packagesearch(): Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get packagesource(): Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get packageversion(): Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get project(): Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get projects(): Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get rename(): Observable<Context<Models.RenameRequest, Models.RenameResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get runcodeaction(): Observable<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get signatureHelp(): Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>> { throw new Error("Implemented by decorator"); }
    @merge public get typelookup(): Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>> { throw new Error("Implemented by decorator"); }
    @merge public get updatebuffer(): Observable<Context<Models.UpdateBufferRequest, any>> { throw new Error("Implemented by decorator"); }
}
