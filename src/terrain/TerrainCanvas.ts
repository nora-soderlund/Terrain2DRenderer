import { Direction } from "../types/Direction";
import { Point } from "../types/Point";
import TerrainCanvasMouseEvents from "../game/events/GameCanvasMouseEvents";
import TerrainGrid from "./TerrainGrid";
import TerrainGridRenderer from "./renderers/TerrainGridRenderer";
import TerrainTileRenderer from "./renderers/TerrainTileRenderer";
import TerrainWaterRenderer from "./renderers/TerrainWaterRenderer";
import TerrainTiles from "./TerrainTiles";
import GameCanvasEntity from "../game/types/GameCanvasEntity";

export default class TerrainCanvas implements GameCanvasEntity {
    public readonly element = document.createElement("canvas");

    private readonly rows: number;
    private readonly columns: number;

    constructor(private readonly tiles: TerrainTiles[], private readonly size: number) {
        this.rows = Math.max(...tiles.map((tiles) => tiles.grid.rows));
        this.columns = Math.max(...tiles.map((tiles) => tiles.grid.columns));

        this.render();
    };

    public draw(context: CanvasRenderingContext2D, offset: Point): void {
        context.drawImage(this.element,
            0, 0, this.element.width, this.element.height,
            offset.left, offset.top, this.element.width, this.element.height);
    };

    private requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    };

    private render() {
        this.element.width = this.columns * this.size;
        this.element.height = this.rows * this.size;

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.element.getContext("2d")!;

        const offset = {
            left: 0,
            top: 0
        };

        const terrainWaterRenderer = new TerrainWaterRenderer(context);
        terrainWaterRenderer.drawWater();

        const terrainGridRenderer = new TerrainGridRenderer(context, this.size, offset);
        terrainGridRenderer.drawGrid();

        const terrainTileRenderer = new TerrainTileRenderer(context, this.size, offset);

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
