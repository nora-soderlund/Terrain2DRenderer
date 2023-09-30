import TerrainTiles from "../../core/terrain/TerrainTiles";
import { TerrainCanvasWorkerInstance } from "./types/TerrainCanvasWorkerInstance";
import { TerrainCanvasWorkerMessage } from "./types/TerrainCanvasWorkerMessage";
import { TerrainCanvasWorkerQueue } from "./types/TerrainCanvasWorkerQueue";

export default class TerrainCanvasWorkerPool {
    private readonly workers: TerrainCanvasWorkerInstance[] = [];
    private readonly queue: TerrainCanvasWorkerQueue[] = [];

    constructor(private readonly maximumWorkers: number = navigator.hardwareConcurrency) {

    }

    private createWorkerInstance() {
        const instance: TerrainCanvasWorkerInstance = {
            worker: new Worker("../dist/worker.js"),
            status: "READY"
        };

        instance.worker.addEventListener("message", (event) => this.handleWorkerMessage(instance, event));

        this.workers.push(instance);
    };

    private handleWorkerMessage(instance: TerrainCanvasWorkerInstance, event: MessageEvent<TerrainCanvasWorkerMessage>) {
        const { type } = event.data;

        if(type === "READY" || type === "RESULT") {
            instance.status = "READY";

            if(!this.queue.length) {
                this.workers.splice(this.workers.indexOf(instance), 1);

                instance.worker.terminate();

                return;
            }

            const queue = this.queue.splice(0, 1)[0];

            instance.status = "BUSY";

            function callback(event: MessageEvent<TerrainCanvasWorkerMessage>) {
                const { type } = event.data;

                if(type === "RESULT") {
                    const { payload } = event.data;

                    instance.worker.removeEventListener("message", callback);

                    queue.callback(payload.image);
                }
            }

            instance.worker.addEventListener("message", callback);

            instance.worker.postMessage({
                type: "RENDER",
                payload: {
                    definitions: queue.definitions,

                    row: queue.row,
                    column: queue.column,

                    width: queue.width,
                    height: queue.height,

                    tileSize: queue.tileSize
                }
            });
        }
    };

    async getCanvasPart(terrainTiles: TerrainTiles, row: number, column: number, width: number, height: number, tileSize: number) {
        return new Promise<ImageBitmap>((resolve) => {
            const definitions = terrainTiles.definitions.filter((definition) => {
                if(definition.row < row || definition.row > row + height)
                    return false;
                
                if(definition.column < column || definition.column > column + width)
                    return false;
                
                return true;
            });

            this.queue.push({
                definitions,
                
                row,
                column,
                
                width,
                height,

                tileSize,

                callback: resolve
            });
    
            if(this.workers.length !== this.maximumWorkers)
                this.createWorkerInstance();
        });
    };
};
