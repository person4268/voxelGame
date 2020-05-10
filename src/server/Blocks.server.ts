import { BlockState } from "server/BlockState"
import globals, { blockIds } from "shared/globals"

class BlockData {
    public position: Vector3 = new Vector3(0, 0, 0);
    public id: blockIds = "generic";
    public blockData:Object|undefined = undefined;
    constructor(_position:Vector3, _id:blockIds, _blockData?:Object) {
        this.position = _position;
        this.id = _id;
        this.blockData = _blockData;
    }
}

type BlockStates = BlockState; // | BlockState2 | BlockState3

let blocks: Map<Vector3, BlockStates> = new Map();

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

function createBlock(position: Vector3, id: blockIds, blockData?: Object): void {
    let newBlockState = new (getCorrectBlockState(id))();
    newBlockState.position = position;
    newBlockState.id = id;
    newBlockState.blockData = blockData;
    newBlockState.createBlock();
    blocks.set(position, newBlockState);
}

function createBlocksFromArray(blocks: Array<BlockData>): void {
    blocks.forEach((block)=>{
        createBlock(block.position, block.id, block.blockData);
    });
}

function fill(startX: number, startY: number, startZ: number, endX: number, endY: number, endZ: number, block: blockIds, blockData?: Object) {
    let blockArray:Array<BlockData> = [];
    for(let x = startX; x <= endX; x++) {
        for(let y = startY; y <= endY; y++) {
            for(let z = startZ; z <= endZ; z++) {
                blockArray.push(new BlockData(new Vector3(x, y, z), block, blockData));
                if(startZ - endZ === 0) break;
            }
            if(startY - endY === 0) break;
        }
        if(startX - endX === 0) break;
    }
    createBlocksFromArray(blockArray);
}

fill(-10, 0, -10, 10, 0, 10, "generic");