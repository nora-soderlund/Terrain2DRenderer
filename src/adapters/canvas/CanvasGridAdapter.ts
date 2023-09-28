import { createCanvas } from "canvas";
import TerrainGrid from "../../core/terrain/TerrainGrid";
import { Canvas } from "../../types/Canvas";
import { GridMap } from "../../types/GridMap";

/**
 * A canvas adapter that extracts the image data to create a 2d grid.
 */
export default class CanvasGridAdapter {
    static getGridMapFromCanvas(canvas: Canvas): GridMap {
        const context = canvas.getContext("2d");

        const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);

        const rows: GridMap = [];

        for (let row = 0; row < height; row++) {
            const columns: number[] = [];

            for (let column = 0; column < width; column++) {
                const index = ((row * width) + column) * 4;

                columns.push((data[index] > 100) ? (1) : (0));
            }

            rows.push(columns);
        }

        return rows;
    };

    static getGridFromCanvas(canvas: Canvas): TerrainGrid {
        return new TerrainGrid(this.getGridMapFromCanvas(canvas));
    };
};
