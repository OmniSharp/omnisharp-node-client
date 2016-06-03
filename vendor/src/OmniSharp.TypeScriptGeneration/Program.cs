using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OmniSharp.Models;
using OmniSharp.Stdio.Protocol;
using TypeLite;

namespace OmniSharp.TypeScriptGeneration
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var path = string.Empty;
            if (args.Length == 1)
            {
                path = args[0];
            }

            var fluent = TypeScript.Definitions();
            fluent.ScriptGenerator.IndentationString = "    ";

            fluent.WithMemberTypeFormatter(TsFluentFormatters.FormatPropertyType);
            fluent.WithMemberFormatter(TsFluentFormatters.FormatPropertyName);

            foreach (var model in GetApplicableTypes())
            {
                fluent.For(model);
            }

            var tsModel = fluent.ModelBuilder.Build();
            foreach (var @class in tsModel.Classes.Where(z => z.Module.Name.StartsWith("System", StringComparison.Ordinal)))
            {
                @class.IsIgnored = true;
            }

            var result = fluent.Generate();

            var generated = string.Join("\n", OmnisharpControllerExtractor.GetInterface());
            var projectInterfaces = $@"
declare module {OmnisharpControllerExtractor.InferNamespace(typeof(Request)).TrimEnd('.')} {{
    interface ProjectInformationResponse {{
        MsBuildProject: OmniSharp.Models.MSBuildProject;
        DotNetProject: OmniSharp.Models.DotNetProjectInformation;
    }}

    interface WorkspaceInformationResponse {{
        DotNet: OmniSharp.Models.DotNetWorkspaceInformation;
        MSBuild: OmniSharp.Models.MsBuildWorkspaceInformation;
        ScriptCs: OmniSharp.ScriptCs.ScriptCsContext;
    }}
}}
            ";

            result = string.Join("\n", "import {Observable} from \"rxjs\";", result, generated, OmnisharpEventExtractor.GetInterface(), projectInterfaces);
            result = result
                .Replace("interface", "export interface")
                .Replace("declare module", "export module")
                .Replace("export module OmniSharp {", "")
                .Replace("OmniSharp.", "")
                .Replace("DotNet.Models", "Models")
                ;

            var lines = result.Split('\n');
            var opens = 0;

            for (var i = 0; i < lines.Length; i++)
            {
                if (lines[i].Contains('{'))
                {
                    opens++;
                }
                if (lines[i].Contains('}'))
                {
                    opens--;
                }
                if (opens < 0 && lines[i].TrimEnd().Length == 1)
                {
                    lines[i] = string.Empty;
                    opens = 0;
                }
            }

            result = string.Join("\n", lines);

            result = "/* tslint:disable */\n" + result + "\n";

            if (!string.IsNullOrWhiteSpace(path))
            {
                File.WriteAllText(Path.Combine(path, "lib", "omnisharp-server.ts"), result);

                var augmentationMethods = OmnisharpAugmentationExtractor.GetAugmentationMethods()
                    .GroupBy(x => x.Name + x.Type)
                    .SelectMany(x => x.Where(z => z.VersionNumber == x.Max(c => c.VersionNumber)))
                    .ToArray();

                foreach (var item in augmentationMethods)
                {
                    File.WriteAllText(Path.Combine(path, "lib", item.Type, "method", item.Name + ".ts"), item.Value);
                }

                var augmentationEvents = OmnisharpAugmentationExtractor.GetAugmentationEvents()
                    .GroupBy(x => x.Name + x.Type)
                    .SelectMany(x => x.Where(z => z.VersionNumber == x.Max(c => c.VersionNumber)))
                    .ToArray();

                foreach (var item in augmentationEvents)
                {
                    File.WriteAllText(Path.Combine(path, "lib", item.Type, "response", item.Name + ".ts"), item.Value);
                }

                var augmentationServerEvents = OmnisharpAugmentationExtractor.GetAugmentationServerEvents()
                    .GroupBy(x => x.Name + x.Type)
                    .SelectMany(x => x.Where(z => z.VersionNumber == x.Max(c => c.VersionNumber)))
                    .ToArray();

                foreach (var item in augmentationServerEvents)
                {
                    File.WriteAllText(Path.Combine(path, "lib", item.Type, "event", item.Name + ".ts"), item.Value);
                }

                var referenceAugmentationMethods = OmnisharpAugmentationExtractor.GetReferenceAugmentationMethods().ToArray();

                foreach (var item in referenceAugmentationMethods)
                {
                    File.WriteAllText(Path.Combine(path, "lib", item.Key, "reference", "reference.ts"), item.Value);
                }

                var referenceAugmentationEvents = OmnisharpAugmentationExtractor.GetReferenceAugmentationEvents().ToArray();

                foreach (var item in referenceAugmentationEvents)
                {
                    File.WriteAllText(Path.Combine(path, "lib", item.Key, "reference", "events.ts"), item.Value);
                }

                var referenceAugmentationServerEvents = OmnisharpAugmentationExtractor.GetReferenceAugmentationServerEvents().ToArray();

                foreach (var item in referenceAugmentationServerEvents)
                {
                    File.WriteAllText(Path.Combine(path, "lib", item.Key, "reference", "server-events.ts"), item.Value);
                }

                var latestMethods = augmentationMethods;
                var latestEvents = augmentationMethods;
                var serverEvents = augmentationServerEvents;

                var augmentationValues = latestMethods.Where(x => x.Type == "reactive").Select(x => $"import \"./method/{x.Name}\";\n");
                augmentationValues = augmentationValues.Concat(
                    latestEvents.Select(x => $"import \"./response/{x.Name}\";\n")
                );

                var reativeAugmentationValues = augmentationValues.Concat(
                    serverEvents.Select(x => $"import \"./event/{x.Name}\";\n")
                );

                File.WriteAllText(Path.Combine(path, "lib", "latest.ts"),
                    "export * from \"./reactive/reactive-client\";\n" + string.Join("", reativeAugmentationValues.Select(x => x.Replace("./", "./reactive/")).Distinct()) +
                    "export * from \"./async/async-client\";\n" + string.Join("", augmentationValues.Select(x => x.Replace("./", "./async/")).Distinct())
                    );
            }
            else
            {
                Console.Write(result);
                Console.ReadLine();
            }
        }

        private static IEnumerable<Type> GetApplicableTypes()
        {
            var allTypes = new[] {
                typeof(OmniSharp.Startup).Assembly,
                typeof(OmniSharp.Models.Request).Assembly,
                typeof(OmniSharp.DotNet.Models.DotNetFramework).Assembly,
                typeof(OmniSharp.Models.MSBuildProject).Assembly,
                typeof(OmniSharp.NuGet.OmniSharpSourceRepositoryProvider).Assembly,
                typeof(OmniSharp.Roslyn.BufferManager).Assembly,
                typeof(OmniSharp.Roslyn.CSharp.Services.CodeActions.RoslynCodeActionProvider).Assembly,
                typeof(OmniSharp.ScriptCs.ScriptCsContext).Assembly,
                typeof(OmniSharp.Stdio.StdioServer).Assembly,
            }
                .SelectMany(x => x.GetTypes())
                .ToArray();

            var models = allTypes
                .Where(z => z.IsPublic && z.FullName.Contains("Models."))
                .Select(x =>
                {
                    Console.WriteLine(x.FullName);
                    return x;
                })
                .Where(x => x.Name != nameof(ProjectInformationResponse))
                .Where(x => x.Name != nameof(WorkspaceInformationResponse));

            var stdioProtocol = allTypes
                .Where(z => z.IsPublic && z.FullName.StartsWith(OmnisharpControllerExtractor.InferNamespace(typeof(Packet)), StringComparison.Ordinal))
                .Select(x =>
                {
                    Console.WriteLine(x.FullName);
                    return x;
                });

            var scriptCs = typeof(OmniSharp.ScriptCs.ScriptCsContext);

            return models.Union(stdioProtocol).Union(new[] { typeof(OmniSharp.ScriptCs.ScriptCsContext) }).ToArray();
        }
    }
}
