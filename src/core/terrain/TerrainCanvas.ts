import TerrainTiles from "./TerrainTiles";
import { TerrainCanvasPart } from "./types/TerrainCanvasPart";
import TerrainTileKit from "./TerrainTileKit";
import createOffScreenCanvas from "../../utils/Canvas";

/**
 * A canvas renderer that combines the visualiztion logic.
 */
export default class TerrainCanvas {
    public readonly parts: TerrainCanvasPart[] = [];

    constructor(private readonly terrainTileKit: TerrainTileKit, private readonly tiles: TerrainTiles, public readonly size: number, private readonly debug: boolean = false) {
        this.render();
    };

    private render() {
        const timestamp = performance.now();

        this.parts.length = 0;

        const widthPerPart = Math.floor(2000 / this.size);
        const heightPerPart = Math.floor(2000 / this.size);

        for(let row = 0; row < this.tiles.grid.rows; row += heightPerPart)
        for(let column = 0; column < this.tiles.grid.columns; column += widthPerPart) {
            const width = Math.min(this.tiles.grid.columns - column, widthPerPart) + 2;
            const height = Math.min(this.tiles.grid.rows - row, heightPerPart) + 2;

            const canvas = createOffScreenCanvas(width * this.size, height * this.size);
            const context = canvas.getContext("2d")!;

            const offset = {
                left: -((column - 1) * this.size),
                top: -((row - 1) * this.size)
            };
    
            const definitions = this.tiles.definitions.filter((definition) => {
                if(definition.row < (row - 1) || definition.row > ((row - 1) + height))
                    return false;

                if(definition.column < (column - 1) || definition.column > ((column - 1) + width))
                    return false;

                return true;
            });
    
            for(let tileDefinition of definitions) {
                this.terrainTileKit.draw(context, offset, tileDefinition.type, tileDefinition.row, tileDefinition.column, tileDefinition.direction);

                //this.terrainTileKit.draw(context, offset, TerrainTileType.DebugArrow, tileDefinition.row, tileDefinition.column, tileDefinition.direction);
            }

            this.parts.push({
                canvas,

                row: row - 1,
                column: column - 1,

                width,
                height
            });
        }
        
        const elapsed = Math.round(performance.now() - timestamp);

        if(elapsed > 50)
            console.warn(`Terrain canvas render took ${elapsed}ms (${this.parts.length} parts)`);

        return this.parts;
    };
};
