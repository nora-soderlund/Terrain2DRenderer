import TerrainTileKit from "../../core/terrain/TerrainTileKit";
import TerrainTileRenderer from "../../core/terrain/renderers/TerrainTileRenderer";
import { OffScreenCanvas2DContext } from "../../types/Canvas2DContext";
import { TerrainCanvasWorkerMessage } from "./types/TerrainCanvasWorkerMessage";

declare var self: ServiceWorkerGlobalScope;

const terrainTileKits: Map<number, TerrainTileKit> = new Map();

onmessage = function(event: MessageEvent<TerrainCanvasWorkerMessage>) {
    const { type } = event.data;

    if(type === "RENDER") {
        let { definitions, row, column, width, height, tileSize } = event.data.payload;

        definitions = definitions.filter((definition) => {
            if(definition.row < row || definition.row > row + height)
                return false;
            
            if(definition.column < column || definition.column > column + width)
                return false;
            
            return true;
        });

        if(!terrainTileKits.has(tileSize)) {
            const terrainTileRenderer = new TerrainTileRenderer(tileSize);
            const terrainTileKit = new TerrainTileKit(terrainTileRenderer);

            terrainTileKits.set(tileSize, terrainTileKit);
        }

        const terrainTileKit = terrainTileKits.get(tileSize)!;

        const canvas = new OffscreenCanvas(width * tileSize, height * tileSize);
        const context = canvas.getContext("2d")!;

        const offset = {
            left: -((column - 1) * tileSize),
            top: -((row - 1) * tileSize)
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

postMessage({
    type: "READY"
});
