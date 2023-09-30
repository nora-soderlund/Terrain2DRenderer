import GameCanvasEntity from "./GameCanvasEntity";

export default interface GameCanvasInterface {
    element: HTMLDivElement;
    canvas: HTMLCanvasElement;
    
    addEntities(entities: GameCanvasEntity[]): void;
    requestRender(): void;
    render(): void;
};
