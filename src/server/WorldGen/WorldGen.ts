import { BlockData } from "../Blocks"
import {Simplex} from "./Simplex"
import globals from "shared/globals"

function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	return out_min + (x - in_min)*(out_max - out_min)/(in_max - in_min)
}

function generateTerrain(): Array<BlockData> {
    let returnArray: Array<BlockData> = [];
    for(let x = 0; x < globals.fixedTerrainDimensions.X; x++) {
        for(let y = 0; y < globals.fixedTerrainDimensions.Y; y++) {
            returnArray.push(new BlockData(new Vector3(x, math.floor(Simplex.noise2D(x+0.1,y+0.1)*3), y), "grass"))
            //            returnArray.push(new BlockData(new Vector3(x, math.floor(noise2D(x+0.1,y+0.1)*3), y), "grass"))
        }
        
    }
    return returnArray;
}

export {generateTerrain}