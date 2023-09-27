import { MercatorCoordinates } from "../../../browser/game/mercator/types/MercatorCoordinates";

export type CanvasPaths = {
    paths: {
        left: number;
        top: number;
    }[][];

    minimumCoordinates?: MercatorCoordinates;

    bounds?: {
        minimumLeft: number;
        maximumLeft: number;

        minimumTop: number;
        maximumTop: number;
    };
};
