import { DraggableObject } from "./DraggableObject";

class Gui {

    OnOpen?: () => {};
    OnClose?: () => {};

    gui?: SurfaceGui | ScreenGui | BillboardGui;
    guiContainer?: Frame;

    titleBar?: Frame;
    titleBarDraggable: boolean = false;
    titleBarBorder?: Frame;
    titleBarLabel?: TextLabel;
    titleBarCloseBtn?: TextButton;

    mainContainer: Frame;

    dragger?: DraggableObject;
    constructor(parentGui: SurfaceGui | ScreenGui | BillboardGui, size = new UDim2(0, 237, 0, 295), title: string = "", isDraggable = true, closeButton = true, textSize = 14, centered: boolean = true, position?: UDim2, createTitleBar = true, activeGui = false) {
        this.gui = parentGui;
        this.mainContainer = new Instance("Frame");



        this.guiContainer = new Instance("Frame");
        if (this.gui) {
            this.guiContainer.Parent = this.gui;
            this.gui.Name = title;
        } else {
            error("GUI not found");
        }
        if (centered) {
            if (position) error("Cannot specify position if centered");
            this.guiContainer.Position = new UDim2(0.5 - size.X.Scale / 2, -size.X.Offset / 2, 0.5 - size.Y.Scale / 2, -size.Y.Offset / 2);
        } else {
            if (position) {
                this.guiContainer.Position = position;
            } else {
                error("Need position if not centered");
            }
        }
        this.guiContainer.Size = size;
        this.guiContainer.BackgroundColor3 = Color3.fromRGB(22, 22, 22);
        this.guiContainer.BackgroundTransparency = 0.4;
        this.guiContainer.BorderColor3 = Color3.fromRGB(13, 20, 26);
        this.guiContainer.BorderSizePixel = 4;
        this.guiContainer.Name = "Container";

        if (activeGui) {
            this.guiContainer.Active = true;
        }

        if (createTitleBar) {
            this.titleBar = new Instance("Frame");
            this.titleBar.BackgroundTransparency = 1;
            this.titleBar.Size = new UDim2(1, 0, 0.07, 0);
            this.titleBar.Name = "TitleBar";
            this.titleBarDraggable = isDraggable;
            this.titleBar.Parent = this.guiContainer;

            this.titleBarBorder = new Instance("Frame");
            this.titleBarBorder.BorderSizePixel = 0;
            this.titleBarBorder.BackgroundTransparency = 0.6;
            this.titleBarBorder.Position = new UDim2(0.5, 0, 1, 0);
            this.titleBarBorder.Size = new UDim2(0.997, 0, 0, 1);
            this.titleBarBorder.AnchorPoint = new Vector2(0.5, 0.5);
            this.titleBarBorder.Parent = this.titleBar;
            this.titleBarBorder.Name = "Border"

            this.titleBarLabel = new Instance("TextLabel");
            this.titleBarLabel.Name = "Title";
            this.titleBarLabel.Text = title;
            this.titleBarLabel.Position = new UDim2(0.02, 0, 0.5, 0);
            this.titleBarLabel.Size = new UDim2(1, 0, 0.5, 0);
            this.titleBarLabel.TextSize = textSize;
            this.titleBarLabel.TextXAlignment = Enum.TextXAlignment.Left;
            this.titleBarLabel.BackgroundTransparency = 1;
            this.titleBarLabel.AnchorPoint = new Vector2(0, 0.5);
            this.titleBarLabel.Font = Enum.Font.SourceSans;
            this.titleBarLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
            this.titleBarLabel.Parent = this.titleBar;

            if (isDraggable) {
                this.dragger = new DraggableObject(this.titleBar, this.guiContainer);
                this.dragger.Enable();
            }

            if (closeButton) {
                this.titleBarCloseBtn = new Instance("TextButton");
                this.titleBarCloseBtn.Name = "Close"
                this.titleBarCloseBtn.AnchorPoint = new Vector2(1, 0); /* Right alignment */
                this.titleBarCloseBtn.Position = new UDim2(1, 0, 0, 0);
                this.titleBarCloseBtn.Size = new UDim2(0.08, 0, 1, 0);
                this.titleBarCloseBtn.BackgroundTransparency = 1;
                this.titleBarCloseBtn.Text = "X";
                this.titleBarCloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255);
                this.titleBarCloseBtn.Parent = this.titleBar;

                this.titleBarCloseBtn.MouseButton1Click.Connect(() => {
                    this.close();
                });
            }

            this.mainContainer = new Instance("Frame");
            this.mainContainer.BackgroundTransparency = 1;
            this.mainContainer.Size = new UDim2(2, -3, 1 - this.titleBarBorder.Size.Y.Scale - 0.01, -this.titleBarBorder.Size.Y.Offset).sub(this.titleBar.Size);
            this.mainContainer.Position = new UDim2(0, 3, this.titleBar.Size.Y.Scale + this.titleBarBorder.Size.Y.Scale, this.titleBar.Size.Y.Offset + this.titleBarBorder.Size.Y.Offset + 5);
            this.mainContainer.Name = "MainContainer";
            this.mainContainer.Parent = this.guiContainer;
        }

    }
    /**
     * Creates a Window
     * @param size Window Size
     * @param title Window Title
     * @param isDraggable If Window is Draggable
     * @param closeButton If Window has Close Button 
     * @param textSize Text Size of Title
     * @param centered If Window will Spawn Centered
     * @param position Window's position, if not Centered
     */
    createWindow(): void {

    }
    /**
     * Closes the GUI
     */
    close() {
        if (this.OnClose) this.OnClose();
        if (this.gui) {
            if (this.dragger) this.dragger.Disable();
            this.gui.Enabled = false;
        }
    }
    /**
     * Opens the GUI
     */
    open() {
        if (this.OnOpen) this.OnOpen();
        if (this.gui) {
            this.gui.Enabled = true;
            if (this.dragger) this.dragger.Enable();
        }
    }
    /**
     * Creates an invisible frame, used for alignment reasons
     * @param Parent Frame.Parent
     * @param Name Frame.Name
     * @param Size Frame.Size
     * @param Position Frame.Position
     * @param AnchorPoint Frame.AnchorPoint
     */
    createInvisibleFrame(Parent: Instance, Name?: string, Size?: UDim2, Position?: UDim2, AnchorPoint?: Vector2): Frame {
        let newFrame = new Instance("Frame");
        if (Name) newFrame.Name = Name;
        if (Size) newFrame.Size = Size;
        if (Position) newFrame.Position = Position;
        if (AnchorPoint) newFrame.AnchorPoint = AnchorPoint;

        newFrame.BorderSizePixel = 0;
        newFrame.BackgroundTransparency = 1;

        newFrame.Parent = Parent;
        return newFrame;
    }

    createGuiButton(Parent: Instance, Name?: string, Size?: UDim2, Position?: UDim2, AnchorPoint?: Vector2, ButtonText?: string): TextButton {
        let newButton = new Instance("TextButton");
        //color 60,60,60 transparency ~0.06
        newButton.BackgroundColor3 = Color3.fromRGB(21, 21, 21);
        newButton.TextColor3 = Color3.fromRGB(255, 255, 255);
        newButton.BackgroundTransparency = 0.17;

        if (Name) newButton.Name = Name;
        if (Size) newButton.Size = Size;
        if (!Size) newButton.Size = new UDim2(0.2, 0, 0.08, 0);
        if (Position) newButton.Position = Position;
        if (AnchorPoint) newButton.AnchorPoint = AnchorPoint;
        if (ButtonText) newButton.Text = ButtonText;

        newButton.Parent = Parent;

        return newButton;
    }
    createGuiLabel(Parent: Instance, Name?: string, Size?: UDim2, Position?: UDim2, AnchorPoint?: Vector2, LabelText?: string, alignLeft = false): TextLabel {
        let newLabel = new Instance("TextLabel");
        newLabel.BackgroundTransparency = 1;
        newLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
        newLabel.BorderSizePixel = 0;

        if (Name) newLabel.Name = Name;
        if (Size) newLabel.Size = Size;
        if (!Size) newLabel.Size = new UDim2(0.2, 0, 0.08, 0);
        if (Position) newLabel.Position = Position;
        if (AnchorPoint) newLabel.AnchorPoint = AnchorPoint;
        if (LabelText) newLabel.Text = LabelText;
        if (alignLeft) newLabel.TextXAlignment = Enum.TextXAlignment.Left
        newLabel.Parent = Parent;
        return newLabel;

    }

    createGuiLabelBtn(Parent: Instance, Name?: string, Size?: UDim2, Position?: UDim2, AnchorPoint?: Vector2, LabelText?: string, alignLeft = false): TextButton {
        let newLabel = new Instance("TextButton");
        newLabel.BackgroundTransparency = 1;
        newLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
        newLabel.BorderSizePixel = 0;

        if (Name) newLabel.Name = Name;
        if (Size) newLabel.Size = Size;
        if (!Size) newLabel.Size = new UDim2(0.2, 0, 0.08, 0);
        if (Position) newLabel.Position = Position;
        if (AnchorPoint) newLabel.AnchorPoint = AnchorPoint;
        if (LabelText) newLabel.Text = LabelText;
        if (alignLeft) newLabel.TextXAlignment = Enum.TextXAlignment.Left
        newLabel.Parent = Parent;
        return newLabel;

    }
}


function createScreenGui(Parent: Instance, Name = "Gui"): ScreenGui {
    let newGui = new Instance("ScreenGui");
    newGui.Name = Name;
    newGui.Parent = Parent;
    newGui.Enabled = false;
    return newGui;
}

export { Gui, createScreenGui }