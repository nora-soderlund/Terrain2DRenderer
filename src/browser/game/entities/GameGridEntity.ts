import GridCanvas from "../../../core/grid/GridCanvas";
import TerrainCanvas from "../../../core/terrain/TerrainCanvas";
import WaterRenderer from "../../../core/water/WaterRenderer";
import { Point } from "../../../types/Point";
import GameCanvas from "../GameCanvas";
import GameCanvasEntity from "../types/GameCanvasEntity";
import GameCanvasInterface from "../types/GameCanvasInterface";
import { GameEntityPriority } from "../types/GameEntityPriority";

export default class GameGridEntity implements GameCanvasEntity {
    public offset: Point = {
        left: 0,
        top: 0
    };
    
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Water;

    constructor(private readonly gridCanvas: GridCanvas) {
        
    }

    public draw(gameCanvas: GameCanvas, context: CanvasRenderingContext2D): void {
        context.translate(-gameCanvas.offset.left, -gameCanvas.offset.top);
        
        this.gridCanvas.render(gameCanvas.size, context.canvas.width, context.canvas.height);

        const left = (gameCanvas.offset.left % gameCanvas.size) - gameCanvas.size;
        const top = (gameCanvas.offset.top % gameCanvas.size) - gameCanvas.size;

        context.translate(left, top);

        context.drawImage(this.gridCanvas.canvas as any, 0, 0);
    };
}