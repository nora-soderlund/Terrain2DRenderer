import { writeFileSync } from "node:fs";
import TerrainTiles from "../../../../src/core/terrain/TerrainTiles";
import TerrainCanvas from "../../../../src/core/terrain/TerrainCanvas";
import NodeTerrainGrid from "../../../../src/node/terrain/NodeTerrainGrid";

const terrainGrid = await NodeTerrainGrid.fromAsset("../../../../assets/Sweden.json");
const terrainTilesCollection = [ new TerrainTiles(terrainGrid) ];

const terrainCanvas = new TerrainCanvas(terrainTilesCollection, 10);

const dataUrl = terrainCanvas.canvas.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/geojson.png", dataBuffer);
