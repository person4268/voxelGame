import Net from "@rbxts/net";
import { ProgressBar } from "./GuiExtension";
import { createScreenGui, Gui } from "./GuiLib";

function WorldGenProgress(plrGui: PlayerGui) {
	let gui = new Gui(createScreenGui(plrGui), new UDim2(0.3, 0, 0.07, 0), "Progress", true, false);

	let progBar = new ProgressBar(gui.mainContainer, gui, new UDim2(0, 0, 0, 0), new UDim2(1, 0, 0.75, 0));
	let progressTotal: number|undefined = undefined;
	let progress = 0;
	function updateBar(num?: number, total?: number) {
		if(num) {
			progress = num;
		}
		if(total) {
			progressTotal = total;
		}
		progBar.updateText(`${progress} / ${progressTotal}`);
		if(progressTotal) progBar.updateProgress(progress/progressTotal);
	}

	Net.WaitForClientEventAsync("GenProgressTotalRecieved").then((event) => {
		event.Connect((pTotal: number) => {
			updateBar(undefined, pTotal)
		});
	});
	Net.WaitForClientEventAsync("GenProgressUpdate").then((event) => {
		event.Connect((newVal: number) => {
			updateBar(newVal, undefined);
		});
	});

	return gui;
}


export default WorldGenProgress;