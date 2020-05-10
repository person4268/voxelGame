import { BlockState } from "server/BlockState";
import globals from "shared/globals";

function createTexture(assetId: string, side: Enum.NormalId) {
    let texture = new Instance("Decal");
    texture.Face = side;
    texture.Texture = assetId;
    return texture;
}

export abstract class DirtTextureHandler {
    static applyTexture(block: BlockState) {
        createTexture(globals.textures.dirt, Enum.NormalId.Back).Parent = block.block;
        createTexture(globals.textures.dirt, Enum.NormalId.Front).Parent = block.block;
        createTexture(globals.textures.dirt, Enum.NormalId.Left).Parent = block.block;
        createTexture(globals.textures.dirt, Enum.NormalId.Right).Parent = block.block;
        createTexture(globals.textures.dirt, Enum.NormalId.Top).Parent = block.block;
        createTexture(globals.textures.dirt, Enum.NormalId.Bottom).Parent = block.block;
    }
}