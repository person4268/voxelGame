import { isBlockReachable } from "shared/isBlockReachable";
import Net from "@rbxts/net"
import { blockIds } from "shared/globals";
let Players = game.GetService("Players");
let player = Players.LocalPlayer
let mouse = Players.LocalPlayer.GetMouse();
let hoveredOnBlock: Part | undefined;
let hoveredFace: Enum.NormalId;
let selectedBlock: blockIds = "generic";

async function startHover(block: Part) {
    function enableHoverEffect(part: Part) {
        let children = part.GetChildren()
        children.every((child, index, array)=>{
            if(classIs(child, "Texture")) {
                let childTexture = child as Texture;
                childTexture.Transparency = 0.2;
            }
            return true;
        });
    }
    function disableHoverEffect(part: Part) {
        let children = part.GetChildren()
        children.every((child, index, array)=>{
            if(classIs(child, "Texture")) {
                let childTexture = child as Texture;
                childTexture.Transparency = 0;
            }
            return true;
        });
    }

    enableHoverEffect(block);
    hoveredOnBlock = block;
    hoveredFace = mouse.TargetSurface;
    while(true) { /* We made ourselves an async function so that we can loop and check if we're still hovering */
        if(mouse.Target !== block) {
            disableHoverEffect(block);
            hoveredOnBlock = undefined;
            return;
        }
        wait(0.05);
    }
}

player.CharacterAdded.Connect(() => {
    if (player.Character) {
        let head = player.Character.WaitForChild("Head", 30) as Part;
        if (head) {
            while (true) {
                if (mouse.Target && isBlockReachable(mouse.Target.Position, head.Position) && classIs(mouse.Target, "Part") && mouse.Target.Parent === game.Workspace.WaitForChild("Blocks")) {
                    startHover(mouse.Target);
                }
                wait()
            }
        }
    }
});

mouse.Button2Down.Connect(()=>{
    if(hoveredOnBlock) {
        Net.WaitForClientEventAsync("InteractBlock").then(event=>{
            event.SendToServer(hoveredOnBlock, hoveredFace, selectedBlock);
        })
    }
});

mouse.Button1Down.Connect(()=>{
    if(hoveredOnBlock) {
        Net.WaitForClientEventAsync("DestroyBlock").then(event=>{
            event.SendToServer(hoveredOnBlock, hoveredFace, selectedBlock);
        })
    }
});


export {}