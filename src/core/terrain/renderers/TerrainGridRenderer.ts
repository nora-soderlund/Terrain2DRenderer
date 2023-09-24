import { CanvasRenderingContext2D } from "canvas";
import { Point } from "../../../types/Point";

export default class TerrainGridRenderer {
    constructor(private readonly context: CanvasRenderingContext2D, private readonly size: number, private readonly offset: Point) {

    }

    public drawGrid() {
        this.context.save();

        this.context.fillStyle = "rgba(0, 0, 0, .05)";

        this.context.translate(this.offset.left, this.offset.top);

        const topStart = -this.offset.top + Math.floor((this.offset.top % this.size) - this.size);
        const topEnd = this.context.canvas.height;

        const leftStart = -this.offset.left + Math.floor((this.offset.left % this.size) - this.size);
        const leftEnd = this.context.canvas.width;

        for(let top = topStart; top < topEnd; top += this.size) {
            this.context.fillRect(leftStart, top - .5, this.context.canvas.width, 1);
        }

        for(let left = leftStart; left < leftEnd; left += this.size) {
            this.context.fillRect(left - .5, topStart, 1, this.context.canvas.height);
        }

        this.context.restore();
    };
}
