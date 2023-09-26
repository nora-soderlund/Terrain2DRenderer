import { CanvasRenderingContext2D as NodeCanvasRenderingContext2D, Canvas as NodeCanvas } from "canvas";
import { Canvas2DContext } from "./Canvas2DContext";

export type Canvas = {
    getContext(context: "2d"): Canvas2DContext;
} & (NodeCanvas | HTMLCanvasElement);
