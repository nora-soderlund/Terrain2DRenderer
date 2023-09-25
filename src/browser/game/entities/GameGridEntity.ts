import GridCanvas from "../../../core/grid/GridCanvas";
import TerrainCanvas from "../../../core/terrain/TerrainCanvas";
import WaterRenderer from "../../../core/water/WaterRenderer";
import GameCanvas from "../GameCanvas";
import GameCanvasEntity from "../types/GameCanvasEntity";
import { GameEntityPriority } from "../types/GameEntityPriority";

export default class GameGridEntity implements GameCanvasEntity {
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Water;

    constructor(private readonly gridCanvas: GridCanvas) {
        
    }

    public draw(gameCanvas: GameCanvas, context: CanvasRenderingContext2D): void {
        context.translate(-gameCanvas.offset.left, -gameCanvas.offset.top);
        
        this.gridCanvas.render(context.canvas.width, context.canvas.height);

        context.translate((gameCanvas.offset.left % this.gridCanvas.size) - this.gridCanvas.size, (gameCanvas.offset.top % this.gridCanvas.size) - this.gridCanvas.size);

        context.drawImage(this.gridCanvas.canvas as any, 0, 0);
    };
}