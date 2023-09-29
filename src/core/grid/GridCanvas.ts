import { createCanvas } from "canvas";
import GridRenderer from "./GridRenderer";

export default class GridCanvas {
    public readonly canvas = createCanvas(0, 0);

    constructor() {
    };

    public render(size: number, width: number, height: number) {
        const gridRenderer = new GridRenderer(size);

        width = Math.ceil(width / size) * size;
        height = Math.ceil(height / size) * size;

        if(this.canvas.width === width && this.canvas.height === height) {
            return;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        const context = this.canvas.getContext("2d")!;

        gridRenderer.draw(context);
    };
};
