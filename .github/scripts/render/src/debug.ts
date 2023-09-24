import { writeFileSync } from "node:fs";
import TerrainDebugCanvas from "../../../../src/DebugCanvas";

const terrainCanvas = new TerrainDebugCanvas(100);

const dataUrl = terrainCanvas.element.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/debug.png", dataBuffer);
