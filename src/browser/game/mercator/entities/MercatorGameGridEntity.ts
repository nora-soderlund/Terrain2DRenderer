import GridCanvas from "../../../../core/grid/GridCanvas";
import GameGridEntity from "../../entities/GameGridEntity";
import { GameEntityPriority } from "../../types/GameEntityPriority";
import MercatorGameCanvas from "../MercatorGameCanvas";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";
import { MercatorPixelCoordinates } from "../types/MercatorPixelCoordinates";

export default class MercatorGameGridEntity implements MercatorGameCanvasEntity {
    public readonly row = 0;
    public readonly column = 0;
    public readonly priority = GameEntityPriority.Water;

    coordinates = null;
    pixelCoordinates: MercatorPixelCoordinates | null = null;

    constructor(private readonly gridCanvas: GridCanvas) {
        
    }

    public draw(gameCanvas: MercatorGameCanvas, context: CanvasRenderingContext2D): void {
        context.translate(-gameCanvas.offset.left, -gameCanvas.offset.top);
        
        this.gridCanvas.render(gameCanvas.size, context.canvas.width, context.canvas.height);

        const left = (gameCanvas.offset.left % gameCanvas.size) - gameCanvas.size;
        const top = (gameCanvas.offset.top % gameCanvas.size) - gameCanvas.size;

        context.translate(left, top);

        context.drawImage(this.gridCanvas.canvas as any, 0, 0);
    };
};
