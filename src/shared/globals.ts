const globals = {
    renderDistance: 32,
    blockSize: new Vector3(3, 3, 3),
    reachLength: 3 * 5,
    textures: {
        grid: "rbxassetid://5009068659",
        grass_top: "rbxassetid://5012474610",
        grass_side: "rbxassetid://5012475243",
        dirt: "rbxassetid://5012509804",
        brick: "rbxassetid://5012476244",
        stone: "rbxassetid://5012478258",
        obsidian: "rbxassetid://5012653602"
    }
}

export default globals
export type blockIds = "generic" | "grass" | "dirt" | "stone" | "brick" | "obsidian"