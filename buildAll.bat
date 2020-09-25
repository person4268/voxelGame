@echo off

node %APPDATA%\npm\node_modules\roblox-ts\out\cli.js -p main
cd bin
rojo.exe build -o ../main.rbxm ../main

cd ..
node %APPDATA%\npm\node_modules\roblox-ts\out\cli.js -p menu
cd bin
rojo build -o ../menu.rbxm ../menu

echo Done!
