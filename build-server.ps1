$client = New-Object System.NET.Webclient
$client.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2;)")
$json = $client.DownloadString("https://api.github.com/repos/omnisharp/omnisharp-roslyn/releases/latest") | convertfrom-json

Remove-Item roslyn -Recurse -Force
mkdir roslyn
pushd roslyn
Invoke-WebRequest ($json.assets[0].browser_download_url) -OutFile '.\omnisharp.tar.gz'
tar zxvf omnisharp.tar.gz
Remove-Item omnisharp.tar.gz
Copy-Item approot/* . -Recurse
Remove-Item approot -Recurse
popd

Copy-Item -Force vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
Copy-Item -Force vendor/omnisharp.patch roslyn/omnisharp

pushd .
iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1'))
$Env:DNX_FEED='https://www.nuget.org/api/v2'
dnvm install 1.0.0-beta4
dnvm use 1.0.0-beta4
popd

Remove-Item vendor/omnisharp-roslyn -Recurse -Force
mkdir vendor/omnisharp-roslyn
pushd vendor/omnisharp-roslyn
Invoke-WebRequest ($json.tarball_url) -OutFile '.\source.tar.gz'
tar zxvf source.tar.gz
Remove-Item source.tar.gz
$dir = (gci . -Directory)[0].FullName;
Copy-Item $dir\* . -Recurse
Remove-Item $dir -Recurse
popd

pushd vendor/src/OmniSharp.TypeScriptGeneration
dnu restore
dnx . run ../../..
popd
