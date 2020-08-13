import { createScreenGui, Gui } from "./GuiLib";

function DebugGui(plrGui: PlayerGui) {
    let gui = new Gui(createScreenGui(plrGui));
    gui.createWindow(new UDim2(0, 300, 0, 300), "Debug", true, true);


    return gui;
}


export default DebugGui;