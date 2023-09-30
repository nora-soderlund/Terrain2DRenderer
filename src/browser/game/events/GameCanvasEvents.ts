import { GameCanvasEventListener } from "../types/GameCanvasEventListener";

export default class GameCanvasEvents {
    private readonly listeners: GameCanvasEventListener[] = [];

    public emit(name: string, ...args: any[]) {
        this.listeners.filter((listener) => listener.name == name).forEach((listener) => {
            listener.callback(...args);
        });
    };

    public addListener(name: string, callback: (...args: any[]) => void) {
        this.listeners.push({
            name,
            callback
        });
    };
};
