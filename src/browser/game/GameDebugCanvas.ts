import { Point } from "../../types/Point";
import TerrainTileRenderer from "../../core/terrain/renderers/TerrainTileRenderer";
import GameCanvasMouseEvents from "./events/GameCanvasMouseEvents";
import { CanvasRenderingContext2D } from "canvas";
import TerrainTileKit from "../../core/terrain/TerrainTileKit";
import { TerrainTileType } from "../../core/terrain/types/TerrainTileType";
import { Canvas2DContext } from "../../types/Canvas2DContext";

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

        const context = this.element.getContext("2d") as Canvas2DContext;

        const terrainTileRenderer = new TerrainTileRenderer(this.size);
        const terrainTileKit = new TerrainTileKit(terrainTileRenderer);

        const offset = {
            left: 0,
            top: 0
        };

        for(let direction = 0; direction < 4; direction++) {
            for(let index = 0; index < 14; index += 2)
                terrainTileKit.draw(context, offset, TerrainTileType.FlatTile, 1 + (direction * 2), index, direction * 90);
    
            terrainTileKit.draw(context, offset, TerrainTileType.FlatTileWithLeftFlatEdge, 1 + (direction * 2), 2, direction * 90);
            terrainTileKit.draw(context, offset, TerrainTileType.FlatTileWithRightFlatEdge, 1 + (direction * 2), 4, direction * 90);
            
            terrainTileKit.draw(context, offset, TerrainTileType.FlatTileWithLeftInsideCornerEdge, 1 + (direction * 2), 6, direction * 90);
            terrainTileKit.draw(context, offset, TerrainTileType.FlatTileWithRightInsideCornerEdge, 1 + (direction * 2), 8, direction * 90);
            
            terrainTileKit.draw(context, offset, TerrainTileType.FlatTileWithLeftOutsideCornerEdge, 1 + (direction * 2), 10, direction * 90);
            terrainTileKit.draw(context, offset, TerrainTileType.FlatTileWithRightOutsideCornerEdge, 1 + (direction * 2), 12, direction * 90);

            for(let index = 14; index < 24; index += 2)
                terrainTileKit.draw(context, offset, TerrainTileType.SlopedTile, 1 + (direction * 2), index, (direction * 90) + 45);

            terrainTileKit.draw(context, offset, TerrainTileType.SlopedTileWithLeftFlatEdge, 1 + (direction * 2), 16, (direction * 90) + 45);
            terrainTileKit.draw(context, offset, TerrainTileType.SlopedTileWithRightFlatEdge, 1 + (direction * 2), 18, (direction * 90) + 45);

            terrainTileKit.draw(context, offset, TerrainTileType.SlopedTileWithLeftOutsideCornerEdge, 1 + (direction * 2), 20, (direction * 90) + 45);
            terrainTileKit.draw(context, offset, TerrainTileType.SlopedTileWithRightOutsideCornerEdge, 1 + (direction * 2), 22, (direction * 90) + 45);
        }

        this.requestRender();
    };
};
