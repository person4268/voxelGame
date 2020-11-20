# VoxelGame

An attempt at creating a Minecraft clone game in Roblox using roblox-ts. Currently features terrian generation and an incomplete GUI system.

## Compiling
1. `npm install -g roblox-ts`
2. `cd menu; npm install; cd ../main; npm install; cd ..`
3. Install rojo and add it to your path.
4. `rbxtsc -p ./menu; rbxtsc -p ./main`
5. Add rojo to your path and use it in ./main and ./menu to compile into project files.

## Setting up Rojo watch mode
1. Install the Rojo ROBLOX Studio plugin
2. `cd main` or `cd menu`
3. `rbxtsc -w &`
4. `../bin/rojo serve`
5. Open the Rojo tab in RBXStudio and click connect

## Credits
Textures:
`© 2010-2012 celeron55, Perttu Ahola <celeron55@gmail.com> Many textures improved or remade by Calinou or other contributors, see LICENSE.md on https://gitorious.org/calinou/carbone`
