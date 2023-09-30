import TerrainCanvas from "../../../../core/terrain/TerrainCanvas";
import GameCanvas from "../../GameCanvas";
import GameTerrainEntity from "../../entities/GameTerrainEntity";
import { GameEntityPriority } from "../../types/GameEntityPriority";
import { MercatorCoordinates } from "../types/MercatorCoordinates";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";
import { MercatorPixelCoordinates } from "../types/MercatorPixelCoordinates";

export default class MercatorGameTerrainEntity implements MercatorGameCanvasEntity {
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Terrain;
    public readonly pixelCoordinates?: MercatorPixelCoordinates;
    
    constructor(private readonly terrainCanvas: TerrainCanvas, public readonly coordinates: MercatorCoordinates) {

    };

    public draw(gameCanvas: GameCanvas, context: CanvasRenderingContext2D): void {
        const scale = gameCanvas.size / this.terrainCanvas.size;
        
        context.scale(scale, scale);

        for(let part of this.terrainCanvas.parts)
            context.drawImage(part.canvas as unknown as HTMLCanvasElement, part.column * this.terrainCanvas.size, part.row * this.terrainCanvas.size);
    };
};
