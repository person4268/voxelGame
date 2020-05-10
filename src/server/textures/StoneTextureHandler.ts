import { BlockState } from "server/BlockState";
import globals from "shared/globals";

function createTexture(assetId: string, side: Enum.NormalId) {
    let texture = new Instance("Decal");
    texture.Face = side;
    texture.Texture = assetId;
    return texture;
}

export abstract class StoneTextureHandler {
    static applyTexture(block: BlockState) {
        createTexture(globals.textures.stone, Enum.NormalId.Back).Parent = block.block;
        createTexture(globals.textures.stone, Enum.NormalId.Top).Parent = block.block;
        createTexture(globals.textures.stone, Enum.NormalId.Left).Parent = block.block;
        createTexture(globals.textures.stone, Enum.NormalId.Front).Parent = block.block;
        createTexture(globals.textures.stone, Enum.NormalId.Right).Parent = block.block;
        createTexture(globals.textures.stone, Enum.NormalId.Bottom).Parent = block.block;
    }
}