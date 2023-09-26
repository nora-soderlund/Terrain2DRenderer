import { createCanvas } from "canvas";
import { Canvas } from "../../types/Canvas";
import { CanvasPaths } from "./types/CanvasPaths";

export default class CanvasPathsAdapter {
    static getCanvasFromPaths(canvasPaths: CanvasPaths): Canvas {
        if(!canvasPaths.bounds)
            throw new Error("There's no bounds in the canvas paths!");

        const width = (canvasPaths.bounds.maximumLeft - canvasPaths.bounds.minimumLeft) * .5;
        const height = canvasPaths.bounds.maximumTop - canvasPaths.bounds.minimumTop;

        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.strokeStyle = context.fillStyle = "white";

        context.scale(-.5, -1);
        context.translate(-canvasPaths.bounds.minimumLeft - (width * 2), -canvasPaths.bounds.minimumTop - height);
            
        for(let path of canvasPaths.paths) {
            context.beginPath();

            context.moveTo(path[0].left, path[0].top);

            for(let index = 1; index < path.length; index++)
                context.lineTo(path[index].left, path[index].top);

            context.stroke();
            context.fill();
        }

        return canvas;
    };

}