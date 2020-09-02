import { Gui } from "./GuiLib";

function addUDim2(udims: Array<UDim2>, addX = true, addY = true): UDim2 {
    let udimCounter = new UDim2();
    udims.forEach((udim)=>{
        if(addX && addY) udimCounter = udimCounter.add(udim);
        if(addX) udimCounter = new UDim2(udimCounter.X.Scale + udim.X.Scale, udimCounter.X.Offset + udim.X.Offset, udimCounter.Y.Scale, udimCounter.Y.Offset);
        if(addY) udimCounter = new UDim2(udimCounter.X.Scale, udimCounter.X.Offset, udimCounter.Y.Scale + udim.Y.Scale, udimCounter.Y.Offset + udim.Y.Offset);
    })
    return udimCounter;
}

/**
 * Roblox doesn't have a way to create borders on frames with transparent backgrounds. This creates 4 white frames to circumvent that. 
 */
function createBorder(parent: GuiObject, borderWidth = 1, borderColor = new Color3(1, 1, 1), borderTransparency = 0): Array<Frame> {
        // Method of creating border with transparent contents, iirc no other way
        let borderLeft = new Instance("Frame");
        borderLeft.Size = new UDim2(0, borderWidth, 1, 0);
        borderLeft.BorderSizePixel = 0;
        borderLeft.BackgroundColor3 = borderColor;
        borderLeft.Transparency = borderTransparency;
        borderLeft.Name = "BL";
        borderLeft.Parent = parent;

        let borderRight = new Instance("Frame");
        borderRight.Size = new UDim2(0, borderWidth, 1, 0);
        borderRight.BorderSizePixel = 0;
        borderRight.Position = new UDim2(1, 0, 0, 0);
        borderRight.AnchorPoint = new Vector2(1, 0);
        borderRight.BackgroundColor3 = borderColor;
        borderRight.Transparency = borderTransparency;
        borderRight.Name = "BR";
        borderRight.Parent = parent;

        let borderTop = new Instance("Frame");
        borderTop.Size = new UDim2(1, 0, 0, borderWidth);
        borderTop.BorderSizePixel = 0;
        borderTop.BackgroundColor3 = borderColor;
        borderTop.Transparency = borderTransparency;
        borderTop.Name = "BT";
        borderTop.Parent = parent;

        let borderBottom = new Instance("Frame");
        borderBottom.Size = new UDim2(1, 0, 0, borderWidth);
        borderBottom.BorderSizePixel = 0;
        borderBottom.AnchorPoint = new Vector2(0, 1);
        borderBottom.Position = new UDim2(0, 0, 1, 0);
        borderBottom.BackgroundColor3 = borderColor;
        borderBottom.Transparency = borderTransparency;
        borderBottom.Name = "BB";
        borderBottom.Parent = parent;

        return [borderTop, borderBottom, borderLeft, borderRight];
}

class UITable { 

    columns: Array<String>
    columnCount: Number
    allowSorting: Boolean
    gui: Gui
    values: Array<Array<any>> | undefined;
    tableFrame: Frame;

    constructor(gui: Gui, parent: GuiObject, columns: Array<String>, allowSorting = true, size: UDim2, position: UDim2) {
        this.columns = columns;
        this.columnCount = columns.size();
        this.allowSorting = allowSorting;
        this.gui = gui;

        this.tableFrame = this.gui.createInvisibleFrame(parent, "Table", size, position, undefined);
        createBorder(this.tableFrame, undefined, undefined, 0.3);


    }
}

export { addUDim2, UITable }

