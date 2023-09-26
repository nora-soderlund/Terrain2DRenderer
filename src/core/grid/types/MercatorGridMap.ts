export type MercatorGridMap = {
    worldCoordinate: {
        left: number;
        top: number;
    };

    zoomLevel: number;

    map: number[][];
};
