import TerrainCanvas from "../../../core/terrain/TerrainCanvas";
import GameCanvas from "../GameCanvas";
import GameCanvasEntity from "../types/GameCanvasEntity";
import { GameEntityPriority } from "../types/GameEntityPriority";

export default class GameTerrainEntity implements GameCanvasEntity {
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Terrain;

    constructor(private readonly terrainCanvas: TerrainCanvas) {
        
    }

    public draw(gameCanvas: GameCanvas, context: CanvasRenderingContext2D): void {
        const scale = gameCanvas.size / this.terrainCanvas.size;
        
        context.scale(scale, scale);

        context.drawImage(this.terrainCanvas.canvas as unknown as HTMLCanvasElement, 0, 0);
    };
}