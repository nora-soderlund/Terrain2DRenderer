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
import MercatorGameCanvas from "./browser/game/mercator/MercatorGameCanvas";
import MercatorGameWaterEntity from "./browser/game/mercator/entities/MercatorGameWaterEntity";
import MercatorGameGridEntity from "./browser/game/mercator/entities/MercatorGameGridEntity";
import MercatorGameTerrainEntity from "./browser/game/mercator/entities/MercatorGameTerrainEntity";
import MercatorAdapter from "./adapters/mercator/MercatorAdapter";
import MercatorGameCanvasEntity from "./browser/game/mercator/types/MercatorGameCanvasEntity";

(async () => {
  {
    const response = await fetch("../assets/datahub/countries/countries.geojson");
    const result = await response.json();

    const zoomLevel = 3;
    const tileSize = 3;

    const time = performance.now();

    const entities: MercatorGameCanvasEntity[] = [];

    for(let administratory of [ "Sweden", "Finland", "Norway" ]) {
      const feature = result.features.find((feature: any) => feature.properties["ADMIN"] === administratory);
      const mercatorGrid = MercatorAdapter.getMercatorGridMapFromGeoJson(feature, zoomLevel, 1);
      const testTerrainGrid = new TerrainGrid(mercatorGrid.map);
      const testTerrainTiles = new TerrainTiles(testTerrainGrid);
      const testTerrainTilesCollection = [ testTerrainTiles ];
      const terrainCanvas = new TerrainCanvas(testTerrainTilesCollection, tileSize, false);
      const gameTerrainEntity = new MercatorGameTerrainEntity(terrainCanvas, mercatorGrid.coordinate);

      console.log(administratory, { coordinates: mercatorGrid.coordinate })

      entities.push(gameTerrainEntity);
    }

    const gameWaterEntity = new MercatorGameWaterEntity(new WaterRenderer());
    const gameGridEntity = new MercatorGameGridEntity(new GridCanvas(tileSize));

    const mercatorGameCanvas = new MercatorGameCanvas(entities.concat(gameWaterEntity, gameGridEntity), tileSize, zoomLevel);
    mercatorGameCanvas.setCoordinates(entities[0].coordinates!);

    //const gameCanvas = new GameCanvas([ gameTerrainEntity, gameWaterEntity, gameGridEntity ], 10);

    const elapsed = performance.now() - time;

    console.log({ elapsed });

    document.body.append(mercatorGameCanvas.element);
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
