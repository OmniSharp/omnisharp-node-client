OMNISHARP_ROSLYN_VERSION=`jq '.["omnisharp-roslyn"]' package.json | sed "s/\"//g"`

rm -rf roslyn
mkdir -p roslyn
pushd roslyn

wget https://github.com/OmniSharp/omnisharp-roslyn/releases/download/$OMNISHARP_ROSLYN_VERSION/omnisharp.bootstrap.tar.gz
wget https://github.com/OmniSharp/omnisharp-roslyn/releases/download/$OMNISHARP_ROSLYN_VERSION/omnisharp.tar.gz

tar zxvf omnisharp.bootstrap.tar.gz
rm -f omnisharp.bootstrap.tar.gz

tar zxvf omnisharp.tar.gz
rm -f omnisharp.tar.gz

cp -a approot/* .
rm -rf approot

popd

cp -f vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
cp -f vendor/omnisharp.patch roslyn/omnisharp
rm roslyn/Bootstrapper
rm roslyn/Bootstrapper.cmd
chmod +x roslyn/omnisharp
