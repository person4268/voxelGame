import { BlockState } from "server/BlockState";
import globals from "shared/globals";

function createTexture(assetId: string, side: Enum.NormalId) {
    let texture = new Instance("Texture");
    texture.Face = side;
    texture.Texture = assetId;
    texture.StudsPerTileU = 6; /* Specific to this tiling texture to make it larger */
    texture.StudsPerTileV = 6; 
    return texture;
}

export abstract class DefaultTextureHandler {
    static applyTexture(block: BlockState) {
        createTexture(globals.textures.grid, Enum.NormalId.Back).Parent = block.block;
        createTexture(globals.textures.grid, Enum.NormalId.Front).Parent = block.block;
        createTexture(globals.textures.grid, Enum.NormalId.Left).Parent = block.block;
        createTexture(globals.textures.grid, Enum.NormalId.Right).Parent = block.block;
        createTexture(globals.textures.grid, Enum.NormalId.Top).Parent = block.block;
        createTexture(globals.textures.grid, Enum.NormalId.Bottom).Parent = block.block;
    }
}