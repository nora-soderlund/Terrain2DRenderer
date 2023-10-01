import TerrainCanvasMouseEvents from "./events/GameCanvasMouseEvents";
import GameCanvasEntity from "./types/GameCanvasEntity";
import GameCanvasInterface from "./types/GameCanvasInterface";

export default class GameCanvas implements GameCanvasInterface {
    public readonly element = document.createElement("div");
    public readonly canvas = document.createElement("canvas");

    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.canvas);
    private readonly entities: GameCanvasEntity[] = [];

    public readonly offset = {
        left: 0,
        top: 0
    };

    constructor(entities: GameCanvasEntity[], public readonly size: number) {
        this.element.classList.add("game");
        this.element.append(this.canvas);

        this.addEntities(entities);
        
        this.requestRender();
    };

    public addEntities(entities: GameCanvasEntity[]): void {
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

        this.offset.left = this.mouseEvents.offset.left;
        this.offset.top = this.mouseEvents.offset.top;

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.canvas.getContext("2d");

        if(!context)
            return this.requestRender();

        for(let canvasEntity of this.entities) {
            context.save();

            context.translate(this.offset.left, this.offset.top);
            context.translate(canvasEntity.column * this.size, canvasEntity.row * this.size);

            canvasEntity.draw(this, context);

            context.restore();
        }

        this.requestRender();
    };
};
