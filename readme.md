# omnisharp-node-client
The node client for [omnisharp-roslyn](https://github.com/OmniSharp/omnisharp-roslyn) is a unified way to interact with the roslyn server.

It currently offers the ability to connect to your local server over Stdio.  In the future more drivers can be added, to allow it to connect to the server over Http, Web Sockets, the cloud... anything really.  The current focus is covering the entire Api surface of roslyn with a strongly typed interface (for those typescript users out there).  This will allow anyone wanting to fire up an omnisharp server to be able to do so with easy.

## Used by
* [omnisharp-atom](https://github.com/OmniSharp/omnisharp-atom) <sup>soon(</sup>&trade;<sup>)</sup>

## Api
The api mimics the roslyn surface, with strongly typed methods for everything.  Under the covers we use [RxJS](https://github.com/Reactive-Extensions/RxJS) to handle our events.  Through the API we offer several streams of data, as well as several ways of data access.

For those that like promises, there is a promise API as well.

## Methods
 updatebuffer(request: OmniSharp.Models.Request): Rx.Observable&lt;any&gt;
  * updatebufferPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;any&gt;
  * observeUpdatebuffer: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, any&gt;&gt;
  * changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Rx.Observable&lt;any&gt;
  * changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest): Rx.IPromise&lt;any&gt;
  * observeChangebuffer: Rx.Observable&lt;Context&lt;OmniSharp.Models.ChangeBufferRequest, any&gt;&gt;
  * codecheck(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.QuickFixResponse&gt;
  * codecheckPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.QuickFixResponse&gt;
  * observeCodecheck: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse&gt;&gt;
  * formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.Observable&lt;OmniSharp.Models.FormatRangeResponse&gt;
  * formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Rx.IPromise&lt;OmniSharp.Models.FormatRangeResponse&gt;
  * observeFormatAfterKeystroke: Rx.Observable&lt;Context&lt;OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse&gt;&gt;
  * formatRange(request: OmniSharp.Models.FormatRangeRequest): Rx.Observable&lt;OmniSharp.Models.FormatRangeResponse&gt;
  * formatRangePromise(request: OmniSharp.Models.FormatRangeRequest): Rx.IPromise&lt;OmniSharp.Models.FormatRangeResponse&gt;
  * observeFormatRange: Rx.Observable&lt;Context&lt;OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse&gt;&gt;
  * codeformat(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.CodeFormatResponse&gt;
  * codeformatPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.CodeFormatResponse&gt;
  * observeCodeformat: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse&gt;&gt;
  * autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Rx.Observable&lt;OmniSharp.Models.AutoCompleteResponse[]&gt;
  * autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest): Rx.IPromise&lt;OmniSharp.Models.AutoCompleteResponse[]&gt;
  * observeAutocomplete: Rx.Observable&lt;Context&lt;OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]&gt;&gt;
  * findimplementations(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.QuickFixResponse&gt;
  * findimplementationsPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.QuickFixResponse&gt;
  * observeFindimplementations: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse&gt;&gt;
  * findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Rx.Observable&lt;OmniSharp.Models.QuickFixResponse&gt;
  * findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest): Rx.IPromise&lt;OmniSharp.Models.QuickFixResponse&gt;
  * observeFindsymbols: Rx.Observable&lt;Context&lt;OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse&gt;&gt;
  * findusages(request: OmniSharp.Models.FindUsagesRequest): Rx.Observable&lt;OmniSharp.Models.QuickFixResponse&gt;
  * findusagesPromise(request: OmniSharp.Models.FindUsagesRequest): Rx.IPromise&lt;OmniSharp.Models.QuickFixResponse&gt;
  * observeFindusages: Rx.Observable&lt;Context&lt;OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse&gt;&gt;
  * gotodefinition(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.GotoDefinitionResponse&gt;
  * gotodefinitionPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.GotoDefinitionResponse&gt;
  * observeGotodefinition: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.GotoDefinitionResponse&gt;&gt;
  * navigateup(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.NavigateResponse&gt;
  * navigateupPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.NavigateResponse&gt;
  * observeNavigateup: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse&gt;&gt;
  * navigatedown(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.NavigateResponse&gt;
  * navigatedownPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.NavigateResponse&gt;
  * observeNavigatedown: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse&gt;&gt;
  * rename(request: OmniSharp.Models.RenameRequest): Rx.Observable&lt;OmniSharp.Models.RenameResponse&gt;
  * renamePromise(request: OmniSharp.Models.RenameRequest): Rx.IPromise&lt;OmniSharp.Models.RenameResponse&gt;
  * observeRename: Rx.Observable&lt;Context&lt;OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse&gt;&gt;
  * signatureHelp(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.SignatureHelp&gt;
  * signatureHelpPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.SignatureHelp&gt;
  * observeSignatureHelp: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp&gt;&gt;
  * checkalivestatus(request: any): Rx.Observable&lt;boolean&gt;
  * checkalivestatusPromise(request: any): Rx.IPromise&lt;boolean&gt;
  * observeCheckalivestatus: Rx.Observable&lt;Context&lt;any, boolean&gt;&gt;
  * checkreadystatus(request: any): Rx.Observable&lt;boolean&gt;
  * checkreadystatusPromise(request: any): Rx.IPromise&lt;boolean&gt;
  * observeCheckreadystatus: Rx.Observable&lt;Context&lt;any, boolean&gt;&gt;
  * currentfilemembersastree(request: OmniSharp.Models.Request): Rx.Observable&lt;any&gt;
  * currentfilemembersastreePromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;any&gt;
  * observeCurrentfilemembersastree: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, any&gt;&gt;
  * currentfilemembersasflat(request: OmniSharp.Models.Request): Rx.Observable&lt;any&gt;
  * currentfilemembersasflatPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;any&gt;
  * observeCurrentfilemembersasflat: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, any&gt;&gt;
  * typelookup(request: OmniSharp.Models.TypeLookupRequest): Rx.Observable&lt;any&gt;
  * typelookupPromise(request: OmniSharp.Models.TypeLookupRequest): Rx.IPromise&lt;any&gt;
  * observeTypelookup: Rx.Observable&lt;Context&lt;OmniSharp.Models.TypeLookupRequest, any&gt;&gt;
  * filesChanged(request: OmniSharp.Models.Request[]): Rx.Observable&lt;boolean&gt;
  * filesChangedPromise(request: OmniSharp.Models.Request[]): Rx.IPromise&lt;boolean&gt;
  * observeFilesChanged: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request[], boolean&gt;&gt;
  * projects(request: any): Rx.Observable&lt;OmniSharp.Models.WorkspaceInformationResponse&gt;
  * projectsPromise(request: any): Rx.IPromise&lt;OmniSharp.Models.WorkspaceInformationResponse&gt;
  * observeProjects: Rx.Observable&lt;Context&lt;any, OmniSharp.Models.WorkspaceInformationResponse&gt;&gt;
  * project(request: OmniSharp.Models.Request): Rx.Observable&lt;OmniSharp.Models.ProjectInformationResponse&gt;
  * projectPromise(request: OmniSharp.Models.Request): Rx.IPromise&lt;OmniSharp.Models.ProjectInformationResponse&gt;
  * observeProject: Rx.Observable&lt;Context&lt;OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse&gt;&gt;
  * getcodeactions(request: OmniSharp.Models.CodeActionRequest): Rx.Observable&lt;OmniSharp.Models.GetCodeActionsResponse&gt;
  * getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise&lt;OmniSharp.Models.GetCodeActionsResponse&gt;
  * observeGetcodeactions: Rx.Observable&lt;Context&lt;OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse&gt;&gt;
  * runcodeaction(request: OmniSharp.Models.CodeActionRequest): Rx.Observable&lt;OmniSharp.Models.RunCodeActionResponse&gt;
  * runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest): Rx.IPromise&lt;OmniSharp.Models.RunCodeActionResponse&gt;
  * observeRuncodeaction: Rx.Observable&lt;Context&lt;OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse&gt;&gt;
  * gettestcontext(request: OmniSharp.Models.TestCommandRequest): Rx.Observable&lt;OmniSharp.Models.GetTestCommandResponse&gt;
  * gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest): Rx.IPromise&lt;OmniSharp.Models.GetTestCommandResponse&gt;
  * observeGettestcontext: Rx.Observable&lt;Context&lt;OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse&gt;&gt;
