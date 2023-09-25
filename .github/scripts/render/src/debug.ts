import { writeFileSync } from "node:fs";
import TerrainDebugCanvas from "../../../../src/DebugCanvas";
import WaterRenderer from "../../../../src/core/water/WaterRenderer";
import GridCanvas from "../../../../src/core/grid/GridCanvas";
import { createCanvas } from "canvas";

const debugCanvas = createCanvas(0, 0);

TerrainDebugCanvas.render(debugCanvas.getContext("2d"), 100);

const waterRenderer = new WaterRenderer();
const gridCanvas = new GridCanvas(10);

gridCanvas.render(debugCanvas.width, debugCanvas.height);

const canvas = createCanvas(debugCanvas.width, debugCanvas.height);
const context = canvas.getContext("2d");

waterRenderer.draw(context);
context.drawImage(gridCanvas.canvas, 0, 0);
context.drawImage(debugCanvas, 0, 0);

const dataUrl = canvas.toDataURL("image/png");
const dataUrlBytes = dataUrl.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(dataUrlBytes, "base64");

writeFileSync("../../previews/debug.png", dataBuffer);
