Remove-Item roslyn -Recurse -Force
mkdir roslyn
pushd roslyn
$client = New-Object System.NET.Webclient
$client.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2;)")
Invoke-WebRequest ($client.DownloadString("https://api.github.com/repos/omnisharp/omnisharp-roslyn/releases/latest") | convertfrom-json).assets[0].browser_download_url -OutFile '.\omnisharp.tar.gz'
tar zxvf omnisharp.tar.gz
Remove-Item omnisharp.tar.gz
Copy-Item approot/* . -Recurse
Remove-Item approot -Recurse
popd

Copy-Item -Force vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
Copy-Item -Force vendor/omnisharp.patch roslyn/omnisharp

iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1'))
$Env:DNX_FEED='https://www.nuget.org/api/v2'
dnvm install 1.0.0-beta4
dnvm use 1.0.0-beta4

pushd vendor/src/OmniSharp.TypeScriptGeneration
dnu restore
dnx . run ../../..
popd
