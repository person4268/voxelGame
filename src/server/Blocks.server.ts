import { BlockState } from "server/BlockState"
import globals, { blockIds } from "shared/globals"
import Net from "@rbxts/net";
import { isBlockReachable } from "shared/isBlockReachable";
import { BedrockBlockState } from "./BedrockBlockState";

let evtInteract = Net.CreateEvent("InteractBlock");
let evtDestroy = Net.CreateEvent("DestroyBlock");

class BlockData {
    public position: Vector3 = new Vector3(0, 0, 0);
    public id: blockIds = "generic";
    public blockData: Object | undefined = undefined;
    constructor(_position: Vector3, _id: blockIds, _blockData?: Object) {
        this.position = _position;
        this.id = _id;
        this.blockData = _blockData;
    }
}

type BlockStates = BlockState; // | BlockState2 | BlockState3

/* In format of x,y,z */
let blocks: Map<String, BlockStates> = new Map();

/**
 * Gets the correct block state for specified id because a block might want to have its own blockstate
 * @param id 
 */
function getCorrectBlockState(id: blockIds) {
    switch (id) {
        case "obsidian": 
            return BedrockBlockState;
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
    blocks.set(`${position.X},${position.Y},${position.Z}`, newBlockState);
}

function createBlocksFromArray(blocks: Array<BlockData>): void {
    blocks.forEach((block) => {
        createBlock(block.position, block.id, block.blockData);
    });
}

function fill(startX: number, startY: number, startZ: number, endX: number, endY: number, endZ: number, block: blockIds, blockData?: Object) {
    let blockArray: Array<BlockData> = [];
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            for (let z = startZ; z <= endZ; z++) {
                blockArray.push(new BlockData(new Vector3(x, y, z), block, blockData));
                if (startZ - endZ === 0) break;
            }
            if (startY - endY === 0) break;
        }
        if (startX - endX === 0) break;
    }
    createBlocksFromArray(blockArray);
}

function placeBlockFromOtherBlock(player: Player, blockPosition: Vector3, face: Enum.NormalId, chosenBlock: any) {
    let newBlockPos: Vector3 = blockPosition;
    let block = chosenBlock as blockIds; /* For now just hope that it's real. if not it'll get rendered as generic anyways */
    switch (face) {
        case Enum.NormalId.Back:
            newBlockPos = blockPosition.add(new Vector3(0, 0, 1));
            break;
        case Enum.NormalId.Bottom:
            newBlockPos = blockPosition.add(new Vector3(0, -1, 0));
            break;
        case Enum.NormalId.Top:
            newBlockPos = blockPosition.add(new Vector3(0, 1, 0));
            break;
        case Enum.NormalId.Front:
            newBlockPos = blockPosition.add(new Vector3(0, 0, -1));
            break;
        case Enum.NormalId.Left:
            newBlockPos = blockPosition.add(new Vector3(-1, 0, 0));
            break;
        case Enum.NormalId.Right:
            newBlockPos = blockPosition.add(new Vector3(1, 0, 0));
            break;
        default:
            error("Invalid Enum in placeBlockFromOtherBlock!!!!!!!")
    }
    print("New block position is " + newBlockPos.X + "," + newBlockPos.Y + "," + newBlockPos.Z);
    if (!blocks.get(`${newBlockPos.X},${newBlockPos.Y},${newBlockPos.Z}`)) { /* If this block did exist then user is either an exploiter or used bug to place on side with block or nonconventional hitbox */
        print("Creating block as " + block);
        createBlock(newBlockPos, block);
    }
}

function interactCheck(player: Player, block: Part): [BlockStates|undefined, Vector3, boolean] {
    if (player.Character) {
        let head = player.Character.WaitForChild("Head") as Part | undefined;
        if (head) {
            if (typeIs(block, "Instance")) {
                if (classIs(block, "Part")) {
                    if (isBlockReachable(block.Position, head.Position)) {
                        /* After all that type checking nonsense we can actually do things */
                        let dividedPos = block.Position.div(globals.blockSize);
                        let clickedOnBlock = blocks.get(`${dividedPos.X},${dividedPos.Y},${dividedPos.Z}`);
                        if (clickedOnBlock) {
                            return [clickedOnBlock, dividedPos,true];
                        } else {
                            print("Clicked on block doesn't exist. Maybe exploits?");
                        }
                    }
                }
            }
        }
    }
    return [undefined, new Vector3(0,0,0), false];
}

evtInteract.Connect((player, blockUnknown, blockFace, chosenBlock) => {
    let face = blockFace as Enum.NormalId /* Cause this is what we're passing to it and if it isn't the error is harmless */
    let block = blockUnknown as Part;

    let [clickedOnBlock, dividedPos, interactCheckResult] = interactCheck(player, block);
    if(interactCheckResult && clickedOnBlock) {
        if (clickedOnBlock.interactable) {
            print("Interacted block is interactable. Interacting instead of placing");
            clickedOnBlock.interact(player, face)
        }
        print("Placing Block");
        placeBlockFromOtherBlock(player, dividedPos, face, chosenBlock);
    }
});

function deleteBlock(block: BlockStates) {
    block.destroyBlock();
    blocks.delete(`${block.position.X},${block.position.Y},${block.position.Z}`);
}

evtDestroy.Connect((player, blockUnknown)=>{
    let block = blockUnknown as Part;
    let [clickedOnBlock, dividedPos, interactCheckResult] = interactCheck(player, block);
    if(interactCheckResult && clickedOnBlock) {
        if(!clickedOnBlock.unbreakable) {
            deleteBlock(clickedOnBlock);
        }
    }    
})

const startingPlatformX = 25
const startingPlatformZ = 25
fill(-startingPlatformX, 0, -startingPlatformZ, startingPlatformX, 0, startingPlatformZ, "obsidian");
fill(-startingPlatformX, 1, -startingPlatformZ, startingPlatformX, 20, startingPlatformZ, "dirt");
fill(-startingPlatformX, 21, -startingPlatformZ, startingPlatformX, 21, startingPlatformZ, "grass");