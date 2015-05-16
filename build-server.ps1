echo update submodules...
git submodule update --init --recursive
git submodule foreach git pull origin master
pushd vendor/omnisharp-roslyn
./build.cmd
popd

if (Test-Path ./roslyn) { Remove-Item ./roslyn -Recurse -Force }
New-Item -ItemType Directory ./roslyn | Out-Null
Copy-Item vendor/omnisharp-roslyn/artifacts/build/omnisharp/approot/* ./roslyn -Recurse
if (!(Test-Path .\NuGet.exe)) {
	Invoke-WebRequest 'https://www.nuget.org/nuget.exe' -OutFile '.\NuGet.exe'
}
# Needed?
#.\nuget.exe install kre-clr-win-x86 -Prerelease -OutputDirectory roslyn/packages
#if (!(Test-Path roslyn/packages/kre-clr-win-x86.1.0.0-beta3)) {
#	echo 'ERROR: Can not find kre-clr-win-x86.1.0.0-beta3 in output exiting!'
#	exit 1
#}

.\nuget.exe install kre-mono -Prerelease -OutputDirectory roslyn/packages
# Temporary until we move to beta4
Copy-Item roslyn/packages/kre-mono.1.0.0-beta3-11030/* roslyn/packages/kre-mono.1.0.0-beta3 -Recurse -Force
Remove-Item roslyn/packages/kre-mono.1.0.0-beta3-11030 -Recurse -Force
if (!(Test-Path roslyn/packages/kre-mono.1.0.0-beta3)) {
	echo 'ERROR: Can not find kre-mono.1.0.0-beta3 in output exiting!'
	exit 1
}

Copy-Item -Force vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
Copy-Item -Force vendor/omnisharp.patch roslyn/omnisharp

iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/release/kvminstall.ps1'))
$Env:KRE_FEED='https://www.nuget.org/api/v2'
kvm install 1.0.0-beta3
kvm use 1.0.0-beta3

pushd vendor/src/OmniSharp.TypeScriptGeneration
kpm restore
k run ../../..
popd
