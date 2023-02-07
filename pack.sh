#!/bin/bash

BUILD_FLAVORS="linux windows macos all"

echo "Build for: "
SELECTED_FLAVOR=""
select FLAVOR in $BUILD_FLAVORS; do
    SELECTED_FLAVOR=$FLAVOR
    break
done

npm run build

rm -rf ./bin/*
mkdir -p ./bin

npx electron-packager . esmanager --ignore="/src|/public|README|Procfile|.gitignore|pack.sh|/es" --arch="x64" --platform="$SELECTED_FLAVOR" --out="bin"

cp -r ./src/themes ./bin/*/

echo

if [[ $SELECTED_FLAVOR == "linux" ]]; then
    cp ./setupWine.sh ./bin/esmanager-linux-x64/esmanager
    cp ./runWine.sh ./bin/esmanager-linux-x64/esmanager
    read -p "Install to '/usr/bin'? " inp
    [[ $inp =~ "^[yY]$" ]] && sudo ln -s ./bin/esmanager-linux-x64/esmanager /usr/bin/esmanager
fi

exit 0;
