import {ReplaySubject, Observable, CompositeDisposable} from "rx";
import * as _ from 'lodash';
import {ClientV1} from "./client-v1";
import {ClientV2} from "./client-v2";
import {ObservationClientV1} from "./composite-client-v1";
import {ObservationClientBase, CombinationClientBase} from "./composite-client-base";

export class ObservationClientV2<T extends ClientV2> extends ObservationClientBase<T> implements OmniSharp.Events.V2 {
    public v1: ObservationClientV1<ClientV1>;
    public observeUpdatebuffer: typeof ClientV2.prototype.observeUpdatebuffer;
    public observeChangebuffer: typeof ClientV2.prototype.observeChangebuffer;
    public observeCodecheck: typeof ClientV2.prototype.observeCodecheck;
    public observeFormatAfterKeystroke: typeof ClientV2.prototype.observeFormatAfterKeystroke;
    public observeFormatRange: typeof ClientV2.prototype.observeFormatRange;
    public observeCodeformat: typeof ClientV2.prototype.observeCodeformat;
    public observeAutocomplete: typeof ClientV2.prototype.observeAutocomplete;
    public observeFindimplementations: typeof ClientV2.prototype.observeFindimplementations;
    public observeFindsymbols: typeof ClientV2.prototype.observeFindsymbols;
    public observeFindusages: typeof ClientV2.prototype.observeFindusages;
    public observeGotodefinition: typeof ClientV2.prototype.observeGotodefinition;
    public observeGotofile: typeof ClientV2.prototype.observeGotofile;
    public observeGotoregion: typeof ClientV2.prototype.observeGotoregion;
    public observeHighlight: typeof ClientV2.prototype.observeHighlight;
    public observeNavigateup: typeof ClientV2.prototype.observeNavigateup;
    public observeNavigatedown: typeof ClientV2.prototype.observeNavigatedown;
    public observePackagesearch: typeof ClientV2.prototype.observePackagesearch;
    public observePackagesource: typeof ClientV1.prototype.observePackagesource;
    public observePackageversion: typeof ClientV2.prototype.observePackageversion;
    public observeRename: typeof ClientV2.prototype.observeRename;
    public observeSignatureHelp: typeof ClientV2.prototype.observeSignatureHelp;
    public observeCheckalivestatus: typeof ClientV2.prototype.observeCheckalivestatus;
    public observeCheckreadystatus: typeof ClientV2.prototype.observeCheckreadystatus;
    public observeCurrentfilemembersastree: typeof ClientV2.prototype.observeCurrentfilemembersastree;
    public observeCurrentfilemembersasflat: typeof ClientV2.prototype.observeCurrentfilemembersasflat;
    public observeTypelookup: typeof ClientV2.prototype.observeTypelookup;
    public observeFilesChanged: typeof ClientV2.prototype.observeFilesChanged;
    public observeProjects: typeof ClientV2.prototype.observeProjects;
    public observeProject: typeof ClientV2.prototype.observeProject;
    public observeGetcodeactions: typeof ClientV2.prototype.observeGetcodeactions;
    public observeRuncodeaction: typeof ClientV2.prototype.observeRuncodeaction;
    public observeGettestcontext: typeof ClientV2.prototype.observeGettestcontext;

