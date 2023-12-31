import { ImageData, createCanvas } from "canvas";
import { CanvasPaths } from "./types/CanvasPaths";

/**
 * A Path2D adapter to convert paths to a canvas, to extract image data.
 */
export default class CanvasPathsAdapter {
    static getCanvasFromPaths(canvasPaths: CanvasPaths): ImageData {
        if(!canvasPaths.bounds)
            throw new Error("There's no bounds in the canvas paths!");

        const width = canvasPaths.bounds.maximumLeft - canvasPaths.bounds.minimumLeft;
        const height = canvasPaths.bounds.maximumTop - canvasPaths.bounds.minimumTop;

        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");

        if(!context)
            throw new Error("Cannot get context for canvas paths adapter!");

        context.strokeStyle = context.fillStyle = "white";

        context.scale(1, 1);
        context.translate(-canvasPaths.bounds.minimumLeft, -canvasPaths.bounds.minimumTop);
            
        for(let path of canvasPaths.paths) {
            context.beginPath();

            context.moveTo(path[0].left, path[0].top);

            for(let index = 1; index < path.length; index++)
                context.lineTo(path[index].left, path[index].top);

            context.stroke();
            context.fill();
        }

        return context.getImageData(0, 0, canvas.width, canvas.height);
    };
}