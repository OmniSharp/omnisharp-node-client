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
        public static IEnumerable<KeyValuePair<string, string>> GetAugmentationMethods()
        {
            var methods = OmnisharpControllerExtractor.GetMethods()
                .Where(x => x.RequestType != null)
                .GroupBy(x => x.ActionName)
                .SelectMany(x => { var max = x.Max(z => z.VersionNumber); return x.Where(z => max == z.VersionNumber); })
                .ToArray();
            var events = OmnisharpControllerExtractor.GetEvents()
                .Where(x => x.RequestType != null)
                .GroupBy(x => x.ActionName)
                .SelectMany(x => { var max = x.Max(z => z.VersionNumber); return x.Where(z => max == z.VersionNumber); })
                .Join(
                    OmnisharpControllerExtractor.GetAggregateEvents()
                        .Where(x => x.RequestType != null)
                        .GroupBy(x => x.ActionName)
                        .SelectMany(x => { var max = x.Max(z => z.VersionNumber); return x.Where(z => max == z.VersionNumber); }),
                    x => x.ActionName,
                    x => x.ActionName,
                    (@event, aggregateEvent) => new { @event, aggregateEvent });

            var v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{Observable}} from ""rxjs"";
import {{ReactiveClient, ReactiveClientEvents}} from ""../reactive-client-base"";
import {{ReactiveObservationClient}} from ""../reactive-observation-client"";
import {{ReactiveCombinationClient}} from ""../reactive-combination-client"";
import {{request, response, makeObservable}} from ""../../helpers/decorators"";

