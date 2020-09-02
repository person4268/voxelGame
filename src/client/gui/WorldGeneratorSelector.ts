import { Gui, createScreenGui } from "./GuiLib";
import Net from "@rbxts/net";
function WorldGeneratorSelector(plrGui: PlayerGui): Gui {

    // really need to setup a better way to make guis
    // they dont even scale well
    let gui = new Gui(createScreenGui(plrGui), new UDim2(0, 105, 0, 95), "Select WorldGen", true, false);

    let selectPlane = gui.createGuiButton(gui.mainContainer, "SelectPlane", new UDim2(0, 90, 0, 16), new UDim2(0, 5, 0, 10), undefined, "Plane");
    let selectFlatIsland = gui.createGuiButton(gui.mainContainer, "SelectFlatIsland", new UDim2(0, 90, 0, 16), new UDim2(0, 5, 0, 20).add(new UDim2(0, 0, selectPlane.Size.Y.Scale, selectPlane.Size.Y.Offset)), undefined, "FlatIsland");
    let selectSimplex = gui.createGuiButton(gui.mainContainer, "SelectSimplex", new UDim2(0, 90, 0, 16), new UDim2(0, 5, 0, 30).add(new UDim2(0, 0, selectPlane.Size.Y.Scale * 2, selectPlane.Size.Y.Offset * 2)), undefined, "Simplex");

    Net.WaitForClientEventAsync("WGSelection").then((WGSelection) => {
        function sendPlane() {
            WGSelection.SendToServer("Plane");
        }

        function sendFlatIsland() {
            WGSelection.SendToServer("FlatIsland");
        }

        function sendSimplex() {
            WGSelection.SendToServer("Simplex");
        }

        selectPlane.MouseButton1Click.Connect(sendPlane);
        selectPlane.TouchTap.Connect(sendPlane);

        selectFlatIsland.MouseButton1Click.Connect(sendFlatIsland);
        selectFlatIsland.TouchTap.Connect(sendFlatIsland);

        selectSimplex.MouseButton1Click.Connect(sendSimplex);
        selectSimplex.TouchTap.Connect(sendSimplex);

    });

    print("[Info]: Created WGSMenu");
    return gui;
}


export default WorldGeneratorSelector;