import Net from "@rbxts/net";
import {WGSCreate} from "./WorldGeneratorSelector"
import { Gui } from "./GuiLib";

let gui: {[key: string]: Gui} = {};

function initalizeAllGuis() {
    print("[Info]: Initializing GUIs");
    let plrGui = game.GetService("Players").LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

    gui["WGS"] = WGSCreate(plrGui);

}

Net.WaitForClientEventAsync("OpenGui").then((event)=>{
    event.Connect((guiToOpen: string)=>{
        if(gui[guiToOpen]) {
            gui[guiToOpen].open();
        }
    });
});
Net.WaitForClientEventAsync("CloseGui").then((event)=>{
    event.Connect((guiToClose: string)=>{
        if(gui[guiToClose]) {
            gui[guiToClose].close();
        }
    });
});


export { initalizeAllGuis }