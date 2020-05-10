import globals from "./globals";
/**
 * Checks if a block is reachable against globals.reachLength. Returns true if so.
 * @param blockPosition The block's position
 * @param playerPosition The player's position
 */
export function isBlockReachable(blockPosition: Vector3, playerPosition: Vector3):  boolean {
    let blockRealPos = blockPosition.mul(globals.blockSize);
    let distanceFromBlockToPlr = playerPosition.sub(blockPosition).Magnitude;
    if(distanceFromBlockToPlr <= globals.reachLength) {
        return true;
    }
    return false;
}