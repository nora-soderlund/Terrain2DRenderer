import { Point } from "../../../types/Point";
import GameCanvasInterface from "./GameCanvasInterface";
import { GameEntityPriority } from "./GameEntityPriority";

export default interface GameCanvasEntity {
    row: number;
    column: number;
    priority: GameEntityPriority;

    offset: Point;
    
    process?(gameCanvas: GameCanvasInterface): void;
    draw(gameCanvas: GameCanvasInterface, context: CanvasRenderingContext2D): void;
};
