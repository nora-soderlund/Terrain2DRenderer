import TerrainGridRenderer from "./core/grid/GridRenderer";
import TerrainTileKit from "./core/terrain/TerrainTileKit";
import TerrainTileRenderer from "./core/terrain/renderers/TerrainTileRenderer";
import { CanvasRenderingContext2D, createCanvas } from "canvas";
import { TerrainTileType } from "./core/terrain/types/TerrainTileType";

export default class DebugCanvas {
    public static render(context: CanvasRenderingContext2D, size: number) {
        context.canvas.width = 25 * size;
        context.canvas.height = 9 * size;

        const offset = {
            left: 0,
            top: 0
        };

        const terrainTileRenderer = new TerrainTileRenderer(size, true);
        const terrainTileKit = new TerrainTileKit(terrainTileRenderer);

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
    };
};
