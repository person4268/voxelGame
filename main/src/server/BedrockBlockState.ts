import globals from "shared/globals";
import { BlockState } from "./ServerBlockState";

export class BedrockBlockState extends BlockState {
	unbreakable = true;
	interactable = true;
	interact(player: Player, face: Enum.NormalId) {
		this.block.GetChildren().forEach((child)=>{
			if(child.IsA("Decal")) {
				let decal = child as Decal;
				if(child.Face === face) {
					child.Texture = globals.textures.grass_side;
				}
			}
		})
	}
}