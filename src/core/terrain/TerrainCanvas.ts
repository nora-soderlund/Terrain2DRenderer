import TerrainTileRenderer from "./renderers/TerrainTileRenderer";
import TerrainTiles from "./TerrainTiles";
import { createCanvas } from "canvas";

export default class TerrainCanvas {
    private readonly rows: number;
    private readonly columns: number;

    public readonly canvas = createCanvas(0, 0);

    constructor(private readonly tiles: TerrainTiles[], public readonly size: number, private readonly debug: boolean = false) {
        this.rows = Math.max(...tiles.map((tiles) => tiles.grid.rows));
        this.columns = Math.max(...tiles.map((tiles) => tiles.grid.columns));

        this.render();
    };

    private render() {
        this.canvas.width = this.columns * this.size;
        this.canvas.height = this.rows * this.size;

        console.log(this.canvas);

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.canvas.getContext("2d")!;

        const offset = {
            left: 0,
            top: 0
        };

        const terrainTileRenderer = new TerrainTileRenderer(context, this.size, offset, this.debug);

        for(let tiles of this.tiles) {
            for(let tileDefinition of tiles.definitions) {
                terrainTileRenderer.draw(tileDefinition.type, tileDefinition.row, tileDefinition.column, tileDefinition.direction);
            }

            for(let tileDefinition of tiles.definitions) {
                terrainTileRenderer.drawDebugArrow(tileDefinition.row, tileDefinition.column, tileDefinition.direction);
            }
        }
    };
};
