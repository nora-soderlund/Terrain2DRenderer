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
    public offset: Point = {
        left: 0,
        top: 0
    };

    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Terrain;
    public readonly pixelCoordinates?: MercatorPixelCoordinates;

    private targetTileSize: number;
   
    private readonly parts: MercatorGameTerrainEntityPart[] = [];
    private readonly visibleParts: MercatorGameTerrainEntityPart[] = [];

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
        part.status = "PROCESSING";

        console.log("Processing");
        
        this.terrainCanvasWorkerPool.getCanvasPart(this.terrainCanvas.terrainTiles, part.row, part.column, part.width, part.height, this.targetTileSize).then((image) => {
            console.log("Part is updated");
            
            part.tileSize = this.targetTileSize;
            part.image = image;
            part.status = "READY";
        });
    }

    public process(gameCanvas: MercatorGameCanvas): void {
        this.visibleParts.length = 0;

        for(let part of this.parts) {
            const left = part.column * gameCanvas.size;
            const top = part.row * gameCanvas.size;

            const width = part.width * gameCanvas.size;
            const height = part.height * gameCanvas.size;
                
            if(!gameCanvas.isCoordinateInView(this.offset, left, top, width, height))
                continue;

            if(part.status === "READY") {
                if(part.tileSize !== this.targetTileSize) {
                    this.processTileSizeChange(part);
                }
            }
            else if(part.status === "CREATED") {
                this.processTileSizeChange(part);
            }

            this.visibleParts.push(part);
        }
    };

    public draw(gameCanvas: MercatorGameCanvas, context: CanvasRenderingContext2D): void {
        for(let part of this.visibleParts) {
            const left = part.column * gameCanvas.size;
            const top = part.row * gameCanvas.size;

            const width = part.width * gameCanvas.size;
            const height = part.height * gameCanvas.size;
                
            if(part.image) {
                context.drawImage(part.image,
                    0, 0, part.image.width, part.image.height,
                    left, top, width, height);
            }
        }
    };
};
