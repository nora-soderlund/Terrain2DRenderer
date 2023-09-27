import TerrainCanvas from "./core/terrain/TerrainCanvas";
import TerrainDebugCanvas from "./browser/game/GameDebugCanvas";
import TerrainGrid from "./core/terrain/TerrainGrid";
import TerrainTiles from "./core/terrain/TerrainTiles";
import BrowserTerrainGrid from "./browser/terrain/BrowserTerrainGrid";
import GameCanvas from "./browser/game/GameCanvas";
import GameTerrainEntity from "./browser/game/entities/GameTerrainEntity";
import DebugCanvas from "./DebugCanvas";
import { CanvasRenderingContext2D } from "canvas";
import GameWaterEntity from "./browser/game/entities/GameWaterEntity";
import WaterRenderer from "./core/water/WaterRenderer";
import GameGridEntity from "./browser/game/entities/GameGridEntity";
import GridCanvas from "./core/grid/GridCanvas";
import GeoJsonAdapter from "./adapters/geojson/GeoJsonAdapter";
import CanvasPathsAdapter from "./adapters/canvas/CanvasPathsAdapter";
import CanvasGridAdapter from "./adapters/canvas/CanvasGridAdapter";

(async () => {
  {
    const response = await fetch("../assets/datahub/countries/countries.geojson");
    const result = await response.json();

    const feature = result.features.find((feature: any) => feature.properties["ADMIN"] === "Italy");

    const time = performance.now();

    if(!feature)
      return alert("sweden has ceased to exist, rip :(");

    const paths = GeoJsonAdapter.getPathsFromFeature(feature, 3, 0);

    if(!paths)
      return alert("sweden has no land anymore :(");

    const canvas = CanvasPathsAdapter.getCanvasFromPaths(paths);
    const gridMap = CanvasGridAdapter.getGridMapFromCanvas(canvas);

    const testTerrainGrid = new TerrainGrid(gridMap);
    
    const testTerrainTiles = new TerrainTiles(testTerrainGrid);
    const testTerrainTilesCollection = [ testTerrainTiles ];
    const terrainCanvas = new TerrainCanvas(testTerrainTilesCollection, 10, false);
    const gameTerrainEntity = new GameTerrainEntity(terrainCanvas);

    const gameWaterEntity = new GameWaterEntity(new WaterRenderer());
    const gameGridEntity = new GameGridEntity(new GridCanvas(10));

    const gameCanvas = new GameCanvas([ gameTerrainEntity, gameWaterEntity, gameGridEntity ], 10);

    const elapsed = performance.now() - time;

    console.log({ elapsed });

    document.body.append(gameCanvas.element);
  }

  {
    const terrainGrid = await BrowserTerrainGrid.fromAsset("../assets/Sweden.json");
    const terrainTilesCollection = [ new TerrainTiles(terrainGrid) ];
  
    const terrainCanvas = new TerrainCanvas(terrainTilesCollection, 10, false);
  
    console.log(terrainCanvas.canvas);
  
    const gameTerrainEntity = new GameTerrainEntity(terrainCanvas);
    const gameWaterEntity = new GameWaterEntity(new WaterRenderer());
    const gameGridEntity = new GameGridEntity(new GridCanvas(10));
    
    const gameCanvas = new GameCanvas([ gameTerrainEntity, gameWaterEntity, gameGridEntity ], 10);
  
    document.body.append(gameCanvas.element);
  }

  {
    const testTerrainGrid = new TerrainGrid([
      [ 1, 0, 0, 1, 1, 0, 1, 0, 0 ],
      [ 0, 1, 1, 1, 1, 0, 1, 1, 0 ],
      [ 0, 0, 1, 1, 1, 0, 1, 1, 1 ],
      [ 0, 0, 0, 1, 0, 1, 1, 1, 1 ],
      [ 0, 0, 1, 1, 1, 0, 1, 0, 0 ]
    ]);
    
    const testTerrainTiles = new TerrainTiles(testTerrainGrid);
    const testTerrainTilesCollection = [ testTerrainTiles ];
    const terrainCanvas = new TerrainCanvas(testTerrainTilesCollection, 100, false);
    const gameTerrainEntity = new GameTerrainEntity(terrainCanvas);

    const gameCanvas = new GameCanvas([ gameTerrainEntity ], 100);

    document.body.append(gameCanvas.element);
  }

  {
    const debugCanvas = document.createElement("canvas");
    DebugCanvas.render(debugCanvas.getContext("2d") as unknown as CanvasRenderingContext2D, 100);
    debugCanvas.style.width = debugCanvas.style.height = "auto";
    document.body.append(debugCanvas);
  }
})();
