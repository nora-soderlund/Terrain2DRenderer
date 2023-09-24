import { Direction } from "../../../types/Direction";
import { TerrainTileType } from "./TerrainTileType";

export type TerrainTileDefinition = {
    row: number;
    column: number;
    direction: Direction;
    type: TerrainTileType;
};
