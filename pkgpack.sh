#!/bin/bash

SELECTED_FLAVOR="linux"

npm run build

rm -rf ./bin/*
mkdir -p ./bin

npx electron-packager . es-manager --ignore="/src|/public|README|Procfile|.gitignore|pack.bash|/es" --arch="x64" --platform="$SELECTED_FLAVOR" --out="bin"

cp -r ./src/themes ./bin/*/
cp ./build/static/media ./bin/es-manager-darwin-x64/es-manager.app/Content/Resources/app/build/static
cp ./build/static/media ./bin/es-manager-linux-x64/resources/app/build/static
cp ./build/static/media ./bin/es-manager-mas-x64/es-manager.app/Content/Resources/app/build/static
cp ./build/static/media ./bin/es-manager-win32-x64/resources/app/build/static

