import { writeFileSync } from "node:fs";
import TerrainTiles from "../../../../src/core/terrain/TerrainTiles";
import TerrainCanvas from "../../../../src/core/terrain/TerrainCanvas";
import NodeTerrainGrid from "../../../../src/node/terrain/NodeTerrainGrid";

const swedenAssets = [
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

const terrainGrids = swedenAssets.map((asset) => {
    return NodeTerrainGrid.fromAsset("../../../assets/sweden/" + asset);
});

const terrainTilesCollection = terrainGrids.map((terrainGrid) => {
    const terrainTiles = new TerrainTiles(terrainGrid);

    return terrainTiles;
});

const terrainCanvas = new TerrainCanvas(terrainTilesCollection, 10);

const dataUrl = terrainCanvas.canvas.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/geojson.png", dataBuffer);
