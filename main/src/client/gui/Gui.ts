import Net from "@rbxts/net";
import WorldGeneratorSelector from "./WorldGeneratorSelector";
import { Gui } from "./GuiLib";
import DebugGui from "./DebugGui";
import WorldGenProgress from "./WorldGenProgress";

let gui: { [key: string]: Gui } = {};

function initalizeAllGuis() {
    print("[Info]: Initializing GUIs");
    let plrGui = game.GetService("Players").LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

    gui["WGS"] = WorldGeneratorSelector(plrGui);
    gui["WGP"] = WorldGenProgress(plrGui);
    if (game.GetService("RunService").IsStudio() || game.GetService("Players").LocalPlayer.Name === "person4268") {
        gui["Debug"] = DebugGui(plrGui);
        gui["Debug"].open();
    }
}

Net.WaitForClientEventAsync("OpenGui").then((event) => {
    event.Connect((guiToOpen: string) => {
        if (gui[guiToOpen]) {
            gui[guiToOpen].open();
        }
    });
});
Net.WaitForClientEventAsync("CloseGui").then((event) => {
    event.Connect((guiToClose: string) => {
        if (gui[guiToClose]) {
            gui[guiToClose].close();
        }
    });
});

function openGui(gui_: string) { /* variable name conflict */
    if(gui_) gui[gui_].open()
}
function closeGui(gui_: string) { /* variable name conflict */
    if(gui_) gui[gui_].close()
}

export { initalizeAllGuis, openGui, closeGui }