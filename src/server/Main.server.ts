import { Blocks } from "./Blocks"
import { SimplexGenerateChunk } from "./WorldGen/SimplexGen";
import Net from "@rbxts/net";
import { FlatIslandGenerateChunk } from "./WorldGen/FlatIslandGen";
import globals from "shared/globals";

let OpenGui = Net.CreateEvent("OpenGui");
let CloseGui = Net.CreateEvent("CloseGui");
let WGSelection = Net.CreateEvent("WGSelection");

print("[Info]: ServerMain");

let generator: string = "";
function createChunk(cx: number, cy: number) {
    switch (generator) {
        case "Simplex":
            Blocks.createBlocksFromArray(SimplexGenerateChunk(cx, cy));
            break;
        case "FlatIsland":
            Blocks.createBlocksFromArray(FlatIslandGenerateChunk(cx, cy));
            break;
        case "Plane":
            Blocks.fill(new Vector3(globals.chunkSize.X * cx, 0, globals.chunkSize.Y * cy), new Vector3((globals.chunkSize.X * cx) + globals.chunkSize.X, 0, (globals.chunkSize.Y * cy) + globals.chunkSize.Y), "obsidian");
            break;
        default:
    }
    wait()
}

game.GetService("Players").CharacterAutoLoads = false;


let firstJoiningPlayer: Player;
let alreadySetFirstPlayer = false;
game.GetService("Players").PlayerAdded.Connect((player) => {
    if (!alreadySetFirstPlayer) {
        firstJoiningPlayer = player;
        print("First player is", player.Name);
        OpenGui.SendToPlayer(player, "WGS");
        alreadySetFirstPlayer = true;
    }
});

WGSelection.Connect((plr: Player, Generator) => {
    if (plr.Name === firstJoiningPlayer.Name) {
        generator = Generator as string;
        print("[Info]: User chose " + generator + "generator.");
        startGeneration();
    } else {
        warn("[Warn]: Player that is not first player has selected a WorldGen. Ignoring");
    }
});

function startGeneration() {
    /*

    -1,1  0,1  1,1

    -1,0, 0,0  1,0

    -1,-1 0,-1 1,-1
    */
    createChunk(0, 0);
    createChunk(0, 1);
    createChunk(-1, 0);
    createChunk(-1, 1);
    createChunk(1, 0);
    createChunk(1, 1);
    createChunk(-1, -1);
    createChunk(0, -1);
    createChunk(1, -1);
    onGenerationEnd();
}

function onGenerationEnd() {
    game.GetService("Players").CharacterAutoLoads = true;
    game.GetService("Players").GetChildren().forEach((player) => {
        (player as Player).LoadCharacter();
    });

    CloseGui.SendToPlayer(firstJoiningPlayer, "WGS");
}

export { }