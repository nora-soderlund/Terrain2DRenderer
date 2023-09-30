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
import { Canvas2DContext } from "./types/Canvas2DContext";

(async () => {
  {
    const response = await fetch("../assets/datahub/countries/countries.geojson");
    const result = await response.json();

    const zoomLevel = 3;
    const tileSize = 10;

    const time = performance.now();

    const entities: MercatorGameCanvasEntity[] = [];

    const terrainTileRenderer = new TerrainTileRenderer(tileSize);
    //const terrainTileKit = new TerrainTileKit(terrainTileRenderer);
    const terrainTileKit = new TerrainTileKit(terrainTileRenderer);

    const countries = [ "Norway", "Sweden", "Denmark", "Finland", "Estonia", "Latvia", "Lithuania", "Poland", "Germany", "Ukraine", "Netherlands" ];
    //const countries = result.features.slice(1, 12).map((feature: any) => feature.properties["ADMIN"]);

    console.log({ countries });

    //for(let feature of result.features.slice(0, 10)) {
    //for(let country of [ "Russia" ]) {
    let workers: Worker[] = [];
    let maxWorkers = navigator.hardwareConcurrency || 4;

    for(let index = 0; index < maxWorkers; index++)
      workers.push(new Worker("../dist/worker.js"));

    async function createWorker(worker: Worker) {
      if(!countries.length) {
        worker.terminate();

        return;
      }

      const country = countries.splice(0, 1)[0];

      const feature = result.features.find((feature: any) => feature.properties["ADMIN"] === country);

      const mercatorGrid = MercatorAdapter.getMercatorGridMapFromGeoJson(feature, zoomLevel, 2);

      const terrainCanvas = await new Promise<TerrainCanvas>((resolve) => {
        function callback(event: MessageEvent) {
          worker.removeEventListener("message", callback);

          resolve(event.data);
        };

        worker.addEventListener("message", callback);
        worker.postMessage({
          map: mercatorGrid.map,
          country,
          tileSize
        });
      });


      const gameTerrainEntity = new MercatorGameTerrainEntity(terrainCanvas, mercatorGrid.coordinate);

      entities.push(gameTerrainEntity);

      return createWorker(worker);
    };

    await Promise.all(workers.map(async (worker) => {
      return await createWorker(worker);
    }));

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
    DebugCanvas.render(debugCanvas.getContext("2d") as Canvas2DContext, 100);
    debugCanvas.style.width = debugCanvas.style.height = "auto";
    document.body.append(debugCanvas);
  }
})();
