import { Direction } from "../types/Direction";
import { Point } from "../types/Point";
import TerrainCanvasMouseEvents from "./events/TerrainCanvasMouseEvents";
import TerrainGrid from "./TerrainGrid";
import TerrainGridRenderer from "./renderers/TerrainGridRenderer";
import TerrainTileRenderer from "./renderers/TerrainTileRenderer";
import TerrainWaterRenderer from "./renderers/TerrainWaterRenderer";
import TerrainTiles from "./TerrainTiles";

export default class TerrainCanvas {
    public readonly element = document.createElement("canvas");

    private offset: Point = {
        left: 0,
        top: 0
    };

    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.element);

    private readonly tiles: TerrainTiles;

    constructor(private readonly grid: TerrainGrid, private readonly size: number) {
        this.tiles = new TerrainTiles(grid);

        this.requestRender();
    };

    private requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    };

    private render() {
        const bounds = this.element.getBoundingClientRect();

        this.element.width = bounds.width;
        this.element.height = bounds.height;

        this.offset.left = this.mouseEvents.offset.left + Math.floor(this.element.width / 2) - Math.floor((this.grid.columns * this.size) / 2);
        this.offset.top = this.mouseEvents.offset.top + Math.floor(this.element.height / 2) - Math.floor((this.grid.rows * this.size) / 2);

        const context = this.element.getContext("2d")!;


        const terrainWaterRenderer = new TerrainWaterRenderer(context);
        terrainWaterRenderer.drawWater();

        const terrainGridRenderer = new TerrainGridRenderer(context, this.size, this.offset);
        terrainGridRenderer.drawGrid();

        const terrainTileRenderer = new TerrainTileRenderer(context, this.size, this.offset);
        
        for(let tileDefinition of this.tiles.definitions) {
            terrainTileRenderer.draw(tileDefinition.type, tileDefinition.row, tileDefinition.column, tileDefinition.direction);
        }

        for(let tileDefinition of this.tiles.definitions) {
            terrainTileRenderer.drawDebugArrow(tileDefinition.row, tileDefinition.column, tileDefinition.direction);
        }

        this.requestRender();
    };
};
