import TerrainCanvasMouseEvents from "./events/GameCanvasMouseEvents";
import GameCanvasEntity from "./types/GameCanvasEntity";

export default class GameCanvas {
    public readonly element = document.createElement("canvas");
    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.element);

    public readonly offset = {
        left: 0,
        top: 0
    };

    constructor(private readonly canvasEntities: GameCanvasEntity[] = [], private readonly size: number) {
        this.requestRender();
    };

    public requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    };

    public render() {
        const bounds = this.element.getBoundingClientRect();

        this.element.width = bounds.width;
        this.element.height = bounds.height;

        this.offset.left = this.mouseEvents.offset.left;
        this.offset.top = this.mouseEvents.offset.top;

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.element.getContext("2d")!;

        const entities = this.canvasEntities.sort((a, b) => a.priority - b.priority);

        for(let canvasEntity of this.canvasEntities) {
            context.save();

            context.translate(this.offset.left, this.offset.top);
            context.translate(canvasEntity.column * this.size, canvasEntity.row * this.size);

            canvasEntity.draw(this, context);

            context.restore();
        }

        this.requestRender();
    };
};
