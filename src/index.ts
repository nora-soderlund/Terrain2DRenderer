import GameCanvas from "./game/GameCanvas";
import TerrainCanvas from "./terrain/TerrainCanvas";
import TerrainDebugCanvas from "./terrain/TerrainDebugCanvas";
import TerrainGrid from "./terrain/TerrainGrid";
import TerrainTiles from "./terrain/TerrainTiles";

const testTerrainGrid = new TerrainGrid([
  [ 1, 0, 0, 0, 1, 0, 1, 0, 0 ],
  [ 0, 1, 1, 1, 1, 0, 1, 1, 0 ],
  [ 0, 0, 1, 1, 1, 0, 1, 1, 1 ],
  [ 0, 0, 0, 1, 0, 1, 1, 1, 1 ],
  [ 0, 0, 1, 1, 1, 0, 1, 0, 0 ]
]);

const sweden = [
  "Sweden_Blekinge.json",
  "Sweden_Dalarna.json",
  "Sweden_Gävleborg.json",
  "Sweden_Gotland.json",
  "Sweden_Halland.json",
  "Sweden_Jämtland.json",
  "Sweden_Jönköping.json",
  "Sweden_Kalmar.json",
  "Sweden_Kronoberg.json",
  "Sweden_Norrbotten.json",
  "Sweden_Orebro.json",
  "Sweden_Östergötland.json",
  "Sweden_Skåne.json",
  "Sweden_Södermanland.json",
  "Sweden_Stockholm.json",
  "Sweden_Uppsala.json",
  "Sweden_Värmland.json",
  "Sweden_Västerbotten.json",
  "Sweden_Västernorrland.json",
  "Sweden_Västmanland.json",
  "Sweden_Västra_Götaland.json"
];

(async () => {
  const terrainGrid = await TerrainGrid.fromAsset("sweden/Sweden_Västra_Götaland.json");

  const terrainGrids = (await Promise.all(sweden.map((asset) => {
    return TerrainGrid.fromAsset("sweden/" + asset);
  })));
  
  const terrainTilesCollection = terrainGrids.map((terrainGrid) => {
    const terrainTiles = new TerrainTiles(terrainGrid);
   
    return terrainTiles;
  });

  const terrainCanvas = new TerrainCanvas(terrainTilesCollection, 50);
  
  const gameCanvas = new GameCanvas([ terrainCanvas ]);

  document.body.append(gameCanvas.element);
  //document.body.append(new TerrainDebugCanvas(100).element);
})();
