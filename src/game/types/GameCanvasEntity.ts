import { Point } from "../../types/Point";

export default interface GameCanvasEntity {
    draw(context: CanvasRenderingContext2D, offset: Point): void;
};
