rm -rf roslyn
mkdir -p roslyn
pushd roslyn
wget $(curl -s https://api.github.com/repos/omnisharp/omnisharp-roslyn/releases/latest | grep browser_download_url | awk '{ print $2 }' | sed s/\"//g | sed s/,//g)
tar zxvf omnisharp.tar.gz
rm -f omnisharp.tar.gz
cp -a approot/* .
rm -rf approot
popd

cp -f vendor/omnisharp.cmd.patch roslyn/omnisharp.cmd
cp -f vendor/omnisharp.patch roslyn/omnisharp
chmod +x roslyn/omnisharp
