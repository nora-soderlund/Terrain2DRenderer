import { Point } from "../../types/Point";

export default class TerrainWaterRenderer {
    constructor(private readonly context: CanvasRenderingContext2D) {

    }

    public drawWater() {
        this.context.save();

        this.context.fillStyle = "#AADAFF";
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        this.context.restore();
    };
}
