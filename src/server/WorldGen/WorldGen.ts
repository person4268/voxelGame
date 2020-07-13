import { BlockData } from "../Blocks"
import {SimplexNoise} from "./JsSimplex"
import globals from "shared/globals"

function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	return out_min + (x - in_min)*(out_max - out_min)/(in_max - in_min)
}

function generateTerrain(): Array<BlockData> {
    let simplex = new SimplexNoise();
    let returnArray: Array<BlockData> = [];
    for(let x = 0; x < globals.fixedTerrainDimensions.X; x++) {
        for(let y = 0; y < globals.fixedTerrainDimensions.Y; y++) {
            returnArray.push(new BlockData(new Vector3(x, math.floor(simplex.noise(x/globals.simplexNoiseDividend,y/globals.simplexNoiseDividend)*globals.simplexNoiseScale), y), "grass"))
            coroutine.yield();
        }
    }
    return returnArray;
}

export {generateTerrain}