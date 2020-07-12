const globals = {
    renderDistance: 32,
    blockSize: new Vector3(3, 3, 3),
    reachLength: 3 * 5,
    textures: {
        grid: "rbxassetid://5009068659",
        grass_top: "rbxassetid://5295578161",
        grass_side: "rbxassetid://5295598324",
        dirt: "rbxassetid://5295593115",
        brick: "rbxassetid://5295595753",
        stone: "rbxassetid://5295590108",
        obsidian: "rbxassetid://5295587145"
    },
    fixedTerrainDimensions: new Vector2(10, 10)
}

export default globals
export type blockIds = "generic" | "grass" | "dirt" | "stone" | "brick" | "obsidian"