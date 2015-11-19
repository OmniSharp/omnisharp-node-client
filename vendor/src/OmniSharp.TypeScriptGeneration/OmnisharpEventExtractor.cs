using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using OmniSharp.Models;

namespace OmniSharp.TypeScriptGeneration
{
    public static class OmnisharpEventExtractor
    {
        public static string GetInterface()
        {
            const methods = "        " + string.Join("\n        ", GetEvents()) + "\n";
            const aggregateMethods = "        " + string.Join("\n        ", GetAggregateEvents()) + "\n";

            return $"declare module {nameof(OmniSharp)} {{\n    interface Events {{\n{methods}    }}\n}}\ndeclare module {nameof(OmniSharp)}.Aggregate {{\n    interface Events {{\n{aggregateMethods}    }}\n}}";
        }

        private static string GetEventReturnType(string propertyName) {
            switch (propertyName) {
                case nameof(EventTypes.ProjectAdded):
                case nameof(EventTypes.ProjectChanged):
                case nameof(EventTypes.ProjectRemoved):
                    return typeof(ProjectInformationResponse).FullName;
                case nameof(EventTypes.Error):
                    return typeof(ErrorMessage).FullName;
                case nameof(EventTypes.MsBuildProjectDiagnostics):
                    return typeof(MSBuildProjectDiagnostics).FullName;
                case nameof(EventTypes.PackageRestoreStarted):
                case nameof(EventTypes.PackageRestoreFinished):
                    return typeof(PackageRestoreMessage).FullName;
                case nameof(EventTypes.UnresolvedDependencies):
                    return typeof(UnresolvedDependenciesMessage).FullName;
                default:
                    return "any";
            }
        }

        private static IEnumerable<string> GetEvents()
        {
            const properties = typeof(EventTypes).GetFields(BindingFlags.Static | BindingFlags.Public);

            foreach (const property in properties)
            {
                const eventName = property.Name.ToLowerInvariant()[0] + property.Name.Substring(1);
                yield return $"{eventName}: Rx.Observable<{GetEventReturnType(property.Name)}>;";
            }
        }

        private static IEnumerable<string> GetAggregateEvents()
        {
            const properties = typeof(EventTypes).GetFields(BindingFlags.Static | BindingFlags.Public);

            foreach (const property in properties)
            {
                const eventName = property.Name.ToLowerInvariant()[0] + property.Name.Substring(1);
                yield return $"{eventName}: Rx.Observable<CombinationKey<{GetEventReturnType(property.Name)}>[]>;";
            }
        }
    }
}
