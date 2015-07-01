rm -rf roslyn
mkdir -p roslyn
pushd roslyn
wget $(curl -s https://api.github.com/repos/omnisharp/omnisharp-roslyn/releases/latest | grep browser_download_url | awk '{ print $2 }' | sed s/\"//g | sed s/,//g)
tar zxvf omnisharp.tar.gz
rm -f omnisharp.tar.gz
cp -a approot/* .
rm -rf approot
popd

curl -LO http://nuget.org/nuget.exe
mono nuget.exe install dnx-clr-win-x86 -Prerelease -OutputDirectory roslyn/packages

if [ ! -d "roslyn/packages/dnx-clr-win-x86.1.0.0-beta4" ]; then
    echo 'ERROR: Can not find dnx-clr-win-x86.1.0.0-beta4 in output exiting!'
    exit 1
fi

if [ ! -d "roslyn/packages/dnx-mono.1.0.0-beta4" ]; then
    echo 'ERROR: Can not find dnx-mono.1.0.0-beta4 in output exiting!'
    exit 1
fi

cp -f vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
cp -f vendor/omnisharp.patch roslyn/omnisharp
chmod +x roslyn/omnisharp
