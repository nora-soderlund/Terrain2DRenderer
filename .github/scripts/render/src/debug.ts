import { writeFileSync } from "node:fs";
import TerrainDebugCanvas from "../../../../src/DebugCanvas";
import { createCanvas } from "canvas";

const canvas = createCanvas(0, 0);

TerrainDebugCanvas.render(canvas.getContext("2d"), 100);

const dataUrl = canvas.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/debug.png", dataBuffer);
