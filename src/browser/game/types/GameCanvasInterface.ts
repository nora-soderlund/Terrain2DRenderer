import GameCanvasEntity from "./GameCanvasEntity";

export default interface GameCanvasInterface {
    element: HTMLCanvasElement;
    
    addEntities(entities: GameCanvasEntity[]): void;
    requestRender(): void;
    render(): void;
};
