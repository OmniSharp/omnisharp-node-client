rm -rf roslyn
mkdir -p roslyn
pushd roslyn

OMNISHARP_ROSLYN_VERSION=`jq '.["omnisharp-roslyn"]' package.json | sed "s/\"//g"`
wget https://github.com/OmniSharp/omnisharp-roslyn/releases/download/$OMNISHARP_ROSLYN_VERSION/omnisharp.tar.gz
tar zxvf omnisharp.tar.gz
rm -f omnisharp.tar.gz

cp -a approot/* .
rm -rf approot

popd

cp -f vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
cp -f vendor/omnisharp.patch roslyn/omnisharp
chmod +x roslyn/omnisharp
