import { Direction } from "./Direction";
import { TerrainGridItem } from "./TerrainGridItem";

export type TerrainGridItemWithAngle = TerrainGridItem & {
    angle: number;
};