    constructor(clients: T[] = []) {
        super(clients);

        this.v1 = new ObservationClientV1(clients.map(z => z.v1));

        this.observeUpdatebuffer = this.makeMergeObserable(client => client.observeUpdatebuffer);
        this.observeChangebuffer = this.makeMergeObserable(client => client.observeChangebuffer);
        this.observeCodecheck = this.makeMergeObserable(client => client.observeCodecheck);
        this.observeFormatAfterKeystroke = this.makeMergeObserable(client => client.observeFormatAfterKeystroke);
        this.observeFormatRange = this.makeMergeObserable(client => client.observeFormatRange);
        this.observeCodeformat = this.makeMergeObserable(client => client.observeCodeformat);
        this.observeAutocomplete = this.makeMergeObserable(client => client.observeAutocomplete);
        this.observeFindimplementations = this.makeMergeObserable(client => client.observeFindimplementations);
        this.observeFindsymbols = this.makeMergeObserable(client => client.observeFindsymbols);
        this.observeFindusages = this.makeMergeObserable(client => client.observeFindusages);
        this.observeGotodefinition = this.makeMergeObserable(client => client.observeGotodefinition);
        this.observeGotofile = this.makeMergeObserable(client => client.observeGotofile);
        this.observeGotoregion = this.makeMergeObserable(client => client.observeGotoregion);
        this.observeHighlight = this.makeMergeObserable(client => client.observeHighlight);
        this.observeNavigateup = this.makeMergeObserable(client => client.observeNavigateup);
        this.observeNavigatedown = this.makeMergeObserable(client => client.observeNavigatedown);
        this.observePackagesearch = this.makeMergeObserable(client => client.observePackagesearch);
        this.observePackagesource = this.makeMergeObserable(client => client.observePackagesource);
        this.observePackageversion = this.makeMergeObserable(client => client.observePackageversion);
        this.observeRename = this.makeMergeObserable(client => client.observeRename);
        this.observeSignatureHelp = this.makeMergeObserable(client => client.observeSignatureHelp);
        this.observeCheckalivestatus = this.makeMergeObserable(client => client.observeCheckalivestatus);
        this.observeCheckreadystatus = this.makeMergeObserable(client => client.observeCheckreadystatus);
        this.observeCurrentfilemembersastree = this.makeMergeObserable(client => client.observeCurrentfilemembersastree);
        this.observeCurrentfilemembersasflat = this.makeMergeObserable(client => client.observeCurrentfilemembersasflat);
        this.observeTypelookup = this.makeMergeObserable(client => client.observeTypelookup);
        this.observeFilesChanged = this.makeMergeObserable(client => client.observeFilesChanged);
        this.observeProjects = this.makeMergeObserable(client => client.observeProjects);
        this.observeProject = this.makeMergeObserable(client => client.observeProject);
        this.observeGetcodeactions = this.makeMergeObserable(client => client.observeGetcodeactions);
        this.observeRuncodeaction = this.makeMergeObserable(client => client.observeRuncodeaction);
        this.observeGettestcontext = this.makeMergeObserable(client => client.observeGettestcontext);
    }
}

export class CombinationClientV2<T extends ClientV2> extends CombinationClientBase<T> implements OmniSharp.Events.Aggregate.V2 {
    public observeUpdatebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, any>>[]>;
    public observeChangebuffer: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, any>>[]>;
    public observeCodecheck: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeFormatAfterKeystroke: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FormatRangeResponse>>[]>;
    public observeFormatRange: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>[]>;
    public observeCodeformat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>[]>;
    public observeAutocomplete: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>[]>;
    public observeFindimplementations: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeFindsymbols: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeFindusages: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeGotodefinition: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.GotoDefinitionResponse>>[]>;
    public observeGotofile: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeGotoregion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>[]>;
    public observeHighlight: Rx.Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.HighlightRequest, OmniSharp.Models.HighlightResponse>>[]>;
    public observeNavigateup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    public observeNavigatedown: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>[]>;
    public observePackagesearch: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSearchRequest, OmniSharp.Models.PackageSearchResponse>>[]>;
    public observePackagesource: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageSourceRequest, OmniSharp.Models.PackageSourceResponse>>[]>;
    public observePackageversion: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.PackageVersionRequest, OmniSharp.Models.PackageVersionResponse>>[]>;
    public observeRename: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>[]>;
    public observeSignatureHelp: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>[]>;
    public observeCheckalivestatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    public observeCheckreadystatus: Observable<OmniSharp.CombinationKey<OmniSharp.Context<any, boolean>>[]>;
    public observeCurrentfilemembersastree: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.FileMemberTree>>[]>;
    public observeCurrentfilemembersasflat: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFix[]>>[]>;
    public observeTypelookup: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TypeLookupRequest, OmniSharp.Models.TypeLookupResponse>>[]>;
    public observeFilesChanged: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request[], boolean>>[]>;
    public observeProjects: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>[]>;
    public observeProject: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.Request, OmniSharp.Models.ProjectInformationResponse>>[]>;
    public observeGetcodeactions: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.GetCodeActionsRequest, OmniSharp.Models.V2.GetCodeActionsResponse>>[]>;
    public observeRuncodeaction: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.V2.RunCodeActionRequest, OmniSharp.Models.V2.RunCodeActionResponse>>[]>;
    public observeGettestcontext: Observable<OmniSharp.CombinationKey<OmniSharp.Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>[]>;

