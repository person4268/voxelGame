import globals from "shared/globals"

export class BlockState {
    id: string = "";
    position: Vector3 = new Vector3(0, 0, 0);
    block = new Instance("Part");

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
        this.block.Parent = game.Workspace.FindFirstChild("Blocks");

    }
}