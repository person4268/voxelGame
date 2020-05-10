import { BlockState } from "server/BlockState"
import { DefaultTextureHandler } from "./DefaultTextureHandler";

/**
 * Finds the correct TextureHandler for block.id and applies it to the block
 * @param block 
 */
function applyTexture(block: BlockState) {
    switch (block.id) {
        default:
            DefaultTextureHandler.applyTexture(block);
    }
}

export default {
    applyTexture: applyTexture
}