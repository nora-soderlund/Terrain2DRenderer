import { writeFileSync } from "node:fs";
import TerrainTiles from "../../../../src/core/terrain/TerrainTiles";
import TerrainCanvas from "../../../../src/core/terrain/TerrainCanvas";
import WaterRenderer from "../../../../src/core/water/WaterRenderer";
import GridCanvas from "../../../../src/core/grid/GridCanvas";
import NodeTerrainGrid from "../../../../src/node/terrain/NodeTerrainGrid";
import { createCanvas } from "canvas";

const terrainGrid = NodeTerrainGrid.fromAsset("../../../assets/Sweden.json");
const terrainTilesCollection = [ new TerrainTiles(terrainGrid) ];

const terrainCanvas = new TerrainCanvas(terrainTilesCollection, 10);

const waterRenderer = new WaterRenderer();
const gridCanvas = new GridCanvas(10);

gridCanvas.render(terrainCanvas.canvas.width, terrainCanvas.canvas.height);

const canvas = createCanvas(terrainCanvas.canvas.width, terrainCanvas.canvas.height);
const context = canvas.getContext("2d");

waterRenderer.draw(context);
context.drawImage(gridCanvas.canvas, 0, 0);
context.drawImage(terrainCanvas.canvas, 0, 0);

const dataUrl = canvas.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/geojson.png", dataBuffer);
