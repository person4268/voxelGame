import { BlockState } from "server/BlockState"
import { Generic6Side } from "./Generic6Side";
import globals from "shared/globals";
import { Generic5Side1Top } from "./Generic5Side1Top";
import { Generic4Side1Top1Bottom } from "./Generic4Side1Top1Bottom";

/**
 * Finds the correct TextureHandler for block.id and applies it to the block
 * @param block 
 */
function applyTexture(block: BlockState) {
    switch (block.id) {
        case "grass":
            Generic4Side1Top1Bottom(block, globals.textures.grass_side, globals.textures.grass_top, globals.textures.dirt);
        break;
        case "dirt":
            Generic6Side(block, globals.textures.dirt);
            break;
        case "stone":
            Generic6Side(block, globals.textures.stone);
            break;
        case "brick": 
            Generic6Side(block, globals.textures.brick);
            break;
        case "obsidian":
            Generic6Side(block, globals.textures.obsidian);
            break;
        default:
            Generic6Side(block, globals.textures.grid);
            break;
    }
}

export default {
    applyTexture: applyTexture
}