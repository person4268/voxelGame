import { GlobalServerEvent } from "@rbxts/net";
import globals, { blockIds, itemIds } from "shared/globals";

//Base class for all items
export class Item {
	public maxStack = 64;
	public name = "Generic Item";
	public id:itemIds = "generic";
	public blockId:blockIds | undefined

	// Place the item as block as default behaviour. 
	onUse() {
		if(this.blockId) {

		}
	}
}