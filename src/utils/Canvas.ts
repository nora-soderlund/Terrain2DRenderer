import { Canvas, createCanvas } from "canvas";
import { Canvas2DContext, OffScreenCanvas2DContext } from "../types/Canvas2DContext";

export type CanvasInstance = {    
    getContext(context: "2d"): Canvas2DContext;
} & (HTMLCanvasElement | OffscreenCanvas | Canvas);

export type OffScreenCanvasInstance = {    
    getContext(context: "2d"): OffScreenCanvas2DContext;
} & (OffscreenCanvas | Canvas);

export default function createOffScreenCanvas(width: number, height: number): OffScreenCanvasInstance {
    if(typeof process === 'object' && typeof require === 'function')
        return createCanvas(width, height) as OffScreenCanvasInstance;

    return new OffscreenCanvas(width, height) as OffScreenCanvasInstance;
};
