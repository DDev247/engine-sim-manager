@ECHO OFF

npm run build

mkdir bin
cd bin
del /s /q *
cd ..

npx electron-packager . es-manager --ignore="/src|/public|README|Procfile|.gitignore|pack.bash|/es" --arch="x64" --platform="all" --out="bin"
