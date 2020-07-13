import { Blocks } from "./Blocks"
import { generateChunk } from "./WorldGen/WorldGen";


/*

-1,1  0,1  1,1

-1,0, 0,0  1,0

-1,-1 0,-1 1,-1
*/

function createChunk(cx: number, cy: number) {
    Blocks.createBlocksFromArray(generateChunk(cx, cy));
    wait()
}


game.GetService("Players").CharacterAutoLoads = false;

createChunk(0, 0);
createChunk(0, 1);
createChunk(-1, 0);
createChunk(-1, 1);
createChunk(1, 0);
createChunk(1, 1);
createChunk(-1, -1);
createChunk(0, -1);
createChunk(1, -1);
game.GetService("Players").CharacterAutoLoads = true;
game.GetService("Players").GetChildren().forEach((player)=>{
    (player as Player).LoadCharacter()
})

export {}