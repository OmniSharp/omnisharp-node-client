echo update submodules...
git submodule update --init --recursive
git submodule foreach git pull origin master
pushd vendor/omnisharp-roslyn
./build.sh
popd
rm -rf roslyn
mkdir -p roslyn

cp -a vendor/omnisharp-roslyn/artifacts/build/omnisharp/approot/* roslyn
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

if ! type dnvm > /dev/null 2>&1; then
    curl -sSL https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1 | sh && source ~/.k/dnvm/dnvm.sh
fi
export dnx_FEED=https://www.nuget.org/api/v2
dnvm install 1.0.0-beta4
dnvm use 1.0.0-beta4

pushd vendor/src/OmniSharp.TypeScriptGeneration
kpm restore
k run ../../..
popd

npm --no-git-tag-version version $TRAVIS_TAG -m "updating to $TRAVIS_TAG"
