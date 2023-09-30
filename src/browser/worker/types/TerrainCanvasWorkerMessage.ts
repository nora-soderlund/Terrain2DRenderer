import TerrainTiles from "../../../core/terrain/TerrainTiles";
import { TerrainTileDefinition } from "../../../core/terrain/types/TerrainTileDefinition";
import { TerrainCanvasWorkerQueue } from "./TerrainCanvasWorkerQueue";

export type TerrainCanvasWorkerMessage = 
    {
        type: "READY"
    } |
    {
        type: "RENDER",
        payload: {
            definitions: TerrainTileDefinition[];

            row: number;
            column: number;

            width: number;
            height: number;

            tileSize: number;
        }
    } |
    {
        type: "RESULT",
        payload: {
            image: ImageBitmap;
        }
    };
