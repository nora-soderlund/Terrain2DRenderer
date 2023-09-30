import MercatorGameCanvasEntity from "./types/MercatorGameCanvasEntity";
import TerrainCanvasMouseEvents from "../events/GameCanvasMouseEvents";
import GameCanvasInterface from "../types/GameCanvasInterface";
import MercatorProjection from "../../../adapters/mercator/MercatorProjection";
import { MercatorCoordinates } from "./types/MercatorCoordinates";
import { MercatorPixelCoordinates } from "./types/MercatorPixelCoordinates";
import GameCanvasEvents from "../events/GameCanvasEvents";
import { Point } from "../../../types/Point";

export default class MercatorGameCanvas implements GameCanvasInterface {
    public readonly element = document.createElement("div");
    public readonly canvas = document.createElement("canvas");
    private readonly slider = document.createElement("input");

    public readonly events = new GameCanvasEvents();
    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.canvas);
    private readonly entities: MercatorGameCanvasEntity[] = [];

    private tileSize: number;

    public readonly offset = {
        left: 0,
        top: 0
    };

    public readonly worldCoordinatesOffset: MercatorPixelCoordinates = {
        left: 0,
        top: 0
    };

    constructor(public size: number, private readonly zoomLevel: number) {
        this.tileSize = size;

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

            this.setSize(value);
        })

        this.element.append(this.slider);

        this.requestRender();
    };

    public setSize(size: number) {
        const event = {
            previousTileSize: this.size,
            newTileSize: size
        };

        this.tileSize = this.size = size;

        this.events.emit("TileSizeChanged", event);
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

    public isCoordinateInView(offset: Point, left: number, top: number, width: number, height: number) {
        if(offset.left + left + width < 0)
            return false;

        if(offset.left + left > this.canvas.width)
            return false;

        if(offset.top + top + height < 0)
            return false;

        if(offset.top + top > this.canvas.height)
            return false;

        return true;
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

            const offset: Point = {
                left: this.offset.left + (canvasEntity.column * this.size),
                top: this.offset.top + (canvasEntity.row * this.size)
            };

            if(canvasEntity.coordinates) {
                if(!canvasEntity.pixelCoordinates) {
                    const worldCoordinates = MercatorProjection.getWorldCoordinates(this.zoomLevel, canvasEntity.coordinates);
                    
                    canvasEntity.pixelCoordinates = MercatorProjection.getPixelCoordinates(this.zoomLevel, worldCoordinates);
                }

                offset.left += canvasEntity.pixelCoordinates.left * this.size;
                offset.top += canvasEntity.pixelCoordinates.top * this.size;
            }

            context.translate(offset.left, offset.top);

            canvasEntity.draw(this, context, offset);

            context.restore();
        }

        this.requestRender();
    };
};
