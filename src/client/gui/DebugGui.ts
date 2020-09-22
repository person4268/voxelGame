import { createScreenGui, Gui } from "./GuiLib";
import { UITable } from "./GuiExtension";

function DebugGui(plrGui: PlayerGui) {
    let gui = new Gui(createScreenGui(plrGui), new UDim2(0, 300, 0, 300), "Debug", true, true);
    let guiTestBtn = gui.createGuiButton(gui.mainContainer, "TestButton", undefined, new UDim2(0, 0, 0, 0), undefined, "Button");
    let guiTestLabel = gui.createGuiLabel(guiTestBtn, "Label", new UDim2(1, 0, 1, 0), new UDim2(1, 5, 0, 0), undefined, "Label");
    guiTestLabel.TextXAlignment = Enum.TextXAlignment.Left;


    let clickCounter = 0;
    guiTestBtn.MouseButton1Click.Connect(()=>{
        clickCounter += 1;
        guiTestLabel.Text = `The button has been clicked ${clickCounter} times!`;
        guiTestBtn.Text = `${clickCounter}`;
    });

    let uiTable = new UITable(gui, gui.mainContainer,["Column 1", "Column 2", "Column 3"], new UDim2(0.9, 0, 0.5, 0), new UDim2(0.05, 0, 0.4, 0));
    uiTable.addRow(0, ["lol", "lol but better", "not lol"]);
    uiTable.addRow(1, ["bruh", "bruh", "bruh faster"]);
    uiTable.addRow(2, ["secret", "super secret", "very secret"]);
    uiTable.addRow(3, ["clear", "clear", "super clear"]);

    uiTable.onRowSelect = function(row: number) {
        switch(row) { 
            case 0:
                guiTestLabel.Text = "lol row";
                break;
            case 1:
                guiTestLabel.Text = "bruh row";
                break;
            case 2:
                guiTestLabel.Text = "Super secret!!";
                uiTable.removeRow(2);
                break;
            case 3:
                guiTestLabel.Text = "Destroyed!!!!";
                uiTable.clearChart();
                break;
        }
    }
    return gui;
}


export default DebugGui;