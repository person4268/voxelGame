import { BlockState } from "server/ServerBlockState"
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

type BlockStates = BlockState | BedrockBlockState; // | BlockState2 | BlockState3

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

function fill(startPos: Vector3, endPos: Vector3, block: blockIds, blockData?: Object) {
    //let blockArray: Array<BlockData> = [];
    for (let x = startPos.X; x <= endPos.X; x++) {
        for (let y = startPos.Y; y <= endPos.Y; y++) {
            for (let z = startPos.Z; z <= endPos.Z; z++) {
                //blockArray.push(new BlockData(new Vector3(x, y, z), block, blockData));
                createBlock(new Vector3(x, y, z), block, blockData);
                if (startPos.Z - endPos.Z === 0) break;
            }
            if (startPos.Y - endPos.Y === 0) break;
        }
        if (startPos.X - endPos.X === 0) break;
    }
    //createBlocksFromArray(blockArray);
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

/**
 * Checks if block can be interacted with
 * @param player ROBLOX Player
 * @param block Block, as Part
 * @returns Array[BlockState, canBeInteractedWith]
 */
function interactCheck(player: Player, block: Part): [BlockStates | undefined, boolean] {
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
                            return [clickedOnBlock, true];
                        } else {
                            print("Clicked on block doesn't exist. Maybe exploits?");
                        }
                    }
                }
            }
        }
    }
    return [undefined, false];
}

evtInteract.Connect((player, blockUnknown, blockFace, chosenBlock) => {
    let face = blockFace as Enum.NormalId /* Cause this is what we're passing to it and if it isn't the error is harmless */
    let block = blockUnknown as Part;

    let [clickedOnBlock, interactCheckResult] = interactCheck(player, block);
    if (interactCheckResult && clickedOnBlock) {
        if (clickedOnBlock.interactable) {
            print("Interacted block is interactable. Interacting instead of placing");
            clickedOnBlock.interact(player, face)
        }
        print("Placing Block");
        placeBlockFromOtherBlock(player, clickedOnBlock.position, face, chosenBlock);
    }
});

function deleteBlock(block: BlockStates) {
    if(blocks.get(`${block.position.X},${block.position.Y},${block.position.Z}`) === undefined) {
        warn("Deleting a block that doesn't exist in blocks list. There's an issue here. Proceeding anyways.");
    }
    block.destroyBlock();
    blocks.delete(`${block.position.X},${block.position.Y},${block.position.Z}`);
}

evtDestroy.Connect((player, blockUnknown) => {
    let block = blockUnknown as Part;
    let [clickedOnBlock, interactCheckResult] = interactCheck(player, block);
    if (interactCheckResult && clickedOnBlock) {
        if (!clickedOnBlock.unbreakable) {
            deleteBlock(clickedOnBlock);
        }
    }
});


const Blocks = {blocks, createBlock, deleteBlock, fill, placeBlockFromOtherBlock, createBlocksFromArray, getCorrectBlockState}
export {Blocks, BlockData}