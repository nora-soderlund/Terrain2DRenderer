import TerrainTiles from "../../../core/terrain/TerrainTiles";
import { TerrainTileDefinition } from "../../../core/terrain/types/TerrainTileDefinition";

export type TerrainCanvasWorkerQueue = {
    definitions: TerrainTileDefinition[];
    
    row: number;
    column: number;

    width: number;
    height: number;

    tileSize: number;

    callback: (image: ImageBitmap) => void;
};
