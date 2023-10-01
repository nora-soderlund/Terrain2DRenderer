import TerrainTiles from "./TerrainTiles";
import { TerrainCanvasPart } from "./types/TerrainCanvasPart";

/**
 * A canvas renderer that combines the visualiztion logic.
 */
export default class TerrainCanvas {
    public readonly parts: TerrainCanvasPart[] = [];

    constructor(public readonly terrainTiles: TerrainTiles, public readonly size: number) {
        this.process();
    };

    private process() {
        this.parts.length = 0;

        //const widthPerPart = Math.floor(1000 / this.size);
        //const heightPerPart = Math.floor(1000 / this.size);

        const widthPerPart = 100;
        const heightPerPart = 100;

        for(let row = 0; row < this.terrainTiles.grid.rows; row += heightPerPart)
        for(let column = 0; column < this.terrainTiles.grid.columns; column += widthPerPart) {
            const width = Math.min(this.terrainTiles.grid.columns - column, widthPerPart) + 2;
            const height = Math.min(this.terrainTiles.grid.rows - row, heightPerPart) + 2;

            this.parts.push({
                row: row - 1,
                column: column - 1,

                width,
                height
            });
        }
    };
};
