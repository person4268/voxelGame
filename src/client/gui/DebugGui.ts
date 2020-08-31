import { createScreenGui, Gui } from "./GuiLib";

function DebugGui(plrGui: PlayerGui) {
    let gui = new Gui(createScreenGui(plrGui));
    gui.createWindow(new UDim2(0, 300, 0, 300), "Debug", true, true);
    let guiTestBtn = gui.createGuiButton(gui.mainContainer, "TestButton", undefined, new UDim2(0, 0, 0, 0), undefined, "Button");
    let guiTestLabel = gui.createGuiLabel(guiTestBtn, "Label", new UDim2(1, 0, 1, 0), new UDim2(1, 5, 0, 0), undefined, "Label");
    guiTestLabel.TextXAlignment = Enum.TextXAlignment.Left;


    let clickCounter = 0;
    guiTestBtn.MouseButton1Click.Connect(()=>{
        clickCounter += 1;
        guiTestLabel.Text = `The button has been clicked ${clickCounter} times!`;
        guiTestBtn.Text = `${clickCounter}`;
    });

    return gui;
}


export default DebugGui;