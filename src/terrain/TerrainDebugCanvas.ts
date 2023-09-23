import { Direction } from "../types/Direction";
import { Point } from "../types/Point";
import TerrainCanvasMouseEvents from "./TerrainCanvasMouseEvents";
import TerrainGrid from "./TerrainGrid";
import TerrainGridRenderer from "./TerrainGridRenderer";
import TerrainRenderer from "./TerrainRenderer";
import TerrainWaterRenderer from "./TerrainWaterRenderer";

export default class TerrainDebugCanvas {
    public readonly element = document.createElement("canvas");

    private offset: Point = {
        left: 0,
        top: 0
    };

    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.element);

    constructor(private readonly size: number) {
        this.requestRender();
    };

    private requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    };

    private render() {
        const bounds = this.element.getBoundingClientRect();

        this.element.width = bounds.width;
        this.element.height = bounds.height;

        this.offset.left = this.mouseEvents.offset.left + 100;
        this.offset.top = this.mouseEvents.offset.top;

        const context = this.element.getContext("2d")!;


        const terrainWaterRenderer = new TerrainWaterRenderer(context);
        terrainWaterRenderer.drawWater();

        const terrainGridRenderer = new TerrainGridRenderer(context, this.size, this.offset);
        terrainGridRenderer.drawGrid();

        const terrainRenderer = new TerrainRenderer(context, this.size, this.offset);

        for(let direction = 0; direction < 4; direction++) {
            terrainRenderer.drawFlatTile(1 + (direction * 2), 0, direction * 90);
            terrainRenderer.drawFlatTileWithFlatEdge(1 + (direction * 2), 2, direction * 90);
            
            terrainRenderer.drawFlatTileWithRightInsideCornerEdge(1 + (direction * 2), 4, direction * 90);
            
            terrainRenderer.drawFlatTileWithLeftOutsideCornerEdge(1 + (direction * 2), 6, direction * 90);
            terrainRenderer.drawFlatTileWithRightOutsideCornerEdge(1 + (direction * 2), 8, direction * 90);
            terrainRenderer.drawFlatTileWithOutsideCornerEdge(1 + (direction * 2), 10, direction * 90);

            terrainRenderer.drawSlopedTileWithFlatEdge(1 + (direction * 2), 12, (direction * 90) + 45);

            terrainRenderer.drawSlopedTileWithOutsideCornerEdge(1 + (direction * 2), 14, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithLeftOutsideCornerEdge(1 + (direction * 2), 16, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithRightOutsideCornerEdge(1 + (direction * 2), 18, (direction * 90) + 45);
        }

        this.requestRender();
    };
};
