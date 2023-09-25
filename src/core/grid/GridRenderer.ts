import { CanvasRenderingContext2D } from "canvas";

export default class GridRenderer {
    constructor(private readonly size: number) {

    }

    public draw(context: CanvasRenderingContext2D) {
        context.save();

        context.fillStyle = "rgba(0, 0, 0, .05)";

        for(let top = 0; top < context.canvas.height; top += this.size) {
            context.fillRect(0, top - .5, context.canvas.width, 1);
        }

        for(let left = 0; left < context.canvas.width; left += this.size) {
            context.fillRect(left - .5, 0, 1, context.canvas.height);
        }

        context.restore();
    };
}
