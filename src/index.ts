import TerrainCanvas from "./core/terrain/TerrainCanvas";
import TerrainDebugCanvas from "./browser/game/GameDebugCanvas";
import TerrainGrid from "./core/terrain/TerrainGrid";
import TerrainTiles from "./core/terrain/TerrainTiles";
import BrowserTerrainGrid from "./browser/terrain/BrowserTerrainGrid";
import GameCanvas from "./browser/game/GameCanvas";
import GameTerrainEntity from "./browser/game/entities/GameTerrainEntity";
import DebugCanvas from "./DebugCanvas";
import { CanvasRenderingContext2D } from "canvas";

const testTerrainGrid = new TerrainGrid([
  [ 1, 0, 0, 1, 1, 0, 1, 0, 0 ],
  [ 0, 1, 1, 1, 1, 0, 1, 1, 0 ],
  [ 0, 0, 1, 1, 1, 0, 1, 1, 1 ],
  [ 0, 0, 0, 1, 0, 1, 1, 1, 1 ],
  [ 0, 0, 1, 1, 1, 0, 1, 0, 0 ]
]);


(async () => {

  const terrainGrid = await BrowserTerrainGrid.fromAsset("../assets/Sweden.json");
  const terrainTilesCollection = [ new TerrainTiles(terrainGrid) ];

  const testTerrainTiles = new TerrainTiles(testTerrainGrid);
  const testTerrainTilesCollection = [ testTerrainTiles ];

  const terrainCanvas = new TerrainCanvas(terrainTilesCollection, 10, false);

  console.log(terrainCanvas.canvas);

  const gameTerrainEntity = new GameTerrainEntity(terrainCanvas);
  
  const gameCanvas = new GameCanvas([ gameTerrainEntity ]);

  document.body.append(gameCanvas.element);

  const debugCanvas = document.createElement("canvas");
  DebugCanvas.render(debugCanvas.getContext("2d") as unknown as CanvasRenderingContext2D, 100);
  debugCanvas.style.width = debugCanvas.style.height = "auto";
  document.body.append(debugCanvas);
})();
