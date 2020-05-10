import { BlockState } from "server/BlockState";
import globals from "shared/globals";

function createTexture(assetId: string, side: Enum.NormalId) {
    let texture = new Instance("Decal");
    texture.Face = side;
    texture.Texture = assetId;
    return texture;
}

export abstract class BrickTextureHandler {
    static applyTexture(block: BlockState) {
        createTexture(globals.textures.brick, Enum.NormalId.Back).Parent = block.block;
        createTexture(globals.textures.brick, Enum.NormalId.Top).Parent = block.block;
        createTexture(globals.textures.brick, Enum.NormalId.Left).Parent = block.block;
        createTexture(globals.textures.brick, Enum.NormalId.Front).Parent = block.block;
        createTexture(globals.textures.brick, Enum.NormalId.Right).Parent = block.block;
        createTexture(globals.textures.brick, Enum.NormalId.Bottom).Parent = block.block;
    }
}