import { Point } from "../../types/Point";
import TerrainGridRenderer from "../../core/grid/GridRenderer";
import TerrainTileRenderer from "../../core/terrain/renderers/TerrainTileRenderer";
import GameCanvasMouseEvents from "./events/GameCanvasMouseEvents";
import { CanvasRenderingContext2D } from "canvas";

export default class GameDebugCanvas {
    public readonly element = document.createElement("canvas");

    private offset: Point = {
        left: 0,
        top: 0
    };

    private readonly mouseEvents = new GameCanvasMouseEvents(this.element);

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

        this.offset.left = this.mouseEvents.offset.left + -1300;
        this.offset.top = this.mouseEvents.offset.top;

        const context = this.element.getContext("2d")! as unknown as CanvasRenderingContext2D;

        const terrainTileRenderer = new TerrainTileRenderer(context, this.size, this.offset);

        for(let direction = 0; direction < 4; direction++) {
            for(let index = 0; index < 14; index += 2)
                terrainTileRenderer.drawFlatTile(1 + (direction * 2), index, direction * 90);
    
            terrainTileRenderer.drawFlatTileWithLeftFlatEdge(1 + (direction * 2), 2, direction * 90);
            terrainTileRenderer.drawFlatTileWithRightFlatEdge(1 + (direction * 2), 4, direction * 90);
            
            terrainTileRenderer.drawFlatTileWithLeftInsideCornerEdge(1 + (direction * 2), 6, direction * 90);
            terrainTileRenderer.drawFlatTileWithRightInsideCornerEdge(1 + (direction * 2), 8, direction * 90);
            
            terrainTileRenderer.drawFlatTileWithLeftOutsideCornerEdge(1 + (direction * 2), 10, direction * 90);
            terrainTileRenderer.drawFlatTileWithRightOutsideCornerEdge(1 + (direction * 2), 12, direction * 90);

            for(let index = 14; index < 24; index += 2)
                terrainTileRenderer.drawSlopedTile(1 + (direction * 2), index, (direction * 90) + 45);

            terrainTileRenderer.drawSlopedTileWithLeftFlatEdge(1 + (direction * 2), 16, (direction * 90) + 45);
            terrainTileRenderer.drawSlopedTileWithRightFlatEdge(1 + (direction * 2), 18, (direction * 90) + 45);

            terrainTileRenderer.drawSlopedTileWithLeftOutsideCornerEdge(1 + (direction * 2), 20, (direction * 90) + 45);
            terrainTileRenderer.drawSlopedTileWithRightOutsideCornerEdge(1 + (direction * 2), 22, (direction * 90) + 45);
        }

        this.requestRender();
    };
};
