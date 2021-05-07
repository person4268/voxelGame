import { BlockState } from "server/ServerBlockState";
import globals from "shared/globals";

function createTexture(assetId: string, side: Enum.NormalId) {
	let texture = new Instance("Decal");
	texture.Face = side;
	texture.Texture = assetId;
	return texture;
}

export function Generic6Side(block: BlockState, texture: string) {
		createTexture(texture, Enum.NormalId.Back).Parent = block.block;
		createTexture(texture, Enum.NormalId.Top).Parent = block.block;
		createTexture(texture, Enum.NormalId.Left).Parent = block.block;
		createTexture(texture, Enum.NormalId.Front).Parent = block.block;
		createTexture(texture, Enum.NormalId.Right).Parent = block.block;
		createTexture(texture, Enum.NormalId.Bottom).Parent = block.block;
}