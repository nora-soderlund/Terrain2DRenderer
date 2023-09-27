import { GridMap } from "../../../../types/GridMap";
import { MercatorCoordinates } from "./MercatorCoordinates";

export type MercatorGridMap = {
    coordinate: MercatorCoordinates;
    zoomLevel: number;
    map: GridMap;
};
