import { CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from "canvas";
import { CanvasInstance, OffScreenCanvasInstance } from "../utils/Canvas";

export type Canvas2DContext = {
    canvas: CanvasInstance;

    drawImage(image: CanvasInstance, dx: number, dy: number): void
} & (CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | NodeCanvasRenderingContext2D);

export type OffScreenCanvas2DContext = {
    canvas: OffScreenCanvasInstance;

    drawImage(image: CanvasInstance, dx: number, dy: number): void
} & (OffscreenCanvasRenderingContext2D | NodeCanvasRenderingContext2D);
