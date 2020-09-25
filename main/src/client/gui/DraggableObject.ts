/*
	@Author: Spynaz
	@Description: Enables dragging on GuiObjects. Supports both mouse and touch.
	
	For instructions on how to use this module, go to this link:
	https://devforum.roblox.com/t/simple-module-for-creating-draggable-gui-elements/230678

    Ported by person4268 to roblox-ts
*/

let UserInputService = game.GetService("UserInputService");


class DraggableObject {
    InputBegan?: RBXScriptConnection;
    InputChanged?: RBXScriptConnection;
    InputChanged2?: RBXScriptConnection;
    Object: GuiObject;
    DragStarted?: () => void;
    DragEnded?: () => void;
    Dragged?: (newPos: UDim2) => void;
    ActuallyDragThis?: GuiObject;
    Dragging: boolean = false;
    dragInX: boolean;
    dragInY: boolean;
    resizeInstead: boolean;
    constructor(Object: GuiObject, ActuallyDragThis?: GuiObject, dragInX = true, dragInY = true, resizeInstead = false) {
        this.Object = Object;
        this.ActuallyDragThis = ActuallyDragThis;
        this.dragInX = dragInX;
        this.dragInY = dragInY;
        this.resizeInstead = resizeInstead;
    }

    /**
     * Enables dragging
     */
    Enable() {
        let object = this.Object;
        let ActuallyDragThis = this.ActuallyDragThis;
        let dragInput: InputObject;
        let dragStart: Vector3;
        let startPos: UDim2;
        let preparingToDrag = false;
        let dragInX = this.dragInX;
        let dragInY = this.dragInY
        let resizeInstead = this.resizeInstead;

        function update(input: InputObject) {
            let delta = input.Position.sub(dragStart);
            let newPosition = new UDim2(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
            let dragThisThing;
            if (ActuallyDragThis) {
                dragThisThing = ActuallyDragThis;
            } else {
                dragThisThing = object;
            }
            if (!resizeInstead) {
                if (dragInX && dragInY) {
                    dragThisThing.Position = newPosition;
                } else {
                    if (dragInX) dragThisThing.Position = new UDim2(newPosition.X.Scale, newPosition.X.Offset, dragThisThing.Position.Y.Scale, dragThisThing.Position.Y.Offset);
                    if (dragInY) dragThisThing.Position = new UDim2(dragThisThing.Position.X.Scale, dragThisThing.Position.X.Offset, newPosition.Y.Scale, newPosition.Y.Offset);
                }
            } else {
                if (dragInX && dragInY) {
                    dragThisThing.Size = newPosition;
                } else {
                    if (dragInX) dragThisThing.Size = new UDim2(newPosition.X.Scale, newPosition.X.Offset, dragThisThing.Size.Y.Scale, dragThisThing.Size.Y.Offset);
                    if (dragInY) dragThisThing.Size = new UDim2(dragThisThing.Size.X.Scale, dragThisThing.Size.X.Offset, newPosition.Y.Scale, newPosition.Y.Offset);
                }
            }
            return newPosition;
        }

        this.InputBegan = object.InputBegan.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) {
                preparingToDrag = true;
                let connection: RBXScriptConnection;
                connection = (input.Changed as RBXScriptSignal).Connect(() => {
                    if (input.UserInputState === Enum.UserInputState.End && (this.Dragging || preparingToDrag)) {
                        this.Dragging = false;
                        connection.Disconnect();

                        if (this.DragEnded && !preparingToDrag) {
                            this.DragEnded();
                        }
                        preparingToDrag = false;
                    }
                });
            }
        });


        this.InputChanged = object.InputChanged.Connect(function (input) {
            if (input.UserInputType === Enum.UserInputType.MouseMovement || input.UserInputType === Enum.UserInputType.Touch) {
                dragInput = input;
            }
        });

        this.InputChanged2 = UserInputService.InputChanged.Connect((input) => {
            if (object.Parent === undefined) {
                this.Disable();
                return;
            }

            if (preparingToDrag) {
                preparingToDrag = false

                if (this.DragStarted) {
                    this.DragStarted()
                }

                this.Dragging = true
                dragStart = input.Position
                if (!resizeInstead) {
                    if (ActuallyDragThis) {
                        startPos = ActuallyDragThis.Position;
                    } else {
                        startPos = object.Position;
                    }
                } else {
                    if (ActuallyDragThis) {
                        startPos = ActuallyDragThis.Size;
                    } else {
                        startPos = object.Size;
                    }
                }
            }

            if (input === dragInput && this.Dragging) {
                let newPosition = update(input)

                if (this.Dragged) {
                    this.Dragged(newPosition)
                }
            }
        });


    }
    Disable() {
        if (this.InputBegan) this.InputBegan.Disconnect()
        if (this.InputChanged) this.InputChanged.Disconnect()
        if (this.InputChanged2) this.InputChanged2.Disconnect()

        if (this.Dragging) {
            this.Dragging = false

            if (this.DragEnded) {
                this.DragEnded()
            }
        }
    }

}

export { DraggableObject };