import globals, { blockIds } from "shared/globals"
import TextureHandler from "shared/textures/TextureHandler";

export class BlockState {
    id: blockIds = "generic";
    position: Vector3 = new Vector3(0, 0, 0);
    block:Part = new Instance("Part");
    blockData:Object|undefined = {};
    interactable: boolean = false;
    unbreakable: boolean = false;
    getRealPosition(): Vector3 {
        return this.position.mul(globals.blockSize);
    }
    createBlock(): void {
        this.block = new Instance("Part");
        this.block.Position = this.getRealPosition();
        this.block.Size = globals.blockSize;
        this.block.Anchored = true;
        this.block.Material = Enum.Material.SmoothPlastic;
        this.block.TopSurface = Enum.SurfaceType.Smooth;
        this.block.BottomSurface = Enum.SurfaceType.Smooth;
        TextureHandler.applyTexture(this);
        this.block.Parent = game.Workspace.FindFirstChild("Blocks");

    }

    destroyBlock(): void {
        if(this.block) {
            this.block.Destroy();
            this.block = new Instance("Part");
        }
    }
    interact(player: Player, face: Enum.NormalId) {}
}