import { Blocks, BlockData } from "server/Blocks"
import globals from "shared/globals";

function FlatIslandGenerateChunk(cx: number, cy: number) {
    //let returnArray: Array<BlockData> = [];
    for (let x = 0 + (globals.chunkSize.X * cx); x < globals.chunkSize.X + (globals.chunkSize.X * cx); x++) {
        for (let z = 0 + (globals.chunkSize.Y * cy); z < globals.chunkSize.Y + (globals.chunkSize.Y * cy); z++) {
            let ypos = math.floor(globals.primaryGenerationHeight / 2);
            //let blockData = new BlockData(new Vector3(x, ypos, z), "grass");
            //returnArray.push(blockData);
            Blocks.createBlock(new Vector3(x, ypos, z), "grass");
            let i = ypos - 1;
            while (i > ypos - math.floor(globals.dirtToStoneHeight / 2)) {
                //returnArray.push(new BlockData(new Vector3(x, i, z), "dirt"));
                Blocks.createBlock(new Vector3(x, i, z), "dirt");
                i--;
            }
            while (i > 0) {
                Blocks.createBlock(new Vector3(x, i, z), "stone");
                i--;
            }
            //returnArray.push(new BlockData(new Vector3(x, 0, z), "obsidian"));
            Blocks.createBlock(new Vector3(x, 0, z), "obsidian");
        }
    }
    //wait();
    //return returnArray;
}

export { FlatIslandGenerateChunk }