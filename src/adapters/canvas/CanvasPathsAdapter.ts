import { createCanvas } from "canvas";
import { Canvas } from "../../types/Canvas";
import { CanvasPaths } from "./types/CanvasPaths";

export default class CanvasPathsAdapter {
    static getCanvasFromPaths(canvasPaths: Required<CanvasPaths>): Canvas {
        const width = canvasPaths.bounds.maximumLeft - canvasPaths.bounds.minimumLeft;
        const height = canvasPaths.bounds.maximumTop - canvasPaths.bounds.minimumTop;

        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.strokeStyle = context.fillStyle = "white";
            
        for(let path of canvasPaths.paths) {
            context.beginPath();

            context.moveTo(path[0].left, path[0].top);

            for(let index = 1; index < path.length; index++)
                context.moveTo(path[index].left, path[index].top);

            context.stroke();
            context.fill();
        }

        return canvas;
    };

}