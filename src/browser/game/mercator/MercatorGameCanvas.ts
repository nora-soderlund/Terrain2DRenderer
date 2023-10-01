import MercatorGameCanvasEntity from "./types/MercatorGameCanvasEntity";
import GameCanvasMouseEvents from "../events/GameCanvasMouseEvents";
import GameCanvasInterface from "../types/GameCanvasInterface";
import MercatorProjection from "../../../adapters/mercator/MercatorProjection";
import { MercatorCoordinates } from "./types/MercatorCoordinates";
import { MercatorPixelCoordinates } from "./types/MercatorPixelCoordinates";
import GameCanvasEvents from "../events/GameCanvasEvents";
import { Point } from "../../../types/Point";
import GameCanvasPinchEvents from "../events/GameCanvasPinchEvents";
import MercatorGameTerrainEntity from "./entities/MercatorGameTerrainEntity";

export default class MercatorGameCanvas implements GameCanvasInterface {
    public readonly element = document.createElement("div");
    public readonly canvas = document.createElement("canvas");
    private readonly slider = document.createElement("input");

    public readonly events = new GameCanvasEvents();
    
    private readonly mouseEvents = new GameCanvasMouseEvents(this.canvas);
    private readonly pinchEvents = new GameCanvasPinchEvents(this);
    
    private readonly entities: MercatorGameCanvasEntity[] = [];

    private tileSize: number;
    private targetTileSize: number;

    public readonly offset = {
        left: 0,
        top: 0
    };

    public readonly worldCoordinatesOffset: MercatorPixelCoordinates = {
        left: 0,
        top: 0
    };

    constructor(public size: number, private readonly zoomLevel: number) {
        this.tileSize = this.targetTileSize = size;

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

        this.canvas.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });

        this.requestRender();
    };

    public setSize(size: number) {
        this.targetTileSize = size;
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
        if(this.targetTileSize !== this.tileSize) {
            const event = {
                previousTileSize: this.size,
                newTileSize: this.targetTileSize
            };

            const scale = this.targetTileSize / this.size;

            this.tileSize = this.size = this.targetTileSize;

            this.mouseEvents.offset.left *= scale;
            this.mouseEvents.offset.top *= scale;

            this.worldCoordinatesOffset.left *= scale;
            this.worldCoordinatesOffset.top *= scale;

            this.events.emit("TileSizeChanged", event);
        }

        this.offset.left = this.mouseEvents.offset.left + this.worldCoordinatesOffset.left;
        this.offset.top = this.mouseEvents.offset.top + this.worldCoordinatesOffset.top;
        
        for(let entity of this.entities) {
            entity.offset = this.getEntityOffset(entity);

            if(entity.process)
                entity.process(this);
        }

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

    private getEntityOffset(entity: MercatorGameCanvasEntity) {
        const offset: Point = {
            left: this.offset.left + (entity.column * this.size),
            top: this.offset.top + (entity.row * this.size)
        };

        if(entity.coordinates) {
            if(!entity.pixelCoordinates) {
                const worldCoordinates = MercatorProjection.getWorldCoordinates(this.zoomLevel, entity.coordinates);
                
                entity.pixelCoordinates = MercatorProjection.getPixelCoordinates(this.zoomLevel, worldCoordinates);
            }

            offset.left += entity.pixelCoordinates.left * this.size;
            offset.top += entity.pixelCoordinates.top * this.size;
        }
        
        return offset;
    };

    public render() {
        const bounds = this.element.getBoundingClientRect();

        this.canvas.width = bounds.width;
        this.canvas.height = bounds.height;

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.canvas.getContext("2d")!;

        for(let canvasEntity of this.entities) {
            context.save();

            try {
                if(canvasEntity.offset)
                    context.translate(canvasEntity.offset.left, canvasEntity.offset.top);
    
                canvasEntity.draw(this, context);
            }
            catch(error) {
                console.error("Failed to render entity: " + error);
            }

            context.restore();
        }

        this.requestRender();
    };
};
