import { CanvasInstance } from "../../../utils/Canvas";

export type TerrainCanvasPart = {
    canvas: CanvasInstance;

    row: number;
    column: number;

    width: number;
    height: number;
};
