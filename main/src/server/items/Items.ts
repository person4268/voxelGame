import { GlobalServerEvent } from "@rbxts/net";
import globals, { blockIds } from "shared/globals";

//Base class for all items
export class Item {
    public maxStack = 64;
    public name = "Generic Item";
    public id:blockIds = "generic";

    // Place the item as block as default behaviour. 
    onUse() {

    }
}