import TerrainGridRenderer from "./core/grid/GridRenderer";
import TerrainTileRenderer from "./core/terrain/renderers/TerrainTileRenderer";
import { CanvasRenderingContext2D, createCanvas } from "canvas";

export default class DebugCanvas {
    public static render(context: CanvasRenderingContext2D, size: number) {
        context.canvas.width = 25 * size;
        context.canvas.height = 9 * size;

        const offset = {
            left: 100,
            top: 0
        };

        const terrainTileRenderer = new TerrainTileRenderer(context, size, offset, true);

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
    };
};
