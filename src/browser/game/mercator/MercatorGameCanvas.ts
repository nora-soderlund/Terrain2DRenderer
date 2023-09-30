import MercatorGameCanvasEntity from "./types/MercatorGameCanvasEntity";
import TerrainCanvasMouseEvents from "../events/GameCanvasMouseEvents";
import GameCanvasInterface from "../types/GameCanvasInterface";
import MercatorProjection from "../../../adapters/mercator/MercatorProjection";
import { MercatorCoordinates } from "./types/MercatorCoordinates";
import { MercatorPixelCoordinates } from "./types/MercatorPixelCoordinates";

export default class MercatorGameCanvas implements GameCanvasInterface {
    public readonly element = document.createElement("div");
    public readonly canvas = document.createElement("canvas");
    private readonly slider = document.createElement("input");

    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.canvas);
    private readonly entities: MercatorGameCanvasEntity[] = [];

    public readonly offset = {
        left: 0,
        top: 0
    };

    public readonly worldCoordinatesOffset: MercatorPixelCoordinates = {
        left: 0,
        top: 0
    };

    constructor(public size: number, private readonly zoomLevel: number) {
        this.element.classList.add("game");
        this.element.append(this.canvas);

        this.slider.classList.add("game-slider");
        this.slider.type = "range";
        this.slider.min = "1";
        this.slider.max = "100";
        this.slider.step = "0.1";
        this.slider.value = this.size.toString();
        this.slider.addEventListener("change", () => {
            const value = parseInt(this.slider.value);

            this.worldCoordinatesOffset.left *= value / this.size;
            this.worldCoordinatesOffset.top *= value / this.size;

            this.size = value;
        })

        this.element.append(this.slider);

        this.requestRender();
    };

    public setCoordinates(coordinates: MercatorCoordinates) {
        const worldCoordinates = MercatorProjection.getWorldCoordinates(this.zoomLevel, coordinates);
        const pixelCoordinates = MercatorProjection.getPixelCoordinates(this.zoomLevel, worldCoordinates);
        
        this.worldCoordinatesOffset.left = -pixelCoordinates.left * this.size;
        this.worldCoordinatesOffset.top = -pixelCoordinates.top * this.size;
    }

    public addEntities(entities: MercatorGameCanvasEntity[]) {
        this.entities.push(...entities);

        this.entities.sort((a, b) => a.priority - b.priority);
    }

    public requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    };

    public render() {
        const bounds = this.element.getBoundingClientRect();

        this.canvas.width = bounds.width;
        this.canvas.height = bounds.height;

        this.offset.left = this.mouseEvents.offset.left + this.worldCoordinatesOffset.left;
        this.offset.top = this.mouseEvents.offset.top + this.worldCoordinatesOffset.top;

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.canvas.getContext("2d")!;

        for(let canvasEntity of this.entities) {
            context.save();

            context.translate(this.offset.left, this.offset.top);
            context.translate(canvasEntity.column * this.size, canvasEntity.row * this.size);

            if(canvasEntity.coordinates) {
                if(!canvasEntity.pixelCoordinates) {
                    const worldCoordinates = MercatorProjection.getWorldCoordinates(this.zoomLevel, canvasEntity.coordinates);
                    
                    canvasEntity.pixelCoordinates = MercatorProjection.getPixelCoordinates(this.zoomLevel, worldCoordinates);
                }

                context.translate(canvasEntity.pixelCoordinates.left * this.size, canvasEntity.pixelCoordinates.top * this.size);
            }

            canvasEntity.draw(this, context);

            context.restore();
        }

        this.requestRender();
    };
};
