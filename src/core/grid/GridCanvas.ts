import { createCanvas } from "canvas";
import GridRenderer from "./GridRenderer";

export default class GridCanvas {
    public readonly canvas = createCanvas(0, 0);
    private readonly gridRenderer: GridRenderer;

    constructor(public readonly size: number, private readonly debug: boolean = false) {
        this.gridRenderer = new GridRenderer(this.size);
    };

    public render(width: number, height: number) {
        width = Math.ceil(width / this.size) * this.size;
        height = Math.ceil(height / this.size) * this.size;

        if(this.canvas.width === width && this.canvas.height === height) {
            console.debug("GridCanvas is already rendered with the input size, skipping...");

            return;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        const context = this.canvas.getContext("2d")!;

        this.gridRenderer.draw(context);
    };
};
