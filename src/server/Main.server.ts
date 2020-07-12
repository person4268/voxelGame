import { Blocks } from "./Blocks"
import { generateTerrain } from "./WorldGen/WorldGen";

Blocks.fill(new Vector3(-5, -12, -5), new Vector3(5, -12, 5), "obsidian");
Blocks.createBlocksFromArray(generateTerrain());

export {}