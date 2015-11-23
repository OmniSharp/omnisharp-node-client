using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Framework.Runtime;
using OmniSharp.Models;
using OmniSharp.Stdio;
using OmniSharp.Stdio.Protocol;
using TypeLite;
using TypeLite.TsModels;

namespace OmniSharp.TypeScriptGeneration
{
    public class Program
    {
        public void Main(string[] args)
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
        DnxProject: OmniSharp.Models.DnxProject;
    }}

    interface WorkspaceInformationResponse {{
        Dnx: OmniSharp.Models.DnxWorkspaceInformation;
        MSBuild: OmniSharp.Models.MsBuildWorkspaceInformation;
        ScriptCs: OmniSharp.ScriptCs.ScriptCsContext;
    }}
}}
            ";

            result = string.Join("\n", result, generated, OmnisharpEventExtractor.GetInterface(), projectInterfaces);
            result = result
                .Replace("interface", "export interface")
                .Replace("enum", "export enum")
                .Replace("declare module", "export module")
                .Replace("export module OmniSharp {", "")
                .Replace("OmniSharp.", "")
                ;

            var lines = result.Split('\n');
            var opens = 0;

            for (var i = 0; i < lines.Length; i++) {
                if (lines[i].Contains('{')) {
                    opens++;
                }
                    if (lines[i].Contains('}')) {
                        opens--;
                    }
                if (opens < 0 && lines[i].TrimEnd().Length == 1) {
                    lines[i] = string.Empty;
                    opens = 0;
                }
            }

            result = string.Join("\n", lines);

            result = "/* tslint:disable */\n" + result + "\n";

            if (!string.IsNullOrWhiteSpace(path))
            {
                File.WriteAllText(Path.Combine(path, "lib", "omnisharp-server.ts"), result);
            }
            else
            {
                Console.Write(result);
                Console.ReadLine();
            }
        }

        private IEnumerable<Type> GetApplicableTypes()
        {
            var allTypes = new [] {
                typeof(OmniSharp.Startup).Assembly,
                typeof(OmniSharp.Models.Request).Assembly,
                typeof(OmniSharp.Models.DnxProject).Assembly,
                typeof(OmniSharp.Models.MSBuildProject).Assembly,
                typeof(OmniSharp.NuGet.OmniSharpSourceRepositoryProvider).Assembly,
                typeof(OmniSharp.Roslyn.BufferManager).Assembly,
                typeof(OmniSharp.Roslyn.CSharp.Services.CodeActions.RoslynCodeActionProvider).Assembly,
                typeof(OmniSharp.ScriptCs.ScriptCsContext).Assembly,
                typeof(OmniSharp.Stdio.StdioServerFactory).Assembly,
            }
                .SelectMany(x => x.GetTypes())
                .ToArray();

            var models = allTypes
                .Where(z => z.IsPublic && z.FullName.StartsWith(OmnisharpControllerExtractor.InferNamespace(typeof(Request)), StringComparison.Ordinal))
                .Select(x => {
                    Console.WriteLine(x.FullName);
                    return x;
                })
                .Where(x => x.Name != nameof(ProjectInformationResponse))
                .Where(x => x.Name != nameof(WorkspaceInformationResponse));

            var stdioProtocol = allTypes
                .Where(z => z.IsPublic && z.FullName.StartsWith(OmnisharpControllerExtractor.InferNamespace(typeof(Packet)), StringComparison.Ordinal))
                .Select(x => {
                    Console.WriteLine(x.FullName);
                    return x;
                });

            var scriptCs = typeof(OmniSharp.ScriptCs.ScriptCsContext);

            return models.Union(stdioProtocol).Union(new[] {typeof(OmniSharp.ScriptCs.ScriptCsContext)}).ToArray();
        }
    }
}
