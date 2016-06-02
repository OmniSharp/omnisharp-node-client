/*
import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {requestAugmentation} from "../../helpers/decorators";
import * as preconditions from "../../helpers/preconditions";

requestAugmentation(ReactiveClient.prototype, "getcodeactions", preconditions.getcodeactions);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
    }
}

*/
using System.Collections.Generic;
using System.Linq;

namespace OmniSharp.TypeScriptGeneration
{
    public class AugmentationResult
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public string Version { get; set; }
        public int VersionNumber { get; set; }
    }

    public class OmnisharpAugmentationExtractor
    {
        public static IEnumerable<AugmentationResult> GetAugmentationMethods()
        {
            foreach (var method in OmnisharpControllerExtractor.GetMethods())
            {
                var v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{Observable}} from ""rxjs"";
import {{ReactiveClient}} from ""../reactive-client-base"";
import {{request}} from ""../../helpers/decorators"";
import {{{method.ActionName}}} from ""../../helpers/preconditions"";

request(ReactiveClient.prototype, ""{method.ActionName}"", {method.ActionName});

declare module ""../reactive-client-base"" {{
    interface ReactiveClient {{
        {method.Value.Replace(": RequestOptions", ": OmniSharp.RequestOptions")}
    }}
}}
";

                yield return new AugmentationResult()
                {
                    Name = method.ActionName,
                    Type = "reactive",
                    Value = v,
                    Version = method.Version,
                    VersionNumber = method.VersionNumber
                };


                v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{AsyncClient}} from ""../async-client-base"";
import {{request}} from ""../../helpers/decorators"";
import {{{method.ActionName}}} from ""../../helpers/preconditions"";

request(AsyncClient.prototype, ""{method.ActionName}"", {method.ActionName});

declare module ""../async-client-base"" {{
    interface AsyncClient {{
        {method.Value.Replace(": RequestOptions", ": OmniSharp.RequestOptions").Replace("Observable<", "Promise<")}
    }}
}}
";

                yield return new AugmentationResult()
                {
                    Name = method.ActionName,
                    Type = "async",
                    Value = v,
                    Version = method.Version,
                    VersionNumber = method.VersionNumber
                };
            }
        }

        public static IEnumerable<AugmentationResult> GetAugmentationEvents()
        {
            foreach (var item in OmnisharpControllerExtractor.GetEvents()
                .Join(OmnisharpControllerExtractor.GetAggregateEvents(), x => x.ActionName, x => x.ActionName, (@event, aggregateEvent) => new { @event, aggregateEvent }))
            {
                var @event = item.@event;
                var aggregateEvent = item.aggregateEvent;
                var v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{Observable}} from ""rxjs"";
import {{ReactiveClientEvents}} from ""../reactive-client-base"";
import {{ReactiveObservationClient}} from ""../reactive-observation-client"";
import {{response, merge, aggregate}} from ""../../helpers/decorators"";

response(ReactiveClientEvents.prototype, ""{@event.ActionName}"");
merge(ReactiveObservationClient.prototype, ""{@event.ActionName}"");

declare module ""../reactive-client-base"" {{
    interface ReactiveClientEvents {{
        /*readonly*/ {@event.Value.Replace("<Context<", "<OmniSharp.Context<")}
    }}
}}

declare module ""../reactive-observation-client"" {{
    interface ReactiveObservationClient {{
        /*readonly*/ {@event.Value.Replace("<Context<", "<OmniSharp.Context<")}
    }}
}}

declare module ""../reactive-combination-client"" {{
    interface ReactiveCombinationClient {{
        /*readonly*/ {aggregateEvent.Value.Replace("<CombinationKey<", "<OmniSharp.CombinationKey<")}
    }}
}}

";
                yield return new AugmentationResult()
                {
                    Name = @event.ActionName,
                    Type = "reactive",
                    Value = v,
                    Version = @event.Version,
                    VersionNumber = @event.VersionNumber
                };
            }
        }

        public static IEnumerable<AugmentationResult> GetAugmentationServerEvents()
        {
            foreach (var item in OmnisharpEventExtractor.GetEvents()
                .Join(OmnisharpEventExtractor.GetAggregateEvents(), x => x.Name, x => x.Name, (@event, aggregateEvent) => new { @event, aggregateEvent }))
            {
                var @event = item.@event;
                var aggregateEvent = item.aggregateEvent;

                var v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{Observable}} from ""rxjs"";
import {{ReactiveClientEvents}} from ""../reactive-client-base"";
import {{ReactiveObservationClient}} from ""../reactive-observation-client"";
import {{ReactiveCombinationClient}} from ""../reactive-combination-client"";
import {{event, merge, aggregate}} from ""../../helpers/decorators"";

event(ReactiveClientEvents.prototype, ""{@event.Name}"");
merge(ReactiveObservationClient.prototype, ""{@event.Name}"");
aggregate(ReactiveCombinationClient.prototype, ""{@event.Name}"");

declare module ""../reactive-client-base"" {{
    interface ReactiveClientEvents {{
        /*readonly*/ {@event.Value}
    }}
}}

declare module ""../reactive-observation-client"" {{
    interface ReactiveObservationClient {{
        /*readonly*/ {@event.Value}
    }}
}}

declare module ""../reactive-combination-client"" {{
    interface ReactiveCombinationClient {{
        /*readonly*/ {aggregateEvent.Value.Replace("<CombinationKey<", "<OmniSharp.CombinationKey<")}
    }}
}}
";
                yield return new AugmentationResult()
                {
                    Name = @event.Name,
                    Type = "reactive",
                    Value = v
                };
            }
        }
    }
}
