using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
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
        private static string RequestOptionsInterface = "    interface RequestOptions\n    {\n        silent?: boolean;\n        oneBasedIndices?: boolean\n    }\n";
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
                    yield return new ItemVersion(version, actionName, $"{actionName}(request: {requestType}, options?: RequestOptions): Rx.Observable<{returnType}>;");
                    yield return new ItemVersion(version, actionName, $"{actionName}Promise(request: {requestType}, options?: RequestOptions): Rx.IPromise<{returnType}>;");
                }
                else
                {
                    yield return new ItemVersion(version, actionName, $"{actionName}(): Rx.Observable<{returnType}, options?: RequestOptions>;");
                    yield return new ItemVersion(version, actionName, $"{actionName}Promise(): Rx.IPromise<{returnType}, options?: RequestOptions>;");
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
                var observeName = $"observe{actionName[0].ToString().ToUpper()}{actionName.Substring(1)}";

                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
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
            var methods = GetControllerMethods().ToArray();
            foreach (var method in methods)
            {
                var actionName = method.Action;
                var version = GetVersion(ref actionName);
                var observeName = $"observe{actionName[0].ToString().ToUpper()}{actionName.Substring(1)}";

                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
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
            var methods = typeof(OmnisharpController).Assembly.GetTypes()
                .SelectMany(z => z.GetTypeInfo()
                    .DeclaredMethods.Where(x =>
                        x.GetCustomAttributes<HttpPostAttribute>().Any()));

            foreach (var method in methods.Where(z => z.IsPublic))
            {
                var attribute = method.GetCustomAttribute<HttpPostAttribute>();
                var parameters = method.GetParameters();
                var param = parameters.Length == 1 ? parameters[0].ParameterType : null;


                var paramType = param;
                var paramArray = false;
                if (paramType != null && paramType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
                {
                    paramArray = true;
                    paramType = paramType.GetGenericArguments().First();
                }

                string paramString = "any";
                if (paramType != null && paramType.FullName.StartsWith(InferNamespace(typeof(Request)), StringComparison.Ordinal))
                {
                    paramString = paramType.FullName;
                }

                if (paramType == typeof(Boolean))
                {
                    paramString = nameof(Boolean).ToLowerInvariant();
                }

                var returnType = method.ReturnType;
                var returnsArray = false;
                if (returnType.Name.StartsWith(nameof(Task), StringComparison.Ordinal))
                {
                    returnType = returnType.GetGenericArguments().First();
                }
                if (returnType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
                {
                    returnsArray = true;
                    returnType = returnType.GetGenericArguments().First();
                }

                string returnString = "any";
                if (returnType != null && returnType.FullName.StartsWith(InferNamespace(typeof(Request)), StringComparison.Ordinal))
                {
                    returnString = returnType.FullName;
                }

                if (returnType == typeof(Boolean))
                {
                    returnString = nameof(Boolean).ToLowerInvariant();
                }

                yield return new MethodResult()
                {
                    RequestType = paramString,
                    RequestArray = paramArray,
                    ReturnType = returnString,
                    ReturnArray = returnsArray,
                    Action = attribute.Template.TrimStart('/')
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
