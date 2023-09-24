import { CanvasRenderingContext2D } from "canvas";
import TerrainCanvas from "../../../core/terrain/TerrainCanvas";
import { Point } from "../../../types/Point";
import GameCanvasEntity from "../types/GameCanvasEntity";

export default class GameTerrainEntity implements GameCanvasEntity {
    constructor(private readonly terrainCanvas: TerrainCanvas) {
        
    }

    public draw(context: CanvasRenderingContext2D, offset: Point): void {
        context.drawImage(this.terrainCanvas.canvas,
            0, 0, this.terrainCanvas.canvas.width, this.terrainCanvas.canvas.height,
            offset.left, offset.top, this.terrainCanvas.canvas.width, this.terrainCanvas.canvas.height);
    };
}