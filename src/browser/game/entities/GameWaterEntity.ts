import TerrainCanvas from "../../../core/terrain/TerrainCanvas";
import WaterRenderer from "../../../core/water/WaterRenderer";
import GameCanvas from "../GameCanvas";
import GameCanvasEntity from "../types/GameCanvasEntity";
import { GameEntityPriority } from "../types/GameEntityPriority";

export default class GameWaterEntity implements GameCanvasEntity {
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Water;

    constructor(private readonly waterRenderer: WaterRenderer) {
        
    }

    public draw(gameCanvas: GameCanvas, context: CanvasRenderingContext2D): void {
        context.translate(-gameCanvas.offset.left, -gameCanvas.offset.top);
        
        this.waterRenderer.draw(context as any);
    };
}