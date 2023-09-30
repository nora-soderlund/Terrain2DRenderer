import TerrainGrid from "./core/terrain/TerrainGrid";
import TerrainTiles from "./core/terrain/TerrainTiles";

onmessage = function(event) {
    console.log('Worker: Message received from main script');

    console.time("Worker");

    const testTerrainGrid = new TerrainGrid(event.data, {
        ignoreSlopes: true
    });
    
    const terrainTiles = new TerrainTiles(testTerrainGrid);

    console.timeEnd("Worker");

    this.postMessage(terrainTiles);
}
