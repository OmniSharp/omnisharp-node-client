# omnisharp-node-client
The node client for [omnisharp-roslyn](https://github.com/OmniSharp/omnisharp-roslyn) is a unified way to interact with the roslyn server.

It currently offers the ability to connect to your local server over Stdio.  In the future more drivers can be added, to allow it to connect to the server over Http, Web Sockets, the cloud... anything really.  The current focus is covering the entire Api surface of roslyn with a strongly typed interface (for those typescript users out there).  This will allow anyone wanting to fire up an omnisharp server to be able to do so with easy.

## Used by
* [omnisharp-atom](https://github.com/OmniSharp/omnisharp-atom) <sup>soon(</sup>&trade;<sup>)</sup>

## Api
The api mimics the roslyn surface, with strongly typed methods for everything.  Under the covers we use [RxJS](https://github.com/Reactive-Extensions/RxJS) to handle our events.  Through the API we offer several streams of data, as well as several ways of data access.

For those that like promises, there is a promise API as well.

## Methods
  * `updatebuffer(request: OmniSharp.Models.Request): Rx.Observable<any>`
  * `updatebufferPromise(request: OmniSharp.Models.Request): Rx.IPromise<any>`
  * `changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Rx.Observable<any>`
  * `changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest): Rx.IPromise<any>`
  * `codecheck(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>`
  * `codecheckPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>`
  * `formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>`
  * `formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>`
  * `formatRange(request: OmniSharp.Models.FormatRangeRequest): Rx.Observable<OmniSharp.Models.FormatRangeResponse>`
  * `formatRangePromise(request: OmniSharp.Models.FormatRangeRequest): Rx.IPromise<OmniSharp.Models.FormatRangeResponse>`
  * `codeformat(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.CodeFormatResponse>`
  * `codeformatPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.CodeFormatResponse>`
  * `autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Rx.Observable<OmniSharp.Models.AutoCompleteResponse[]>`
  * `autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest): Rx.IPromise<OmniSharp.Models.AutoCompleteResponse[]>`
  * `findimplementations(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.QuickFixResponse>`
  * `findimplementationsPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.QuickFixResponse>`
  * `findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>`
  * `findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest): Rx.IPromise<OmniSharp.Models.QuickFixResponse>`
  * `findusages(request: OmniSharp.Models.FindUsagesRequest): Rx.Observable<OmniSharp.Models.QuickFixResponse>`
  * `findusagesPromise(request: OmniSharp.Models.FindUsagesRequest): Rx.IPromise<OmniSharp.Models.QuickFixResponse>`
  * `gotodefinition(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.GotoDefinitionResponse>`
  * `gotodefinitionPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.GotoDefinitionResponse>`
  * `navigateup(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>`
  * `navigateupPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.NavigateResponse>`
  * `navigatedown(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.NavigateResponse>`
  * `navigatedownPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.NavigateResponse>`
  * `rename(request: OmniSharp.Models.RenameRequest): Rx.Observable<OmniSharp.Models.RenameResponse>`
  * `renamePromise(request: OmniSharp.Models.RenameRequest): Rx.IPromise<OmniSharp.Models.RenameResponse>`
  * `signatureHelp(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.SignatureHelp>`
  * `signatureHelpPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.SignatureHelp>`
  * `checkalivestatus(request: any): Rx.Observable<boolean>`
  * `checkalivestatusPromise(request: any): Rx.IPromise<boolean>`
  * `checkreadystatus(request: any): Rx.Observable<boolean>`
  * `checkreadystatusPromise(request: any): Rx.IPromise<boolean>`
  * `currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable<any>`
  * `currentfilemembersastreePromise(request: OmniSharp.Models.Request): Rx.IPromise<any>`
  * `currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable<any>`
  * `currentfilemembersasflatPromise(request: OmniSharp.Models.Request): Rx.IPromise<any>`
  * `typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable<any>`
  * `typelookupPromise(request: OmniSharp.Models.TypeLookupRequest): Rx.IPromise<any>`
  * `filesChanged(request: OmniSharp.Models.Request[]): Rx.Observable<boolean>`
  * `filesChangedPromise(request: OmniSharp.Models.Request[]): Rx.IPromise<boolean>`
  * `projects(request: any): Rx.Observable<OmniSharp.Models.WorkspaceInformationResponse>`
  * `projectsPromise(request: any): Rx.IPromise<OmniSharp.Models.WorkspaceInformationResponse>`
  * `project(request: OmniSharp.Models.Request): Rx.Observable<OmniSharp.Models.ProjectInformationResponse>`
  * `projectPromise(request: OmniSharp.Models.Request): Rx.IPromise<OmniSharp.Models.ProjectInformationResponse>`
  * `getcodeactions(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.GetCodeActionsResponse>`
  * `getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<OmniSharp.Models.GetCodeActionsResponse>`
  * `runcodeaction(request: OmniSharp.Models.CodeActionRequest): Rx.Observable<OmniSharp.Models.RunCodeActionResponse>`
  * `runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise<OmniSharp.Models.RunCodeActionResponse>`
  * `gettestcontext(request: OmniSharp.Models.TestCommandRequest): Rx.Observable<OmniSharp.Models.GetTestCommandResponse>`
  * `gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest): Rx.IPromise<OmniSharp.Models.GetTestCommandResponse>`

## Observables
  * ``events: Rx.Observable<OmniSharp.Stdio.Protocol.EventPacket>``
    Listen to all events sent from the server.  These are generally log messages, but not always.
  * `commands: Rx.Observable<OmniSharp.Stdio.Protocol.ResponsePacket>`
    Listen to all the responses sent from the server.
  * `state: Rx.Observable<DriverState>`
    Listen to state changes in the client.  This goes from Disconnected -> Connecting -> Connected
  * `status: Rx.Observable<OmnisharpClientStatus>`
    Listen to the server state, this contains fields such as requests and responses per second, outstanding requests, and maybe more in the future.
  * `requests: Rx.Observable<RequestWrapper<any>>`
    Listen to all outbound requests from the client to the server.
  * `responses: Rx.Observable<ResponseWrapper<any, any>>`
    Listen to all returned requests from the server to the client.  This also includes the original request, so you can use that information for processing.
  * `errors: Rx.Observable<CommandWrapper<any>>`
    Stream of any errors from the server
  * `observeUpdatebuffer: Rx.Observable<Context<OmniSharp.Models.Request, any>>`
  * `observeChangebuffer: Rx.Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>`
  * `observeCodecheck: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>`
  * `observeFormatAfterKeystroke: Rx.Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>`
  * `observeFormatRange: Rx.Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>`
  * `observeCodeformat: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>`
  * `observeAutocomplete: Rx.Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>`
  * `observeFindimplementations: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>`
  * `observeFindsymbols: Rx.Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>`
  * `observeFindusages: Rx.Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>`
  * `observeGotodefinition: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.GotoDefinitionResponse>>`
  * `observeNavigateup: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>`
  * `observeNavigatedown: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>`
  * `observeRename: Rx.Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>`
  * `observeSignatureHelp: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>`
  * `observeCheckalivestatus: Rx.Observable<Context<any, boolean>>`
  * `observeCheckreadystatus: Rx.Observable<Context<any, boolean>>`
  * `observeCurrentfilemembersastree: Rx.Observable<Context<OmniSharp.Models.Request, any>>`
  * `observeCurrentfilemembersasflat: Rx.Observable<Context<OmniSharp.Models.Request, any>>`
  * `observeTypelookup: Rx.Observable<Context<OmniSharp.Models.TypeLookupRequest, any>>`
  * `observeFilesChanged: Rx.Observable<Context<OmniSharp.Models.Request[], boolean>>`
  * `observeProjects: Rx.Observable<Context<any, OmniSharp.Models.WorkspaceInformationResponse>>`
  * `observeProject: Rx.Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>`
  * `observeGetcodeactions: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>`
  * `observeRuncodeaction: Rx.Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>`
  * `observeGettestcontext: Rx.Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>`
