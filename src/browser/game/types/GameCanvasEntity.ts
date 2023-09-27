import GameCanvasInterface from "./GameCanvasInterface";
import { GameEntityPriority } from "./GameEntityPriority";

export default interface GameCanvasEntity {
    row: number;
    column: number;
    priority: GameEntityPriority;
    
    draw(gameCanvas: GameCanvasInterface, context: CanvasRenderingContext2D): void;
};