    constructor(clients: T[] = []) {
        super(clients);

        this.observeUpdatebuffer = this.makeCombineObserable(client => client.observeUpdatebuffer);
        this.observeChangebuffer = this.makeCombineObserable(client => client.observeChangebuffer);
        this.observeCodecheck = this.makeCombineObserable(client => client.observeCodecheck);
        this.observeFormatAfterKeystroke = this.makeCombineObserable(client => client.observeFormatAfterKeystroke);
        this.observeFormatRange = this.makeCombineObserable(client => client.observeFormatRange);
        this.observeCodeformat = this.makeCombineObserable(client => client.observeCodeformat);
        this.observeAutocomplete = this.makeCombineObserable(client => client.observeAutocomplete);
        this.observeFindimplementations = this.makeCombineObserable(client => client.observeFindimplementations);
        this.observeFindsymbols = this.makeCombineObserable(client => client.observeFindsymbols);
        this.observeFindusages = this.makeCombineObserable(client => client.observeFindusages);
        this.observeGotodefinition = this.makeCombineObserable(client => client.observeGotodefinition);
        this.observeGotofile = this.makeCombineObserable(client => client.observeGotofile);
        this.observeGotoregion = this.makeCombineObserable(client => client.observeGotoregion);
        this.observeHighlight = this.makeCombineObserable(client => client.observeHighlight);
        this.observeNavigateup = this.makeCombineObserable(client => client.observeNavigateup);
        this.observeNavigatedown = this.makeCombineObserable(client => client.observeNavigatedown);
        this.observePackagesearch = this.makeCombineObserable(client => client.observePackagesearch);
        this.observePackagesource = this.makeCombineObserable(client => client.observePackagesource);
        this.observePackageversion = this.makeCombineObserable(client => client.observePackageversion);
        this.observeRename = this.makeCombineObserable(client => client.observeRename);
        this.observeSignatureHelp = this.makeCombineObserable(client => client.observeSignatureHelp);
        this.observeCheckalivestatus = this.makeCombineObserable(client => client.observeCheckalivestatus);
        this.observeCheckreadystatus = this.makeCombineObserable(client => client.observeCheckreadystatus);
        this.observeCurrentfilemembersastree = this.makeCombineObserable(client => client.observeCurrentfilemembersastree);
        this.observeCurrentfilemembersasflat = this.makeCombineObserable(client => client.observeCurrentfilemembersasflat);
        this.observeTypelookup = this.makeCombineObserable(client => client.observeTypelookup);
        this.observeFilesChanged = this.makeCombineObserable(client => client.observeFilesChanged);
        this.observeProjects = this.makeCombineObserable(client => client.observeProjects);
        this.observeProject = this.makeCombineObserable(client => client.observeProject);
        this.observeGetcodeactions = this.makeCombineObserable(client => client.observeGetcodeactions);
        this.observeRuncodeaction = this.makeCombineObserable(client => client.observeRuncodeaction);
        this.observeGettestcontext = this.makeCombineObserable(client => client.observeGettestcontext);
    }
}
