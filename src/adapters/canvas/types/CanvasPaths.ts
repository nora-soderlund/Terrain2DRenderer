export type CanvasPaths = {
    paths: {
        left: number;
        top: number;
    }[][];

    bounds?: {
        minimumLeft: number;
        maximumLeft: number;

        minimumTop: number;
        maximumTop: number;
    };
};
