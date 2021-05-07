import { GlobalServerEvent } from "@rbxts/net";

import { BlockState } from "server/ServerBlockState";
import globals, { blockIds, itemIds } from "shared/globals";

//Base class for all items
export class Item {
	public maxStack = 64;
	public name = "Generic Item";
	public id:itemIds = "generic";
	public blockId:blockIds | undefined = "generic";

	// Place the item as block as default behaviour. 
	onUse(clickedOnBlock: BlockState | undefined, face: Enum.NormalId | undefined) {
		if(this.blockId && clickedOnBlock && face) {
			let offset: Vector3;
			switch(face) {
				case Enum.NormalId.Top:
					offset = new Vector3(0, 1, 0)
					break;
				case Enum.NormalId.Bottom:
					offset = new Vector3(0, -1, 0);
					break;
				case Enum.NormalId.Left:
					offset = new Vector3(-1, 0, 0);
					break;
				case Enum.NormalId.Right:
					offset = new Vector3(1, 0, 0);
					break;
				case Enum.NormalId.Front:
					offset = new Vector3(0, 0, -1);
					break;
				default: // Enum.NormalId.Back
					offset = new Vector3(0, 0, 1);
					break;
			}

			Blocks.createBlock(clickedOnBlock.position.add(offset), this.blockId);
		}
	}
}