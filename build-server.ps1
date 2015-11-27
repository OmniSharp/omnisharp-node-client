$OMNISHARP_ROSLYN_VERSION=(Get-Content package.json | ConvertFrom-Json).'omnisharp-roslyn'

Remove-Item roslyn -Recurse -Force
mkdir roslyn
pushd roslyn

Invoke-WebRequest "https://github.com/OmniSharp/omnisharp-roslyn/releases/download/$OMNISHARP_ROSLYN_VERSION/omnisharp.bootstrap.tar.gz" -OutFile '.\omnisharp.bootstrap.tar.gz'
Invoke-WebRequest "https://github.com/OmniSharp/omnisharp-roslyn/releases/download/$OMNISHARP_ROSLYN_VERSION/omnisharp.tar.gz" -OutFile '.\omnisharp.tar.gz'

tar zxvf omnisharp.bootstrap.tar.gz
Remove-Item omnisharp.bootstrap.tar.gz

tar zxvf omnisharp.tar.gz
Remove-Item omnisharp.tar.gz

Copy-Item approot/* . -Recurse
Remove-Item approot -Recurse
popd

Copy-Item -Force vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
Copy-Item -Force vendor/omnisharp.patch roslyn/omnisharp
Remove-Item -Force roslyn/Bootstrapper.cmd
Remove-Item -Force roslyn/Bootstrapper
Remove-Item -Force roslyn/omnisharp.bootstrap.cmd
Remove-Item -Force roslyn/omnisharp.bootstrap

pushd .
iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1'))
$Env:DNX_FEED='https://www.nuget.org/api/v2'
dnvm install 1.0.0-beta4
dnvm use 1.0.0-beta4
popd

Remove-Item vendor/omnisharp-roslyn -Recurse -Force
mkdir vendor/omnisharp-roslyn
pushd vendor/omnisharp-roslyn

Invoke-WebRequest "https://github.com/OmniSharp/omnisharp-roslyn/archive/$OMNISHARP_ROSLYN_VERSION.tar.gz" -OutFile '.\source.tar.gz'
tar zxvf source.tar.gz
Remove-Item source.tar.gz
$dir = (gci . -Directory)[0].FullName;
Copy-Item $dir\* . -Recurse
Remove-Item $dir -Recurse
dnu restore
popd

pushd vendor/src/OmniSharp.TypeScriptGeneration
dnu restore
dnx . run ../../..
popd
