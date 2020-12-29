import { Item } from "./Items";

//Base class for all inventories, a glorified list to some extent
export class ObjectInventory {
    items: {count: number, item: Item}[] = [];
    slotCount = 27;

    addToSlot(position: number, item: Item) {

    }
}