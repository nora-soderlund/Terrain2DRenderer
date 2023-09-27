export default interface GameCanvasInterface {
    element: HTMLCanvasElement;
    
    requestRender(): void;
    render(): void;
};
