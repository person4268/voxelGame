import { BlockData } from "../Blocks"
import { SimplexNoise } from "./Simplex"
import globals, { blockIds } from "shared/globals"

let simplex = new SimplexNoise();

function fillArray(input: Array<BlockData>, startPos: Vector3, endPos: Vector3, block: blockIds): Array<BlockData> {
    let modified: Array<BlockData> = input;
    for (let y = startPos.Y; y <= endPos.Y; y++) {
        modified.push(new BlockData(new Vector3(startPos.X, y, startPos.Z), block));
    }
    return modified;
}

function fillEmpty(input: Array<BlockData>): Array<BlockData> {
    let modified = input;
    for (let i = 0; i < input.size(); i++) {
        let block = input[i];
        modified = fillArray(modified, block.position.sub(new Vector3(0, 1, 0)), new Vector3(block.position.X, block.position.Y - 7, block.position.Z), "dirt");
        modified = fillArray(modified, block.position.sub(new Vector3(0, 8, 0)), new Vector3(block.position.X, 1, block.position.Z), "stone");
    };
    return modified;
}


function generateChunk(cx: number, cy: number): Array<BlockData> {
    let returnArray: Array<BlockData> = [];
    for (let x = 0 + (globals.chunkSize.X * cx); x < globals.chunkSize.X + (globals.chunkSize.X * cx); x++) {
        for (let z = 0 + (globals.chunkSize.Y * cy); z < globals.chunkSize.Y + (globals.chunkSize.Y * cy); z++) {
            let ypos = math.floor(simplex.noise(x / globals.simplexNoiseDividend, z / globals.simplexNoiseDividend) * globals.simplexNoiseScale) + globals.primaryGenerationHeight
            let blockData = new BlockData(new Vector3(x, ypos, z), "grass");
            returnArray.push(blockData);
            print(blockData.position.X, blockData.position.Y, blockData.position.Z)
            let i = ypos - 1;
            while(i > ypos - globals.dirtToStoneHeight) {
                returnArray.push(new BlockData(new Vector3(x, i, z), "dirt"));
                print("Placing dirt at", x, i, z);
                i--;
            }
            while(i > 0) {
                returnArray.push(new BlockData(new Vector3(x, i, z), "stone"));
                print("Placing stone at", x, i, z);
                i--;
            }
            returnArray.push(new BlockData(new Vector3(x, 0, z), "obsidian"));
            //for(let i=blockData.position.Y-10; i<2; i++) {
            //    returnArray.push(new BlockData(new Vector3(x, i, z), "stone"));
            //}
        }
        wait()
    }
    //returnArray = fillEmpty(returnArray);
    wait()
    return returnArray;
}

export { generateChunk }