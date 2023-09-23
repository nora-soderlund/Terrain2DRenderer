import TerrainCanvasMouseEvents from "./events/GameCanvasMouseEvents";
import GameCanvasEntity from "./types/GameCanvasEntity";

export default class GameCanvas {
    public readonly element = document.createElement("canvas");
    private readonly mouseEvents = new TerrainCanvasMouseEvents(this.element);

    constructor(private readonly canvasEntities: GameCanvasEntity[] = []) {
        this.requestRender();
    };

    public requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    };

    public render() {
        const bounds = this.element.getBoundingClientRect();

        this.element.width = bounds.width;
        this.element.height = bounds.height;

        const offset = {
            left: this.mouseEvents.offset.left,
            top: this.mouseEvents.offset.top
        };

        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);

        const context = this.element.getContext("2d")!;

        for(let canvasEntity of this.canvasEntities) {
            context.save();

            canvasEntity.draw(context, offset);

            context.restore();
        }

        this.requestRender();
    };
};
