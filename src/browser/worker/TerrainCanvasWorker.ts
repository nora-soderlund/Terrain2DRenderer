import TerrainTileKit from "../../core/terrain/TerrainTileKit";
import TerrainTileRenderer from "../../core/terrain/renderers/TerrainTileRenderer";
import { OffScreenCanvas2DContext } from "../../types/Canvas2DContext";
import { TerrainCanvasWorkerMessage } from "./types/TerrainCanvasWorkerMessage";

declare var self: ServiceWorkerGlobalScope;

let terrainTileRenderer: TerrainTileRenderer;
let terrainTileKit: TerrainTileKit;

onmessage = function(event: MessageEvent<TerrainCanvasWorkerMessage>) {
    const { type } = event.data;

    if(type === "INITIALIZE") {
        const { tileSize } = event.data.payload;

        terrainTileRenderer = new TerrainTileRenderer(tileSize);
        terrainTileKit = new TerrainTileKit(terrainTileRenderer);

        postMessage({ type: "READY" });
    }
    else if(type === "RENDER") {
        const { definitions, row, column, width, height } = event.data.payload;

        const canvas = new OffscreenCanvas(width * terrainTileRenderer.size, height * terrainTileRenderer.size);
        const context = canvas.getContext("2d")!;

        const offset = {
            left: -((column - 1) * terrainTileRenderer.size),
            top: -((row - 1) * terrainTileRenderer.size)
        };

        for(let tileDefinition of definitions) {
            terrainTileKit.draw(context as OffScreenCanvas2DContext, offset, tileDefinition.type, tileDefinition.row, tileDefinition.column, tileDefinition.direction);
        }

        const message = {
            type: "RESULT",
            payload: {
                image: canvas.transferToImageBitmap()
            }
        };

        postMessage(message, [ message.payload.image ]);
    }
}
