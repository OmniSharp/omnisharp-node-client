using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using OmniSharp.Mef;
using OmniSharp.Models;

namespace OmniSharp.TypeScriptGeneration
{
    public static class OmnisharpControllerExtractor
    {
        public class ItemVersion
        {
            public ItemVersion(string version, string actionName, string value)
            {
                Version = version;
                Value = value;
                ActionName = actionName;
            }

            public string Version { get; set; }
            public string ActionName { get; set; }
            public string Value { get; set; }
        }

        public static IEnumerable<string> GetInterface()
        {
            var methodStrings = GetMethods().GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());
            var eventStrings = GetEvents().GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());
            var aggregateEventStrings = GetAggregateEvents().GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());

            var keys = methodStrings.Keys;

            yield return $"declare module {nameof(OmniSharp)} {{\n{ContextInterface}{RequestOptionsInterface}{CombinationKeyInterface}}}";

            yield return $"declare module {nameof(OmniSharp)}.Api {{\n";

            foreach (var kvp in methodStrings)
            {
                var key = kvp.Key;
                var items = kvp.Value.ToList();

                foreach (var previousKey in keys.TakeWhile(z => z != key).Reverse())
                {
                    items.AddRange(methodStrings[previousKey].Where(x => !items.Any(z => z.Key == x.Key)));
                }

                var results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                var methods = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} {{\n{methods}    }}\n";
            }

            var allVersions = methodStrings.SelectMany(x => x.Value).SelectMany(x => x).Select(x => x.Version)
                .Distinct().Select(x => $"\"{x}\"");

            yield return $"    export function getVersion(name: string): {string.Join(" | ", allVersions)} {{";
            foreach (var method in methodStrings.Where(x => x.Key != "v1"))
            {
                var items = method.Value
                    .SelectMany(x => x)
                    .GroupBy(x => x.ActionName)
                    .Distinct();

                foreach (var key in items.Select(x => x.Key).Distinct())
                {
                    var item = items.First(x => x.Key == key).First();
                    yield return $"        if (\"{item.ActionName.ToLower()}\" === name.toLowerCase()) {{";
                    yield return $"            return \"{item.Version.ToLower()}\";";
                    yield return $"        }}";
                }
            }
            yield return $"        return \"v1\";";
            yield return $"    }}";

            yield return $"}}";

            yield return $"declare module {nameof(OmniSharp)}.Events {{\n";

            foreach (var kvp in eventStrings)
            {
                var key = kvp.Key;
                var items = kvp.Value.ToList();

                foreach (var previousKey in keys.TakeWhile(z => z != key).Reverse())
                {
                    items.AddRange(eventStrings[previousKey].Where(x => !items.Any(z => z.Key == x.Key)));
                }

                var results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                var events = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} {{\n{events}    }}\n";
            }

            yield return $"}}";

            yield return $"declare module {nameof(OmniSharp)}.Events.Aggregate {{\n";

            foreach (var kvp in aggregateEventStrings)
            {
                var key = kvp.Key;
                var items = kvp.Value.ToList();

                foreach (var previousKey in keys.TakeWhile(z => z != key).Reverse())
                {
                    items.AddRange(aggregateEventStrings[previousKey].Where(x => !items.Any(z => z.Key == x.Key)));
                }

                var results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                var events = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} {{\n{events}    }}\n";
            }

            yield return $"}}";
        }

        private static string ContextInterface = "    interface Context<TRequest, TResponse>\n    {\n        request: TRequest;\n        response: TResponse;\n    }\n";
        private static string RequestOptionsInterface = "    interface RequestOptions\n    {\n        silent?: boolean;\n    }\n";
        private static string CombinationKeyInterface = "    interface CombinationKey<T>\n    {\n        key: string;\n        value: T;\n    }\n";

        private static IEnumerable<ItemVersion> GetMethods()
        {
            var methods = GetControllerMethods().ToArray();
            foreach (var method in methods)
            {
                var actionName = method.Action;
                var version = GetVersion(ref actionName);
                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                yield return new ItemVersion(version, actionName, $"// '{actionName}'");
                if (method.RequestType != null)
                {
                    yield return new ItemVersion(version, actionName, $"{actionName}(request: {requestType}, options?: RequestOptions): Observable<{returnType}>;");
                }
                else
                {
                    yield return new ItemVersion(version, actionName, $"{actionName}(): Observable<{returnType}, options?: RequestOptions>;");
                }
            }
        }

        private static IEnumerable<ItemVersion> GetEvents()
        {
            var methods = GetControllerMethods().ToArray();
            foreach (var method in methods)
            {
                var actionName = method.Action;
                var version = GetVersion(ref actionName);
                var observeName = actionName;

                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                yield return new ItemVersion(version, actionName, $"// '{actionName}'");
                if (method.RequestType != null)
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Observable<Context<{requestType}, {returnType}>>;");
                }
                else
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Observable<{returnType}>;");
                }
            }
        }

        private static IEnumerable<ItemVersion> GetAggregateEvents()
        {
            var methods = GetControllerMethods().ToArray();
            foreach (var method in methods)
            {
                var actionName = method.Action;
                var version = GetVersion(ref actionName);
                var observeName = actionName;

                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                yield return new ItemVersion(version, actionName, $"// '{actionName}'");
                if (method.RequestType != null)
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Observable<CombinationKey<Context<{requestType}, {returnType}>>[]>;");
                }
                else
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Observable<CombinationKey<{returnType}>[]>;");
                }
            }
        }

        private static string GetVersion(ref string actionName)
        {
            if (actionName.Contains("/"))
            {
                var s = actionName.Split('/');
                actionName = s[1];
                return s[0];
            }
            return "v1";
        }

        class MethodResult
        {
            public string Action { get; set; }
            public string RequestType { get; set; }
            public bool RequestArray { get; set; }
            public string ReturnType { get; set; }
            public bool ReturnArray { get; set; }
        }

        private static IEnumerable<MethodResult> GetControllerMethods()
        {
            var types = typeof(Request).Assembly.GetTypes()
                .Where(z => z.GetTypeInfo().GetCustomAttributes<OmniSharpEndpointAttribute>().Any());

            foreach (var type in types.Where(z => z.IsPublic))
            {
                var attribute = type.GetCustomAttribute<OmniSharpEndpointAttribute>();
                var requestType = attribute.RequestType;
                var responseType = attribute.ResponseType;

                var requestArray = false;
                if (requestType != null && requestType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
                {
                    requestArray = true;
                    requestType = requestType.GetGenericArguments().First();
                }

                string requestTypeString = "any";
                if (requestType != null && requestType.FullName.StartsWith(InferNamespace(typeof(Request)), StringComparison.Ordinal))
                {
                    requestTypeString = requestType.FullName;
                }

                if (requestType == typeof(Boolean))
                {
                    requestTypeString = nameof(Boolean).ToLowerInvariant();
                }

                var responseArray = false;
                if (responseType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
                {
                    responseArray = true;
                    responseType = responseType.GetGenericArguments().First();
                }

                string responseTypeString = "any";
                if (responseType != null && responseType.FullName.StartsWith(InferNamespace(typeof(Request)), StringComparison.Ordinal))
                {
                    responseTypeString = responseType.FullName;
                }

                if (responseType == typeof(Boolean))
                {
                    responseTypeString = nameof(Boolean).ToLowerInvariant();
                }

                yield return new MethodResult()
                {
                    RequestType = requestTypeString,
                    RequestArray = requestArray,
                    ReturnType = responseTypeString,
                    ReturnArray = responseArray,
                    Action = attribute.EndpointName.TrimStart('/')
                };
            }
        }

        internal static string InferNamespace(Type type)
        {
            var pieces = type.FullName.Split('.');
            return string.Join(".", pieces.Take(pieces.Length - 1)) + ".";
        }
    }
}
