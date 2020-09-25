#!/usr/bin/env bash
# Probably works
if [ "$(uname)" == "Darwin" ]; then
    rbxtsc -p menu
    rbxtsc -p main
    chmod +x bin/rojo-mac
    ./bin/rojo-mac -o main.rbxlx main
    ./bin/rojo-mac -o menu.rbxlx menu
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    rbxtsc -p menu
    rbxtsc -p main
    chmod +x bin/rojo-linux
    ./bin/rojo-linux -o main.rbxlx main
    ./bin/rojo-linux -o menu.rbxlx menu
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    echo "Use buildAll.bat!"
    exit -1
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    echo "Use buildAll.bat!"
    exit -1
fi