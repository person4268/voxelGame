import { BlockState } from "server/BlockState"
import globals from "shared/globals"

/**
 * Gets the correct block state for specified id because a block might want to have its own blockstate
 * @param id 
 */
function getCorrectBlockState(id:string) {
    switch(id) {
        default: 
            return BlockState;
    }
}

function createBlock(position: Vector3, id: string): void {
    id = id.lower();
    let newBlockState = new (getCorrectBlockState(id))();
    newBlockState.position = position;
    newBlockState.id = id;
    newBlockState.createBlock();
}

createBlock(new Vector3(1, 1, 1), "generic")