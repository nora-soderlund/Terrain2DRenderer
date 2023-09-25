import { CanvasRenderingContext2D } from "canvas";

export default class WaterRenderer {
    public draw(context: CanvasRenderingContext2D) {
        context.save();

        context.fillStyle = "#AADAFF";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.restore();
    };
}
