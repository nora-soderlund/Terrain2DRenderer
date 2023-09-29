import TerrainCanvas from "./core/terrain/TerrainCanvas";
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
import MercatorGameCanvas from "./browser/game/mercator/MercatorGameCanvas";
import MercatorGameTerrainEntity from "./browser/game/mercator/entities/MercatorGameTerrainEntity";
import MercatorAdapter from "./adapters/mercator/MercatorAdapter";
import MercatorGameCanvasEntity from "./browser/game/mercator/types/MercatorGameCanvasEntity";
import TerrainTileKit from "./core/terrain/TerrainTileKit";
import TerrainTileRenderer from "./core/terrain/renderers/TerrainTileRenderer";

(async () => {
  {
    const response = await fetch("../assets/datahub/countries/countries.geojson");
    const result = await response.json();

    const zoomLevel = 3;
    const tileSize = 20;

    const time = performance.now();

    const entities: MercatorGameCanvasEntity[] = [];

    for(let administratory of [ "Norway", "Sweden", "Denmark", "Finland", "Estonia", "Latvia", "Lithuania", "Poland", "Germany", "Ukraine" ]) {
      const feature = result.features.find((feature: any) => feature.properties["ADMIN"] === administratory);
      const mercatorGrid = MercatorAdapter.getMercatorGridMapFromGeoJson(feature, zoomLevel, 2);
      const testTerrainGrid = new TerrainGrid(mercatorGrid.map);
      
      const terrainTileRenderer = new TerrainTileRenderer(tileSize);
      const terrainTileKit = new TerrainTileKit(terrainTileRenderer);

      const terrainTiles = new TerrainTiles(testTerrainGrid);

      const terrainCanvas = new TerrainCanvas(terrainTileKit, terrainTiles, tileSize, false);
      const gameTerrainEntity = new MercatorGameTerrainEntity(terrainCanvas, mercatorGrid.coordinate);

      entities.push(gameTerrainEntity);
    }

    const gameWaterEntity = new GameWaterEntity(new WaterRenderer());
    const gameGridEntity = new GameGridEntity(new GridCanvas());

    const mercatorGameCanvas = new MercatorGameCanvas(entities.concat(gameWaterEntity, gameGridEntity), 2, zoomLevel);
    mercatorGameCanvas.setCoordinates(entities[1].coordinates!);

    //const gameCanvas = new GameCanvas([ gameTerrainEntity, gameWaterEntity, gameGridEntity ], 10);

    const elapsed = performance.now() - time;

    console.log({ elapsed });

    document.body.append(mercatorGameCanvas.element);
  }

  {
    const terrainGrid = await BrowserTerrainGrid.fromAsset("../assets/Sweden.json");
    const terrainTiles = new TerrainTiles(terrainGrid);
  
    const terrainTileRenderer = new TerrainTileRenderer(10);
    const terrainTileKit = new TerrainTileKit(terrainTileRenderer);

    const terrainCanvas = new TerrainCanvas(terrainTileKit, terrainTiles, 10, false);
  
    const gameTerrainEntity = new GameTerrainEntity(terrainCanvas);
    const gameWaterEntity = new GameWaterEntity(new WaterRenderer());
    const gameGridEntity = new GameGridEntity(new GridCanvas());
    
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
  
    const terrainTileRenderer = new TerrainTileRenderer(100);
    const terrainTileKit = new TerrainTileKit(terrainTileRenderer);
    
    const terrainTiles = new TerrainTiles(testTerrainGrid);
    const terrainCanvas = new TerrainCanvas(terrainTileKit, terrainTiles, 100, false);
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
