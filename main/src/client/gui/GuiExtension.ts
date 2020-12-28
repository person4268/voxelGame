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

//WARNING: terrible code
class UITable {

    columns: Array<string>
    columnCount: number
    gui: Gui
    tableFrame: Frame;
    columnBar: Frame;
    parent: GuiObject
    tableData: Map<number, Map<number, { "value": string, "textLabel": TextButton }>>;
    mainFrame: Frame;
    columnFrames: Map<number, { "name": string, "frame": Frame }> = new Map();
    scrollingFrame: ScrollingFrame;
    rowsClickable: boolean;
    onRowSelect?: (row: number) => void
    getColPositionFromIndex(index: number, totalCount: number): number {
        if (index === 0) return 0;
        return 1 / totalCount * index;
    }
    getTextHeightFromIndex(col: number, index: number): number {
        if (index === 0) return 3;
        let data = this.tableData.get(col);
        if (data) {
            
            let lastEntryData = data.get(index - 1);
            if (lastEntryData) {
                //return (data.size() * lastEntryData.textLabel.AbsoluteSize.Y)
                return (lastEntryData.textLabel.Position.Y.Offset + lastEntryData.textLabel.AbsoluteSize.Y + 5);
            }
            
            warn(`Last index nonexistent. Index ${index}, col ${col}`);
            return 0;
        }
        warn(`Last index nonexistent. Index ${index}, col ${col}`);
        return 0;
    }

    selectedRow?: number
    selectHandler(col: number, index: number) {
        warn(`Clicked: ${col}, ${index}`);
        if (this.rowsClickable) {
            if (this.selectedRow !== undefined) {
                for (let i = 0; i < this.columns.size(); i++) {
                    let colData = this.tableData.get(i);
                    if (colData) {
                        let entryData = colData.get(this.selectedRow);
                        if (entryData) {
                            entryData.textLabel.BackgroundTransparency = 1;
                        }
                    }
                }
            }
            for (let i = 0; i < this.columns.size(); i++) {
                let colData = this.tableData.get(i);
                if (colData) {
                    let entryData = colData.get(index);
                    if (entryData) {
                        entryData.textLabel.BackgroundTransparency = 0.25;
                    }
                }
            }
            this.selectedRow = index;
            if (this.onRowSelect) this.onRowSelect(index);
        }
    }
    createEntryInColumn(column: number, index: number, text: string) {
        let col = this.columnFrames.get(column);
        if (col) {
            let lbl = this.gui.createGuiLabelBtn(col.frame, text, new UDim2(1, 0, 0.08, 0), new UDim2(0, 0, 0, this.getTextHeightFromIndex(column, index)), undefined, text, true);
            lbl.TextWrapped = true;

            let onSel = () => {
                this.selectHandler(column, index);
            }

            lbl.MouseButton1Click.Connect(onSel);
            lbl.TouchTap.Connect(onSel);

            let colData = this.tableData.get(column);
            if (colData) {
                colData.set(index, { "textLabel": lbl, "value": text });
            }
        } else {
            warn(`Invalid col id ${column}`);
        }
    }
    addRow(index: number, data: Array<string>) {
        for (let i = 0; i < data.size(); i++) {
            this.createEntryInColumn(i, index, data[i]);
        }
    }
    removeRow(index: number) {
        this.tableData.forEach((col)=>{
            let data = col.get(index);
            if(data) {
                data.textLabel.Destroy();
                col.delete(index);
            }
        });
    }
    clearChart() {
        this.tableData.forEach((col)=>{
            col.forEach((index)=>{
                index.textLabel.Destroy();
            });
            for(let i=0; i<col.size(); i++) {
                col.delete(i);
            }
        });
    }
    createColumnTab(name: string, index: number, totalCount: number, createDragger = true) {
        let containerFrame = this.gui.createInvisibleFrame(this.scrollingFrame, name, new UDim2(1 / totalCount, -2, 1, 0), new UDim2(this.getColPositionFromIndex(index, totalCount), 0, 0, 0));
        let data = { "name": name, "frame": containerFrame };

        let titleText = this.gui.createGuiLabel(this.columnBar, name, new UDim2(1 / totalCount, -2, 1, 0), new UDim2(this.getColPositionFromIndex(index, totalCount), 2, 0, 0), undefined, name);
        titleText.TextXAlignment = Enum.TextXAlignment.Left;
        titleText.TextWrapped = true; /* Because of the lack of vertical space in the textlabel, this effectively crops it off */

        if (createDragger) {
            let titleDragger = this.gui.createInvisibleFrame(titleText, "Dragger", new UDim2(0, 1, 1, 0), new UDim2(1, -1, 0, 0), undefined);
            titleDragger.BackgroundTransparency = 0.1;

            let border = this.gui.createInvisibleFrame(containerFrame, "Border", new UDim2(0, 1, 1, 0), new UDim2(1, 0, 0, 0), undefined);
            border.BackgroundTransparency = 0.9;
        }
        this.columnFrames.set(index, data);
        this.tableData.set(index, new Map());
    }
    columnNameToIndex(name: string): number {
        let i = 0;
        for (; (this.columnFrames.get(i) as { "name": string, "frame": Frame }).name !== name; i++) { }
        return i;
    }


