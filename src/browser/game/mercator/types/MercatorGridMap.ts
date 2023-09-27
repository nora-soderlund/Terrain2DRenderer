import { GridMap } from "../../../../types/GridMap";

export type MercatorGridMap = {
    worldCoordinate: {
        left: number;
        top: number;
    };

    zoomLevel: number;

    map: GridMap;
};
