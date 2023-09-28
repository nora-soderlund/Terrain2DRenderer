import MercatorGameCanvasEntity from "./types/MercatorGameCanvasEntity";
import TerrainCanvasMouseEvents from "../events/GameCanvasMouseEvents";
import GameCanvasInterface from "../types/GameCanvasInterface";
import MercatorProjection from "../../../adapters/mercator/MercatorProjection";
import { MercatorCoordinates } from "./types/MercatorCoordinates";
import { MercatorPixelCoordinates } from "./types/MercatorPixelCoordinates";

export default class MercatorGameCanvas implements GameCanvasInterface {
    public readonly element = document.createElement("canvas");
    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.element);
    private readonly entities: MercatorGameCanvasEntity[] = [];

    public readonly offset = {
        left: 0,
        top: 0
    };

    public readonly worldCoordinatesOffset: MercatorPixelCoordinates = {
        left: 0,
        top: 0
    };

    constructor(entities: MercatorGameCanvasEntity[] = [], private readonly size: number, private readonly zoomLevel: number) {
        if(entities.length)
            this.addEntities(entities);

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

        this.element.width = bounds.width;
        this.element.height = bounds.height;

        this.offset.left = this.mouseEvents.offset.left + this.worldCoordinatesOffset.left;
        this.offset.top = this.mouseEvents.offset.top + this.worldCoordinatesOffset.top;

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.element.getContext("2d")!;

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
