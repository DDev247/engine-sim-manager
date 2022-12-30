#!/bin/bash
npm run build
mkdir bin
cd bin
rm -rf *
cd ..
npx electron-packager . es-manager --ignore="/src|/public|README|Procfile|.gitignore|pack.bash|/es" --arch="x64" --platform="all" --out="bin"
