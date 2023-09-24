import TerrainGridRenderer from "./core/terrain/renderers/TerrainGridRenderer";
import TerrainTileRenderer from "./core/terrain/renderers/TerrainTileRenderer";
import TerrainWaterRenderer from "./core/terrain/renderers/TerrainWaterRenderer";
import { CanvasRenderingContext2D, createCanvas } from "canvas";

export default class DebugCanvas {
    public readonly element = createCanvas(0, 0);

    constructor(private readonly size: number) {
        this.render();
    };

    private render() {
        this.element.width = 25 * this.size;
        this.element.height = 9 * this.size;

        const context = this.element.getContext("2d")! as unknown as CanvasRenderingContext2D;

        const offset = {
            left: 100,
            top: 0
        };

        const terrainWaterRenderer = new TerrainWaterRenderer(context);
        terrainWaterRenderer.drawWater();

        const terrainGridRenderer = new TerrainGridRenderer(context, this.size, offset);
        terrainGridRenderer.drawGrid();

        const terrainTileRenderer = new TerrainTileRenderer(context, this.size, offset, true);

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
