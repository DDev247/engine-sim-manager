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

npx electron-packager . es-manager --ignore="/src|/public|README|Procfile|.gitignore|pack.bash|/es" --arch="x64" --platform="$SELECTED_FLAVOR" --out="bin"

cp -r ./src/themes ./bin/*/

echo

if [[ $SELECTED_FLAVOR == "linux" ]]; then
    read -p "Install to '/usr/bin'? " inp
    [[ $inp =~ "^[yY]$" ]] && sudo ln -s ./bin/es-manager-linux-x64/es-manager /usr/bin/es-manager
fi

exit 0;