    constructor(gui: Gui, parent: GuiObject, columns: Array<string>, size: UDim2, position: UDim2, rowsClickable = true) {
        this.columns = columns;
        this.columnCount = columns.size();
        this.gui = gui;
        this.parent = parent;
        this.rowsClickable = rowsClickable;
        this.tableData = new Map(); /* Placeholder, REMOVE WHEN DONE */
        this.tableFrame = this.gui.createInvisibleFrame(parent, "Table", size, position, undefined);
        let returnVal = createBorder(this.tableFrame, undefined, undefined, 0.3);
        this.mainFrame = returnVal.containingFrame;

        this.columnBar = this.gui.createInvisibleFrame(this.mainFrame, "TitleBar", new UDim2(1, 0, 0, 15), new UDim2(0, 0, 0, 1));
        this.columnBar.BackgroundColor3 = Color3.fromRGB(22, 22, 22);
        this.columnBar.BackgroundTransparency = 0.4;

        this.scrollingFrame = new Instance("ScrollingFrame");
        this.scrollingFrame.Parent = this.mainFrame;
        this.scrollingFrame.Size = new UDim2(1, 0, 1 - this.columnBar.Size.Y.Scale, -this.columnBar.Size.Y.Offset);
        this.scrollingFrame.Position = new UDim2(0, 0, this.columnBar.Size.Y.Scale, this.columnBar.Size.Y.Offset);
        this.scrollingFrame.BackgroundTransparency = 1;


        let i = 0;
        this.columns.forEach((column) => {
            if (i !== this.columnCount - 1) {
                this.createColumnTab(column, i, this.columnCount);
            } else {
                this.createColumnTab(column, i, this.columnCount, false);
            }
            i++;
        });
    }
}

class ProgressBar {
    initialFrame: Frame;
    mainFrame: Frame;
    progressFrame: Frame;
    hasProgressLabel: boolean;
    progressLabel?: TextLabel;


    constructor(parent: GuiObject, parentGui: Gui, postiion: UDim2, size: UDim2, color = Color3.fromRGB(98,195,255), hasProgressLabel = true) {
        this.initialFrame = new Instance("Frame");
        this.initialFrame.Parent = parent;
        this.initialFrame.Position = postiion;
        this.initialFrame.Size = size;
        this.initialFrame.BackgroundTransparency = 1;
        this.initialFrame.Name = "ProgressBar";

        this.hasProgressLabel = hasProgressLabel;

        let result = createBorder(this.initialFrame);
        this.mainFrame = result.containingFrame;
        this.mainFrame.Name = "Bar"
        
        this.progressFrame = new Instance("Frame");
        this.progressFrame.BorderSizePixel = 0;
        this.progressFrame.BackgroundColor3 = color;
        this.progressFrame.BackgroundTransparency = 0.1;
        this.progressFrame.Size = new UDim2(0, 0, 1, -1); 
        this.progressFrame.Position = new UDim2(0, 0, 0, 1); //Adjusting for 1 pixel position error obscuring outline
        this.progressFrame.Parent = this.mainFrame;
        this.progressFrame.Name = "ProgressFrame"

        if(this.hasProgressLabel) {
            this.progressLabel = parentGui.createGuiLabel(this.mainFrame, "Progress", new UDim2(0.3, 0, 1, 0), new UDim2(0.5, 0, 0, 0), new Vector2(0.5, 0), "", false);
        }


    }
    updateText(text: string) {
        if(this.progressLabel) this.progressLabel.Text = text;
    }
    updateProgress(progress: number) {
        this.progressFrame.Size = new UDim2(progress, 0, 1, -1);
    }
}

function stripXVal(udim: UDim2) {
    return new UDim2(0, 0, udim.Y.Scale, udim.Y.Offset);
}

function stripYVal(udim: UDim2) {
    return new UDim2(udim.X.Scale, udim.X.Offset, 0, 0);
}

/**
 * Aligns GUIObjects based on their position and size
 * Basically this is meant so you can say this:
 * GuiButton takes up 10% of the frame with 0,10,0,0 spacing above it
 * and so on, but honestly I'm not sure (writing this long after I wrote this func)
 */
function alignBasedOnPercentagesInInvisibleFrame(
    isHorizontal = true,
    alignmentInfo: [
        {
            "percentage": number,
            "object": GuiObject,
            "spacing": UDim2
        }
    ]
) {
    for(let i=0; i<alignmentInfo.length; i++) {
        let object = alignmentInfo[i];
        if(i===0) {object.object.Position = new UDim2(0, 0, 0, 0)} else {
            let lastObject = alignmentInfo[i-1];
            if(isHorizontal) {
                object.object.Position = stripYVal(lastObject.object.Position.add(lastObject.object.Size.add(lastObject.spacing)));
                object.object.Size = new UDim2(object.percentage+object.spacing.X.Scale, object.spacing.X.Offset, object.object.Size.Y.Scale, object.object.Size.Y.Offset);
            } else {
                object.object.Position = stripXVal(lastObject.object.Position.add(lastObject.object.Size.add(lastObject.spacing)));
                object.object.Size = new UDim2(object.object.Size.X.Scale, object.object.Size.X.Offset, object.percentage+object.spacing.Y.Scale, object.spacing.Y.Offset);
            }
        }
    }
}

/**
 * Shorthand for alignBasedOnPercentagesInInvisibleFrame
 */
let aBOPIIF = alignBasedOnPercentagesInInvisibleFrame;
export { addUDim2, UITable, ProgressBar, alignBasedOnPercentagesInInvisibleFrame, aBOPIIF }

