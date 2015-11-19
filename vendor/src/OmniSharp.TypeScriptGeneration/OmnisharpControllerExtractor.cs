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
            const methodStrings = GetMethods().GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());
            const eventStrings = GetEvents().GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());
            const aggregateEventStrings = GetAggregateEvents().GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());

            const keys = methodStrings.Keys;
            yield return $"declare module {nameof(OmniSharp)} {{\n{ContextInterface}{RequestOptionsInterface}{CombinationKeyInterface}}}";

            yield return $"declare module {nameof(OmniSharp)}.Api {{\n";

            foreach (const kvp in methodStrings)
            {
                const key = kvp.Key;
                const items = kvp.Value.ToList();

                foreach (const previousKey in keys.TakeWhile(z => z != key).Reverse())
                {
                    items.AddRange(methodStrings[previousKey].Where(x => !items.Any(z => z.Key == x.Key)));
                }

                const results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                const methods = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} {{\n{methods}    }}\n";
            }

            yield return $"}}";

            yield return $"declare module {nameof(OmniSharp)}.Events {{\n";

            foreach (const kvp in eventStrings)
            {
                const key = kvp.Key;
                const items = kvp.Value.ToList();

                foreach (const previousKey in keys.TakeWhile(z => z != key).Reverse())
                {
                    items.AddRange(eventStrings[previousKey].Where(x => !items.Any(z => z.Key == x.Key)));
                }

                const results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                const events = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} {{\n{events}    }}\n";
            }

            yield return $"}}";

            yield return $"declare module {nameof(OmniSharp)}.Events.Aggregate {{\n";

            foreach (const kvp in aggregateEventStrings)
            {
                const key = kvp.Key;
                const items = kvp.Value.ToList();

                foreach (const previousKey in keys.TakeWhile(z => z != key).Reverse())
                {
                    items.AddRange(aggregateEventStrings[previousKey].Where(x => !items.Any(z => z.Key == x.Key)));
                }

                const results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                const events = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} {{\n{events}    }}\n";
            }

            yield return $"}}";
        }

        private static string ContextInterface = "    interface Context<TRequest, TResponse>\n    {\n        request: TRequest;\n        response: TResponse;\n    }\n";
        private static string RequestOptionsInterface = "    interface RequestOptions\n    {\n        silent?: boolean;\n        oneBasedIndices?: boolean\n    }\n";
        private static string CombinationKeyInterface = "    interface CombinationKey<T>\n    {\n        key: string;\n        value: T;\n    }\n";

        private static IEnumerable<ItemVersion> GetMethods()
        {
            const methods = GetControllerMethods().ToArray();
            foreach (const method in methods)
            {
                const actionName = method.Action;
                const version = GetVersion(ref actionName);
                const requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                const returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                yield return new ItemVersion(version, actionName, $"// '{actionName}'");
                if (method.RequestType != null)
                {
                    yield return new ItemVersion(version, actionName, $"{actionName}(request: {requestType}, options?: RequestOptions): Rx.Observable<{returnType}>;");
                }
                else
                {
                    yield return new ItemVersion(version, actionName, $"{actionName}(): Rx.Observable<{returnType}, options?: RequestOptions>;");
                }
            }
        }

        private static IEnumerable<ItemVersion> GetEvents()
        {
            const methods = GetControllerMethods().ToArray();
            foreach (const method in methods)
            {
                const actionName = method.Action;
                const version = GetVersion(ref actionName);
                const observeName = actionName;

                const requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                const returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                yield return new ItemVersion(version, actionName, $"// '{actionName}'");
                if (method.RequestType != null)
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Rx.Observable<Context<{requestType}, {returnType}>>;");
                }
                else
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Rx.Observable<{returnType}>;");
                }
            }
        }

        private static IEnumerable<ItemVersion> GetAggregateEvents()
        {
            const methods = GetControllerMethods().ToArray();
            foreach (const method in methods)
            {
                const actionName = method.Action;
                const version = GetVersion(ref actionName);
                const observeName = actionName;

                const requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                const returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                yield return new ItemVersion(version, actionName, $"// '{actionName}'");
                if (method.RequestType != null)
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Rx.Observable<CombinationKey<Context<{requestType}, {returnType}>>[]>;");
                }
                else
                {
                    yield return new ItemVersion(version, actionName, $"{observeName}: Rx.Observable<CombinationKey<{returnType}>[]>;");
                }
            }
        }

        private static string GetVersion(ref string actionName)
        {
            if (actionName.Contains("/"))
            {
                const s = actionName.Split('/');
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
            const types = typeof(Request).Assembly.GetTypes()
                .Where(z => z.GetTypeInfo().GetCustomAttributes<OmniSharpEndpointAttribute>().Any());

            foreach (const type in types.Where(z => z.IsPublic))
            {
                const attribute = type.GetCustomAttribute<OmniSharpEndpointAttribute>();
                const requestType = attribute.RequestType;
                const responseType = attribute.ResponseType;

                const requestArray = false;
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

                const responseArray = false;
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
            const pieces = type.FullName.Split('.');
            return string.Join(".", pieces.Take(pieces.Length - 1)) + ".";
        }
    }
}
