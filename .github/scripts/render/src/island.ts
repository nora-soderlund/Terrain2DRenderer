import { writeFileSync } from "node:fs";
import TerrainTiles from "../../../../src/core/terrain/TerrainTiles";
import TerrainCanvas from "../../../../src/core/terrain/TerrainCanvas";
import NodeTerrainGrid from "../../../../src/node/terrain/NodeTerrainGrid";
import TerrainGrid from "../../../../src/core/terrain/TerrainGrid";

const terrainGrid = new TerrainGrid([
    [ 1, 0, 0, 0, 1, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 1, 0, 1, 1, 0 ],
    [ 0, 1, 1, 1, 1, 0, 1, 1, 1 ],
    [ 0, 0, 0, 1, 0, 1, 1, 1, 1 ],
    [ 0, 0, 1, 1, 1, 0, 1, 0, 0 ]
  ]);

const terrainTiles = new TerrainTiles(terrainGrid);

const terrainCanvas = new TerrainCanvas([ terrainTiles ], 100);

const dataUrl = terrainCanvas.canvas.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/island.png", dataBuffer);
