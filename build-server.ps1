$OMNISHARP_ROSLYN_VERSION=(Get-Content package.json | ConvertFrom-Json).'omnisharp-roslyn'

pushd .
iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1'))
$Env:DNX_UNSTABLE_FEED='https://www.myget.org/F/aspnetcidev/api/v2'
dnvm install 1.0.0-rc2-16388 -u
dnvm use 1.0.0-rc2-16388
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
dnx run ../../..
popd
