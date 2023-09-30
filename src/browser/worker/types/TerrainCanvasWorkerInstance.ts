export type TerrainCanvasWorkerInstance = {
    worker: Worker;
    status: "CREATED" | "READY" | "BUSY";
};
