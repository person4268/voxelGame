import { BlockState } from "server/BlockState";
import globals from "shared/globals";

function createTexture(assetId: string, side: Enum.NormalId) {
    let texture = new Instance("Decal");
    texture.Face = side;
    texture.Texture = assetId;
    return texture;
}

export function Generic5Side1Top(block: BlockState, textureSide: string, textureTop: string) {
        createTexture(textureSide, Enum.NormalId.Back).Parent = block.block;
        createTexture(textureTop, Enum.NormalId.Top).Parent = block.block;
        createTexture(textureSide, Enum.NormalId.Left).Parent = block.block;
        createTexture(textureSide, Enum.NormalId.Front).Parent = block.block;
        createTexture(textureSide, Enum.NormalId.Right).Parent = block.block;
        createTexture(textureSide, Enum.NormalId.Bottom).Parent = block.block;
}