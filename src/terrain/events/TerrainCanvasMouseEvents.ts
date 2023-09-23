import { Point } from "../../types/Point";

export default class TerrainCanvasMouseEvents {
    constructor(private readonly element: HTMLCanvasElement) {
        this.element.addEventListener("mousedown", this.mousedown.bind(this));
    }

    public offset: Point = {
        left: 0,
        top: 0
    };

    private lastMousePageOffset: Point = {
        left: 0,
        top: 0
    };

    private mousedown(event: MouseEvent) {
        this.lastMousePageOffset = {
            left: event.pageX,
            top: event.pageY
        };

        this.element.addEventListener("mousemove", this.mousemoveEvent);
        this.element.addEventListener("mouseout", this.mouseupEvent);
        this.element.addEventListener("mouseup", this.mouseupEvent);
    }

    private mousemoveEvent = this.mousemove.bind(this);
    private mousemove(event: MouseEvent) {
        const difference = {
            left: event.pageX - this.lastMousePageOffset.left,
            top: event.pageY - this.lastMousePageOffset.top
        };

        this.lastMousePageOffset = {
            left: event.pageX,
            top: event.pageY
        };

        this.offset = {
            left: this.offset.left + difference.left,
            top: this.offset.top + difference.top
        };
    };

    private mouseupEvent = this.mouseup.bind(this);
    private mouseup() {
        this.element.removeEventListener("mousemove", this.mousemoveEvent);
        this.element.removeEventListener("mouseout", this.mouseupEvent);
        this.element.removeEventListener("mouseup", this.mouseupEvent);
    }
};
