import { ImageData, createCanvas } from "canvas";
import TerrainGrid from "../../core/terrain/TerrainGrid";
import { GridMap } from "../../types/GridMap";

/**
 * A canvas adapter that extracts the image data to create a 2d grid.
 */
export default class CanvasGridAdapter {
    static getGridMapFromImageData(imageData: ImageData): GridMap {
        const { data, width, height } = imageData;

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

    static getGridFromImageData(imageData: ImageData): TerrainGrid {
        return new TerrainGrid(this.getGridMapFromImageData(imageData));
    };
};
