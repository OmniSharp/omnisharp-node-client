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

mono nuget.exe install kre-clr-win-x86 -Prerelease -OutputDirectory roslyn/packages
if [ ! -d "roslyn/packages/kre-clr-win-x86.1.0.0-beta3" ]; then
    echo 'ERROR: Can not find kre-clr-win-x86.1.0.0-beta3 in output exiting!'
    exit 1
fi
ls -l roslyn/packages/
cp -R roslyn/packages/kre-mono.1.0.0-beta3-11030 roslyn/packages/kre-mono.1.0.0-beta3
if [ ! -d "roslyn/packages/kre-mono.1.0.0-beta3" ]; then
    echo 'ERROR: Can not find kre-mono.1.0.0-beta3 in output exiting!'
    exit 1
fi

cp -f vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
cp -f vendor/omnisharp.patch roslyn/omnisharp
chmod +x roslyn/omnisharp

if ! type kvm > /dev/null 2>&1; then
    curl -sSL https://raw.githubusercontent.com/aspnet/Home/release/kvminstall.sh | sh && source ~/.k/kvm/kvm.sh
fi
export KRE_FEED=https://www.nuget.org/api/v2
kvm install 1.0.0-beta3
kvm use 1.0.0-beta3

pushd vendor/src/OmniSharp.TypeScriptGeneration
kpm restore
k run ../../..
popd
