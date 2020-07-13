import { Blocks } from "./Blocks"
import { generateChunk } from "./WorldGen/WorldGen";

Blocks.fill(new Vector3(-5, -12, -5), new Vector3(5, -12, 5), "obsidian");
Blocks.createBlocksFromArray(generateChunk(0, 0));
Blocks.createBlocksFromArray(generateChunk(0, 1));

export {}