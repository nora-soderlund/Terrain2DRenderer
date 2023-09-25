import { writeFileSync } from "node:fs";
import TerrainTiles from "../../../../src/core/terrain/TerrainTiles";
import TerrainCanvas from "../../../../src/core/terrain/TerrainCanvas";
import TerrainGrid from "../../../../src/core/terrain/TerrainGrid";
import WaterRenderer from "../../../../src/core/water/WaterRenderer";
import GridCanvas from "../../../../src/core/grid/GridCanvas";
import { createCanvas } from "canvas";

const terrainGrid = new TerrainGrid([
    [ 1, 0, 0, 0, 1, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 1, 0, 1, 1, 0 ],
    [ 0, 1, 1, 1, 1, 0, 1, 1, 1 ],
    [ 0, 0, 0, 1, 0, 1, 1, 1, 1 ],
    [ 0, 0, 1, 1, 1, 0, 1, 0, 0 ]
  ]);

const terrainTiles = new TerrainTiles(terrainGrid);

const terrainCanvas = new TerrainCanvas([ terrainTiles ], 100);

const waterRenderer = new WaterRenderer();
const gridCanvas = new GridCanvas(100);

gridCanvas.render(terrainCanvas.canvas.width, terrainCanvas.canvas.height);

const canvas = createCanvas(terrainCanvas.canvas.width, terrainCanvas.canvas.height);
const context = canvas.getContext("2d");

waterRenderer.draw(context);
context.drawImage(gridCanvas.canvas, 0, 0);
context.drawImage(terrainCanvas.canvas, 0, 0);

const dataUrl = canvas.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/island.png", dataBuffer);
