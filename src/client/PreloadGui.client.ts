import * as Roact from "@rbxts/roact";

let preloadGui = Roact.createElement("ScreenGui", undefined, {
    frame: Roact.createElement("Frame", {
        Position: new UDim2(0.8, 0, 0.9, 0),
        Size: new UDim2(0.2, 0, 0.1, 0)
    }, {

    })
});

Roact.mount(preloadGui, game.GetService("Players").LocalPlayer.WaitForChild("PlayerGui"));