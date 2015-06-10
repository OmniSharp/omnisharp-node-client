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

Copy-Item -Force vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
Copy-Item -Force vendor/omnisharp.patch roslyn/omnisharp

iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1'))
$Env:DNX_FEED='https://www.nuget.org/api/v2'
dnvm install 1.0.0-beta4
dnvm use 1.0.0-beta4

pushd vendor/src/OmniSharp.TypeScriptGeneration
kpm restore
k run ../../..
popd
