import { Gui } from "./GuiLib";
import { DraggableObject } from "./DraggableObject";

function addUDim2(udims: Array<UDim2>, addX = true, addY = true): UDim2 {
    let udimCounter = new UDim2();
    udims.forEach((udim) => {
        if (addX && addY) udimCounter = udimCounter.add(udim);
        if (addX) udimCounter = new UDim2(udimCounter.X.Scale + udim.X.Scale, udimCounter.X.Offset + udim.X.Offset, udimCounter.Y.Scale, udimCounter.Y.Offset);
        if (addY) udimCounter = new UDim2(udimCounter.X.Scale, udimCounter.X.Offset, udimCounter.Y.Scale + udim.Y.Scale, udimCounter.Y.Offset + udim.Y.Offset);
    })
    return udimCounter;
}

/**
 * Roblox doesn't have a way to create borders on frames with transparent backgrounds. This creates 4 white frames to circumvent that. 
 */
function createBorder(parent: GuiObject, borderWidth = 1, borderColor = Color3.fromRGB(13, 20, 26), borderTransparency = 0): { "borders": Array<Frame>, "containingFrame": Frame } {
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

    let containing = new Instance("Frame");
    containing.BorderSizePixel = 0;
    containing.BackgroundTransparency = 1;
    containing.Size = new UDim2(1, -2, 1, -1);
    containing.Position = new UDim2(0, 1, 0, 0);
    containing.Parent = parent;

    return { "borders": [borderTop, borderBottom, borderLeft, borderRight], "containingFrame": containing };
}

class UITable {

    columns: Array<String>
    columnCount: Number
    allowSorting: Boolean
    gui: Gui
    tableFrame: Frame;
    columnBar: Frame;
    parent: GuiObject
    tableData: Map<string, Array<string>>;
    mainFrame: Frame;
    columnFrames: Map<number, { "name": string, "frame": Frame, width: number }> = new Map();
    getPositionFromIndex(index: number): number {
        if (index === 0) return 0;
        if (this.columnFrames) {
            let res = this.columnFrames.get(index - 1);
            if (res) {
                print(res.frame.Position.X.Offset + res.width)
                return res.frame.Position.X.Offset + res.width;
            }
        }
        return 0;
    }
    createColumnTab(name: string, index: number, createDragger = true) {
        let data: { "name": string, "frame": Frame, width: number } = { "name": name, "frame": new Instance("Frame"), "width": 10 };
        let containerFrame = this.gui.createInvisibleFrame(this.mainFrame, name, new UDim2(0, data.width, 1 - this.columnBar.Size.Y.Scale, -this.columnBar.Size.Y.Offset), new UDim2(0, this.getPositionFromIndex(index), this.columnBar.Size.Y.Scale, this.columnBar.Size.Y.Offset));
        data.frame = containerFrame;

        let titleText = this.gui.createGuiLabel(this.columnBar, name, new UDim2(0, data.width, 1, 0), new UDim2(0, this.getPositionFromIndex(index), 0, 0), undefined, name);
        titleText.TextXAlignment = Enum.TextXAlignment.Left;
        titleText.TextWrapped = true; /* Because of the lack of vertical space in the textlabel, this effectively crops it off */
        if (createDragger) {
            let titleDragger = this.gui.createInvisibleFrame(titleText, "Dragger", new UDim2(0, 5, 1, 0), new UDim2(1, 0, 0, 0), undefined);
            titleDragger.BackgroundTransparency = 0;

            let border = this.gui.createInvisibleFrame(containerFrame, "Border", new UDim2(0, 1, 1, 0), new UDim2(1, 0, 0, 0), undefined);
            border.BackgroundTransparency = 0.9;

            let titleDraggerObj = new DraggableObject(titleDragger, titleText, true, false, true);
            titleDraggerObj.Enable();

            titleDraggerObj.Dragged = (newSize: UDim2) => {
                if (newSize.X.Offset < 0) {
                    newSize = new UDim2(newSize.X.Scale, 0, 1, 0);
                    titleText.Size = newSize;
                }
                if (newSize.X.Offset > this.mainFrame.AbsoluteSize.X - titleDragger.AbsoluteSize.X) {
                    newSize = new UDim2(newSize.X.Scale, this.mainFrame.AbsoluteSize.X - titleDragger.AbsoluteSize.X, 1, 0);
                    titleText.Size = newSize;
                }
                containerFrame.Size = new UDim2(newSize.X.Scale, newSize.X.Offset, containerFrame.Size.Y.Scale, containerFrame.Size.Y.Offset);
            }

        }
        if (this.columnFrames) {
            this.columnFrames.set(index, data);
        }

    }

    constructor(gui: Gui, parent: GuiObject, columns: Array<string>, allowSorting = true, size: UDim2, position: UDim2, initialData?: Map<string, Array<string>>) {
        this.columns = columns;
        this.columnCount = columns.size();
        this.allowSorting = allowSorting;
        this.gui = gui;
        this.parent = parent;
        this.tableData = new Map(); /* Placeholder, REMOVE WHEN DONE */
        this.tableFrame = this.gui.createInvisibleFrame(parent, "Table", size, position, undefined);
        let returnVal = createBorder(this.tableFrame, undefined, undefined, 0.3);
        this.mainFrame = returnVal.containingFrame;

        this.columnBar = this.gui.createInvisibleFrame(this.mainFrame, "TitleBar", new UDim2(1, 0, 0, 15), new UDim2(0, 0, 0, 1));
        this.columnBar.BackgroundColor3 = Color3.fromRGB(22, 22, 22);
        this.columnBar.BackgroundTransparency = 0.35;

        this.createColumnTab(columns[0], 0);
        this.createColumnTab(columns[1], 1);
        this.createColumnTab(columns[2], 2);

    }
}

export { addUDim2, UITable }

