import GameCanvas from "../GameCanvas";
import { GameEntityPriority } from "./GameEntityPriority";

export default interface GameCanvasEntity {
    row: number;
    column: number;
    priority: GameEntityPriority;
    
    draw(gameCanvas: GameCanvas, context: CanvasRenderingContext2D): void;
};
