import { BlockState } from "server/BlockState"
import { DefaultTextureHandler } from "./DefaultTextureHandler";
import { GrassTextureHandler } from "./GrassTextureHandler"
import { DirtTextureHandler } from "./DirtTextureHandler";
import { StoneTextureHandler } from "./StoneTextureHandler";
import { BrickTextureHandler } from "./BrickTextureHandler";
import { ObsidianTextureHandler } from "./ObsidianTextureHandler";

/**
 * Finds the correct TextureHandler for block.id and applies it to the block
 * @param block 
 */
function applyTexture(block: BlockState) {
    switch (block.id) {
        case "grass":
            GrassTextureHandler.applyTexture(block);
            break;
        case "dirt":
            DirtTextureHandler.applyTexture(block);
            break;
        case "stone":
            StoneTextureHandler.applyTexture(block);
            break;
        case "brick": 
            BrickTextureHandler.applyTexture(block);
            break;
        case "obsidian":
            ObsidianTextureHandler.applyTexture(block);
            break;
        default:
            DefaultTextureHandler.applyTexture(block);
            break;
    }
}

export default {
    applyTexture: applyTexture
}