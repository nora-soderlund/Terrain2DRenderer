import TerrainCanvas from "./core/terrain/TerrainCanvas";
import TerrainGrid from "./core/terrain/TerrainGrid";
import TerrainTileKit from "./core/terrain/TerrainTileKit";
import TerrainTiles from "./core/terrain/TerrainTiles";
import TerrainTileRenderer from "./core/terrain/renderers/TerrainTileRenderer";

declare var self: ServiceWorkerGlobalScope;

onmessage = function(event) {
    const { map, country, tileSize } = event.data;

    const terrainTileRenderer = new TerrainTileRenderer(tileSize);
    const terrainTileKit = new TerrainTileKit(terrainTileRenderer);

    console.time(country);

    const testTerrainGrid = new TerrainGrid(map, {
        ignoreSlopes: true
    });
    
    const terrainTiles = new TerrainTiles(testTerrainGrid, {
        ignoreSlopes: true
    });

    const terrainCanvas = new TerrainCanvas(terrainTileKit, terrainTiles, tileSize, false);

    console.timeEnd(country);

    const result = {
        parts: terrainCanvas.parts.map((part) => {
            return {
                ...part,
                canvas: (part.canvas as OffscreenCanvas).transferToImageBitmap()
            };
        }),
        size: terrainCanvas.size
    };


    postMessage(result, result.parts.map((part) => part.canvas));
}