{string.Join("\n", methods.Select(x => $"request(ReactiveClient.prototype, \"{x.ActionName}\");"))}
{string.Join("\n", events.Select(x => $"response(ReactiveClientEvents.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}
{string.Join("\n", events.Select(x => $"makeObservable(ReactiveObservationClient.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}
{string.Join("\n", events.Select(x => $"makeObservable(ReactiveCombinationClient.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}

declare module ""../reactive-client-base"" {{
    interface ReactiveClient {{
        {string.Join("\n        ", methods.Select(x => x.Value.Replace(": RequestOptions", ": OmniSharp.RequestOptions")))}
    }}
}}

declare module ""../reactive-client-base"" {{
    interface ReactiveClientEvents {{
        {string.Join("\n        ", events.Select(x => $"/*readonly*/ {x.@event.Value.Replace("<Context<", "<OmniSharp.Context<")}"))}
    }}
}}

declare module ""../reactive-observation-client"" {{
    interface ReactiveObservationClient {{
        {string.Join("\n        ", events.Select(x => $"/*readonly*/ {x.@event.Value.Replace("<Context<", "<OmniSharp.Context<")}"))}
    }}
}}

declare module ""../reactive-combination-client"" {{
    interface ReactiveCombinationClient {{
        {string.Join("\n        ", events.Select(x => $"/*readonly*/ {x.@aggregateEvent.Value.Replace("<CombinationKey<", "<OmniSharp.CombinationKey<").Replace("<Context<", "<OmniSharp.Context<")}"))}
    }}
}}
";

            yield return new KeyValuePair<string, string>("reactive", v);

            v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{AsyncClient}} from ""../async-client-base"";
import {{request}} from ""../../helpers/decorators"";

{string.Join("\n", methods.Select(x => $"request(AsyncClient.prototype, \"{x.ActionName}\");"))}

declare module ""../async-client-base"" {{
    interface AsyncClient {{
        {string.Join("\n        ", methods.Select(x => x.Value.Replace(": RequestOptions", ": OmniSharp.RequestOptions").Replace("Observable<", "Promise<")))}
    }}
}}
";

            yield return new KeyValuePair<string, string>("async", v);
        }

        public static IEnumerable<KeyValuePair<string, string>> GetReferenceAugmentationMethods()
        {
            var v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{Observable}} from ""rxjs"";
import ""../reactive-client-base"";

declare module ""../reactive-client-base"" {{
    interface ReactiveClient {{
";
            foreach (var method in OmnisharpControllerExtractor.GetMethods().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First()))
            {
                if (method.RequestType == "void")
                {
                    v += $"        request(path: \"/{method.Path}\", options?: OmniSharp.RequestOptions): Observable<{method.ReturnType}>;\n";
                }
                else
                {
                    v += $"        request(path: \"/{method.Path}\", request: {method.RequestType}, options?: OmniSharp.RequestOptions): Observable<{method.ReturnType}>;\n";
                }
            }

            v += $@"    }}
}}
";

            yield return new KeyValuePair<string, string>("reactive", v);

            v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import ""../async-client-base"";

declare module ""../async-client-base"" {{
    interface AsyncClient {{
";
            foreach (var method in OmnisharpControllerExtractor.GetMethods().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First()))
            {
                if (method.RequestType == "void")
                {
                    v += $"        request(path: \"/{method.Path}\", options?: OmniSharp.RequestOptions): Promise<{method.ReturnType}>;\n";
                }
                else
                {
                    v += $"        request(path: \"/{method.Path}\", request: {method.RequestType}, options?: OmniSharp.RequestOptions): Promise<{method.ReturnType}>;\n";
                }
            }

            v += $@"    }}
}}
";
            yield return new KeyValuePair<string, string>("async", v);
        }

        public static IEnumerable<KeyValuePair<string, string>> GetReferenceAugmentationEvents()
        {
            var clientEvents = new List<string>();
            var observationEvents = new List<string>();
            var aggregateEvents = new List<string>();
            foreach (var item in OmnisharpControllerExtractor.GetEvents().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First())
                .Join(OmnisharpControllerExtractor.GetAggregateEvents().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First()), x => x.Path, x => x.Path, (@event, aggregateEvent) => new { @event, aggregateEvent }))
            {
                var @event = item.@event;
                var aggregateEvent = item.aggregateEvent;

                clientEvents.Add($"        listen(path: \"/{@event.Path}\"): Observable<OmniSharp.Context<{(@event.RequestType == "void" ? "any" : @event.RequestType)}, {@event.ReturnType}>>;\n");
                observationEvents.Add($"        listen(path: \"/{@event.Path}\"): Observable<OmniSharp.Context<{(@event.RequestType == "void" ? "any" : @event.RequestType)}, {@event.ReturnType}>>;\n");
                aggregateEvents.Add($"        listen(path: \"/{@event.Path}\"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<{(aggregateEvent.RequestType == "void" ? "any" : aggregateEvent.RequestType)}, {aggregateEvent.ReturnType}>>[]>;\n");

            }

            var v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{Observable}} from ""rxjs"";
import ""../reactive-client-base"";
import ""../reactive-observation-client"";
import ""../reactive-combination-client"";

declare module ""../reactive-client-base"" {{
    interface ReactiveClientEvents {{
{string.Join("", clientEvents)}    }}
}}

declare module ""../reactive-observation-client"" {{
    interface ReactiveObservationClient {{
{string.Join("", observationEvents)}    }}
}}

declare module ""../reactive-combination-client"" {{
    interface ReactiveCombinationClient {{
{string.Join("", aggregateEvents)}    }}
}}

";

            yield return new KeyValuePair<string, string>("reactive", v);
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
import {{event, makeObservable}} from ""../../helpers/decorators"";

event(ReactiveClientEvents.prototype, ""{@event.Name}"");
makeObservable(ReactiveObservationClient.prototype, ""{@event.Name}"", ""{@event.Name}"");
makeObservable(ReactiveCombinationClient.prototype, ""{@event.Name}"", ""{@event.Name}"");

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

        public static IEnumerable<KeyValuePair<string, string>> GetReferenceAugmentationServerEvents()
        {
            var clientEvents = new List<string>();
            var observationEvents = new List<string>();
            var aggregateEvents = new List<string>();
            foreach (var item in OmnisharpEventExtractor.GetEvents()
                .Join(OmnisharpEventExtractor.GetAggregateEvents(), x => x.Name, x => x.Name, (@event, aggregateEvent) => new { @event, aggregateEvent }))
            {
                var @event = item.@event;
                var aggregateEvent = item.aggregateEvent;
                clientEvents.Add($"        listen(path: \"/{@event.Name}\"): Observable<{@event.ReturnType}>;\n");
                observationEvents.Add($"        listen(path: \"/{@event.Name}\"): Observable<{@event.ReturnType}>;\n");
                aggregateEvents.Add($"        listen(path: \"/{aggregateEvent.Name}\"): Observable<OmniSharp.CombinationKey<{aggregateEvent.ReturnType}>[]>;\n");
            }



            var v = $@"import * as OmniSharp from ""../../omnisharp-server"";
import {{Observable}} from ""rxjs"";
import ""../reactive-client-base"";
import ""../reactive-observation-client"";
import ""../reactive-combination-client"";

declare module ""../reactive-client-base"" {{
    interface ReactiveClientEvents {{
{string.Join("", clientEvents)}    }}
}}

declare module ""../reactive-observation-client"" {{
    interface ReactiveObservationClient {{
{string.Join("", observationEvents)}    }}
}}

declare module ""../reactive-combination-client"" {{
    interface ReactiveCombinationClient {{
{string.Join("", aggregateEvents)}    }}
}}
";
            yield return new KeyValuePair<string, string>("reactive", v);
        }
    }
}
