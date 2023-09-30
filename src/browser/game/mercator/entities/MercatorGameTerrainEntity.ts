import TerrainCanvas from "../../../../core/terrain/TerrainCanvas";
import TerrainTiles from "../../../../core/terrain/TerrainTiles";
import TerrainCanvasWorkerPool from "../../../worker/TerrainCanvasWorkerPool";
import GameCanvas from "../../GameCanvas";
import GameTerrainEntity from "../../entities/GameTerrainEntity";
import { GameEntityPriority } from "../../types/GameEntityPriority";
import { MercatorCoordinates } from "../types/MercatorCoordinates";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";
import { MercatorPixelCoordinates } from "../types/MercatorPixelCoordinates";

export type MercatorGameTerrainEntityPart = {
    row: number;
    column: number;
    
    status: "CREATED" | "READY";
    
    image?: ImageBitmap;
};

export default class MercatorGameTerrainEntity implements MercatorGameCanvasEntity {
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Terrain;
    public readonly pixelCoordinates?: MercatorPixelCoordinates;
   
    private readonly parts: MercatorGameTerrainEntityPart[] = [];

    constructor(private readonly terrainCanvas: TerrainCanvas, public readonly coordinates: MercatorCoordinates, private readonly terrainCanvasWorkerPool: TerrainCanvasWorkerPool) {
        for(let part of this.terrainCanvas.parts) {
            const newEntityPart: MercatorGameTerrainEntityPart = {
                row: part.row,
                column: part.column,
                
                status: "CREATED"
            };

            this.parts.push(newEntityPart);

            this.terrainCanvasWorkerPool.getCanvasPart(this.terrainCanvas.terrainTiles, part.row, part.column, part.width, part.height).then((image) => {
                console.log("Part is ready");

                newEntityPart.image = image;
                newEntityPart.status = "READY";
            });
        }
    };

    public draw(gameCanvas: GameCanvas, context: CanvasRenderingContext2D): void {
        const scale = gameCanvas.size / this.terrainCanvas.size;
        
        context.scale(scale, scale);

        for(let part of this.parts) {
            if(part.image)
               context.drawImage(part.image, part.column * this.terrainCanvas.size, part.row * this.terrainCanvas.size);
        }
    };
};
