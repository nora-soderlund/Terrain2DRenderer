import GameCanvas from "../GameCanvas";
import MercatorGameCanvas from "../mercator/MercatorGameCanvas";

export default class GameCanvasPinchEvents {
    private readonly handleWheelBind = this.handleWheel.bind(this);

    constructor(private readonly gameCanvas: MercatorGameCanvas) {
        this.gameCanvas.canvas.addEventListener("wheel", this.handleWheelBind);
    };

    private handleWheel(event: WheelEvent) {
        if(event.ctrlKey) {
            const delta = Math.min(10, Math.max(-10, (event.deltaY * 0.1)));

            this.gameCanvas.setSize(this.gameCanvas.size - delta);
        }
    };
};
