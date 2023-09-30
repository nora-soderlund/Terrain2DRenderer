import TerrainCanvas from "../../../../core/terrain/TerrainCanvas";
import TerrainTiles from "../../../../core/terrain/TerrainTiles";
import { Point } from "../../../../types/Point";
import TerrainCanvasWorkerPool from "../../../worker/TerrainCanvasWorkerPool";
import GameCanvas from "../../GameCanvas";
import GameTerrainEntity from "../../entities/GameTerrainEntity";
import { GameEntityPriority } from "../../types/GameEntityPriority";
import MercatorGameCanvas from "../MercatorGameCanvas";
import { MercatorCoordinates } from "../types/MercatorCoordinates";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";
import { MercatorPixelCoordinates } from "../types/MercatorPixelCoordinates";

export type MercatorGameTerrainEntityPart = {
    row: number;
    column: number;

    width: number;
    height: number;
    
    status: "CREATED" | "PROCESSING" | "READY";

    tileSize: number;
    
    image?: ImageBitmap;
};

export default class MercatorGameTerrainEntity implements MercatorGameCanvasEntity {
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Terrain;
    public readonly pixelCoordinates?: MercatorPixelCoordinates;

    private targetTileSize: number;
   
    private readonly parts: MercatorGameTerrainEntityPart[] = [];

    constructor(
        private readonly gameCanvas: MercatorGameCanvas,
        private readonly terrainCanvas: TerrainCanvas,
        public readonly coordinates: MercatorCoordinates,
        private readonly terrainCanvasWorkerPool: TerrainCanvasWorkerPool,
        private readonly tileSizeSteps: number[] = [],
        private readonly tileSizePositions: number[] = []
        ) {
        this.targetTileSize = this.terrainCanvas.size;

        for(let part of this.terrainCanvas.parts) {
            const newEntityPart: MercatorGameTerrainEntityPart = {
                row: part.row,
                column: part.column,
                
                width: part.width,
                height: part.height,

                tileSize: terrainCanvas.size,
                
                status: "CREATED"
            };

            this.parts.push(newEntityPart);

            newEntityPart.status = "PROCESSING";

            this.terrainCanvasWorkerPool.getCanvasPart(this.terrainCanvas.terrainTiles, part.row, part.column, part.width, part.height, newEntityPart.tileSize).then((image) => {
                console.log("Part is ready");

                newEntityPart.image = image;
                newEntityPart.status = "READY";
            });
        }

        this.gameCanvas.events.addListener("TileSizeChanged", this.handleTileSizeChange.bind(this));
    };

    private getCurrentTargetTileSize() {
        return this.tileSizeSteps[this.tileSizePositions.findIndex((tileSizePosition) => this.gameCanvas.size > tileSizePosition)];
    }

    private handleTileSizeChange() {
        this.targetTileSize = this.getCurrentTargetTileSize();
    };

    private processTileSizeChange(part: MercatorGameTerrainEntityPart) {
        if(part.tileSize === this.targetTileSize || part.status !== "READY")
            return;

        part.status = "PROCESSING";
        
        this.terrainCanvasWorkerPool.getCanvasPart(this.terrainCanvas.terrainTiles, part.row, part.column, part.width, part.height, this.targetTileSize).then((image) => {
            console.log("Part is updated");
            
            part.tileSize = this.targetTileSize;
            part.image = image;
            part.status = "READY";
        });
    }

    public draw(gameCanvas: MercatorGameCanvas, context: CanvasRenderingContext2D, offset: Point): void {
        for(let part of this.parts) {
            if(part.image) {
                const left = part.column * gameCanvas.size;
                const top = part.row * gameCanvas.size;

                const scale = gameCanvas.size / part.tileSize;
                
                if(!gameCanvas.isCoordinateInView(offset, left, top, part.image.width * scale, part.image.height * scale))
                    continue;

                if(part.tileSize !== this.targetTileSize)
                    this.processTileSizeChange(part);

                context.drawImage(part.image,
                    0, 0, part.image.width, part.image.height,
                    left, top, part.image.width * scale, part.image.height * scale);
            }
        }
    };
};
