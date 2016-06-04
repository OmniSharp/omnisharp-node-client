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
using System;
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
        public static IEnumerable<KeyValuePair<string, Tuple<string, string>>> GetAugmentationMethods()
        {
            var clientEvents = new List<string>();
            var observationEvents = new List<string>();
            var aggregateEvents = new List<string>();

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

            var serverEvents = OmnisharpEventExtractor.GetEvents()
                .Join(OmnisharpEventExtractor.GetAggregateEvents(), x => x.Name, x => x.Name, (@event, aggregateEvent) => new { @event, aggregateEvent });

                foreach (var item in OmnisharpControllerExtractor.GetEvents().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First())
                .Join(OmnisharpControllerExtractor.GetAggregateEvents().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First()), x => x.Path, x => x.Path, (@event, aggregateEvent) => new { @event, aggregateEvent }))
            {
                var @event = item.@event;
                var aggregateEvent = item.aggregateEvent;

                clientEvents.Add($"        listen(path: \"/{@event.Path}\"): Observable<OmniSharp.Context<{(@event.RequestType == "void" ? "any" : @event.RequestType)}, {@event.ReturnType}>>;\n");
                observationEvents.Add($"        listen(path: \"/{@event.Path}\"): Observable<OmniSharp.Context<{(@event.RequestType == "void" ? "any" : @event.RequestType)}, {@event.ReturnType}>>;\n");
                aggregateEvents.Add($"        listen(path: \"/{@event.Path}\"): Observable<OmniSharp.CombinationKey<OmniSharp.Context<{(aggregateEvent.RequestType == "void" ? "any" : aggregateEvent.RequestType)}, {aggregateEvent.ReturnType}>>[]>;\n");

            }

            foreach (var item in OmnisharpEventExtractor.GetEvents()
                .Join(OmnisharpEventExtractor.GetAggregateEvents(), x => x.Name, x => x.Name, (@event, aggregateEvent) => new { @event, aggregateEvent }))
            {
                var @event = item.@event;
                var aggregateEvent = item.aggregateEvent;
                clientEvents.Add($"        listen(path: \"{@event.Name}\"): Observable<{@event.ReturnType}>;\n");
                observationEvents.Add($"        listen(path: \"{@event.Name}\"): Observable<{@event.ReturnType}>;\n");
                aggregateEvents.Add($"        listen(path: \"{aggregateEvent.Name}\"): Observable<OmniSharp.CombinationKey<{aggregateEvent.ReturnType}>[]>;\n");
            }

            var v = $@"{string.Join("\n", methods.Select(x => $"request(ReactiveClient.prototype, \"{x.ActionName}\");"))}
{string.Join("\n", events.Select(x => $"response(ReactiveClientEvents.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}

export interface ReactiveClient {{
    {string.Join("\n    ", methods.Select(x => x.Value.Replace(": RequestOptions", ": OmniSharp.RequestOptions")))}
    {string.Join("\n    ", OmnisharpControllerExtractor.GetMethods().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First())
        .Select(method => {
            if (method.RequestType == "void")
                {
                    return $"    request(path: \"/{method.Path}\", options?: OmniSharp.RequestOptions): Observable<{method.ReturnType}>;";
                }
                else
                {
                    return $"    request(path: \"/{method.Path}\", request: {method.RequestType}, options?: OmniSharp.RequestOptions): Observable<{method.ReturnType}>;";
                }
        }))}
}}

export interface ReactiveClientEvents {{
    {string.Join("\n    ", events.Select(x => $"/*readonly*/ {x.@event.Value.Replace("<Context<", "<OmniSharp.Context<")}"))}
    {string.Join("\n    ", serverEvents.Select(x => $"/*readonly*/ {x.@event.Value.Replace("<Context<", "<OmniSharp.Context<")}"))}
{string.Join("", clientEvents)}    }}
}}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("reactive", Tuple.Create("reactive-client.ts", v));

            v = $@"{string.Join("\n", events.Select(x => $"makeObservable(ReactiveObservationClient.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}
{string.Join("\n", serverEvents.Select(x => $"makeObservable(ReactiveObservationClient.prototype, \"{x.@event.Name}\", \"{x.@event.Name}\");"))}

export interface ReactiveObservationClient {{
    {string.Join("\n        ", events.Select(x => $"/*readonly*/ {x.@event.Value.Replace("<Context<", "<OmniSharp.Context<")}"))}
    {string.Join("\n        ", serverEvents.Select(x => $"/*readonly*/ {x.@event.Value.Replace("<Context<", "<OmniSharp.Context<")}"))}
{string.Join("", observationEvents)}    }}
}}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("reactive", Tuple.Create("reactive-observation-client.ts", v));

            v = $@"{string.Join("\n", events.Select(x => $"makeObservable(ReactiveCombinationClient.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}
{string.Join("\n", serverEvents.Select(x => $"makeObservable(ReactiveCombinationClient.prototype, \"{x.@event.Name}\", \"{x.@event.Name}\");"))}

export interface ReactiveCombinationClient {{
    {string.Join("\n        ", events.Select(x => $"/*readonly*/ {x.@aggregateEvent.Value.Replace("<CombinationKey<", "<OmniSharp.CombinationKey<").Replace("<Context<", "<OmniSharp.Context<")}"))}
    {string.Join("\n        ", serverEvents.Select(x => $"/*readonly*/ {x.@aggregateEvent.Value.Replace("<CombinationKey<", "<OmniSharp.CombinationKey<").Replace("<Context<", "<OmniSharp.Context<")}"))}
{string.Join("", aggregateEvents)}    }}
}}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("reactive", Tuple.Create("reactive-combination-client.ts", v));

            v = $@"{string.Join("\n", methods.Select(x => $"request(AsyncClient.prototype, \"{x.ActionName}\");"))}

export interface AsyncClient {{
    {string.Join("\n    ", methods.Select(x => x.Value.Replace(": RequestOptions", ": OmniSharp.RequestOptions").Replace("Observable<", "Promise<")))}
    {string.Join("\n    ", OmnisharpControllerExtractor.GetMethods().Where(x => x.RequestType != null).GroupBy(x => x.Path).Select(x => x.First())
        .Select(method => {
            if (method.RequestType == "void")
                {
                    return $"        request(path: \"/{method.Path}\", options?: OmniSharp.RequestOptions): Promise<{method.ReturnType}>;\n";
                }
                else
                {
                    return $"        request(path: \"/{method.Path}\", request: {method.RequestType}, options?: OmniSharp.RequestOptions): Promise<{method.ReturnType}>;\n";
                }
        }))}
}}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("async", Tuple.Create("async-client.ts", v));
        }
    }
}
