import { Direction } from "../../types/Direction";
import TerrainGrid from "../TerrainGrid";

export default class TerrainCanvas {
    public readonly element = document.createElement("canvas");

    private offset = {
        left: 50,
        top: 50
    };

    private mouseOffset = {
        left: 0,
        top: 0
    };

    constructor(private readonly grid: TerrainGrid, private readonly size: number) {
        this.element.addEventListener("mousedown", this.mousedown.bind(this));

        this.requestRender();
    };

    private lastMousePageOffset = {
        left: 0,
        top: 0
    }

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

        this.mouseOffset = {
            left: this.mouseOffset.left + difference.left,
            top: this.mouseOffset.top + difference.top
        };
    };

    private mouseupEvent = this.mouseup.bind(this);
    private mouseup() {
        this.element.removeEventListener("mousemove", this.mousemoveEvent);
        this.element.removeEventListener("mouseout", this.mouseupEvent);
        this.element.removeEventListener("mouseup", this.mouseupEvent);
    }

    private requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    };

    private setTransformation(context: CanvasRenderingContext2D, row: number, column: number, direction: Direction) {
        const halfSize = this.size / 2;

        const left = column * this.size;
        const top = row * this.size;

        context.translate(this.offset.left, this.offset.top);
        context.translate(left, top);
        context.translate(halfSize, halfSize);

        context.rotate((Math.PI / 180) * (Direction.South + direction));
    }

    private render() {
        const bounds = this.element.getBoundingClientRect();

        this.element.width = bounds.width;
        this.element.height = bounds.height;

        this.offset.left = this.mouseOffset.left + Math.floor(this.element.width / 2) - Math.floor((this.grid.columns * this.size) / 2);
        this.offset.top = this.mouseOffset.top + Math.floor(this.element.height / 2) - Math.floor((this.grid.rows * this.size) / 2);

        const context = this.element.getContext("2d")!;

        this.renderWater(context);
        this.renderGrid(context);

        this.renderTerrain(context);

        this.renderGrid(context);

        this.requestRender();
    };

    private renderWater(context: CanvasRenderingContext2D) {
        context.save();

        context.fillStyle = "#AADAFF";
        context.fillRect(0, 0, this.element.width, this.element.height);

        context.restore();
    };

    private renderGrid(context: CanvasRenderingContext2D) {
        context.save();

        context.fillStyle = "rgba(0, 0, 0, .05)";

        context.translate(this.offset.left, this.offset.top);

        const topStart = -this.offset.top + Math.floor((this.offset.top % this.size) - this.size);
        const topEnd = context.canvas.height;

        const leftStart = -this.offset.left + Math.floor((this.offset.left % this.size) - this.size);
        const leftEnd = context.canvas.width;

        for(let top = topStart; top < topEnd; top += this.size) {
            context.fillRect(leftStart, top - .5, context.canvas.width, 1);
        }

        for(let left = leftStart; left < leftEnd; left += this.size) {
            context.fillRect(left - .5, topStart, 1, context.canvas.height);
        }

        context.restore();
    };

    private renderTerrain(context: CanvasRenderingContext2D) {
        for(let row = 0; row < this.grid.rows; row++)
        for(let column = 0; column < this.grid.pattern[row].length; column++) {
            if(this.grid.pattern[row][column])
                this.renderSolid(context, row, column);
        }

        const innerEdgeCorners = this.grid.getInnerEdgeCorners();

        for(let item of innerEdgeCorners)
            this.renderRoundInnerEdgeCorner(context, item.row, item.column, item.direction);

        const outerEdges = this.grid.getOuterEdges();

        for(let item of outerEdges.items)
            this.renderFlatEdge(context, item.row, item.column, item.direction);

        for(let item of outerEdges.connectors)
            this.renderFlatEdgeConnector(context, item.row, item.column, item.direction);
        
        const outerEdgeCorners = this.grid.getOuterEdgeCorners();

        for(let item of outerEdgeCorners)
            this.renderRoundEdgeCorner(context, item.row, item.column, item.direction, item.angle);
    }

    private renderSolid(context: CanvasRenderingContext2D, row: number, column: number) {
        const left = column * this.size;
        const top = row * this.size;

        context.save();

        context.translate(this.offset.left, this.offset.top);

        context.fillStyle = "#C3ECB2";
        context.fillRect(left, top, this.size, this.size);

        context.restore();
    }

    private renderFlatEdge(context: CanvasRenderingContext2D, row: number, column: number, direction: Direction) {
        const edgeFraction = Math.floor(this.size * 0.2);

        const halfSize = this.size / 2;
        
        context.fillStyle = "#FFF2AF";

        if(direction % 90) {
            context.lineWidth = edgeFraction;

            context.save();
            this.setTransformation(context, row, column, direction - 45);
            context.translate(-halfSize, -halfSize);

            context.fillStyle = "#C3ECB2";
            context.moveTo(0, 0);
            context.lineTo(this.size, this.size);
            context.lineTo(this.size, 0);
            context.fill();

            context.restore();

            context.save();
            this.setTransformation(context, row, column, direction - 45);
            context.translate(-halfSize, -halfSize + (edgeFraction * .1));

            context.beginPath();

            context.strokeStyle = "#FFF2AF";
            context.moveTo(0, 0);
            context.lineTo(this.size, this.size);
            context.stroke();
            context.restore();
        }
        else {
            context.save();
            this.setTransformation(context, row, column, direction);

            context.fillRect(-halfSize + edgeFraction, -halfSize, this.size - (edgeFraction * 2), edgeFraction);
            context.restore();
        }
    }

    private renderFlatEdgeConnector(context: CanvasRenderingContext2D, row: number, column: number, direction: Direction) {
        const edgeFraction = Math.floor(this.size * 0.2);

        context.save();

        const halfSize = this.size / 2;
        
        this.setTransformation(context, row, column, direction);

        context.fillStyle = "#FFF2AF";
        context.fillRect(-halfSize - edgeFraction, -halfSize, (edgeFraction * 2), edgeFraction);

        context.restore();
    }

    private renderRoundEdgeCorner(context: CanvasRenderingContext2D, row: number, column: number, direction: Direction, angle: number) {
        const edgeFraction = Math.floor(this.size * 0.2);

        context.save();

        const halfSize = this.size / 2;
        
        this.setTransformation(context, row, column, direction - 45);

        context.strokeStyle = "#FFF2AF";
        context.lineWidth = edgeFraction;

        context.beginPath();

        context.translate(edgeFraction / 2, -edgeFraction);

        context.arc(edgeFraction * 3, -halfSize, edgeFraction * 1.5, (Math.PI / 180) * 90, (Math.PI / 180) * (90 + angle));
        context.stroke();

        context.restore();
    }

    private renderRoundInnerEdgeCorner(context: CanvasRenderingContext2D, row: number, column: number, direction: Direction) {
        const edgeFraction = Math.floor(this.size * 0.2);

        context.save();

        const halfSize = this.size / 2;
        
        this.setTransformation(context, row, column, direction - 180 - 45);
        context.translate(edgeFraction * 2.5, -edgeFraction);

        context.fillStyle = "#C3ECB2";
        context.fillRect(0, -halfSize, edgeFraction, edgeFraction);

        context.strokeStyle = "#FFF2AF";
        context.lineWidth = edgeFraction;

        context.beginPath();
        context.arc(edgeFraction, -halfSize, edgeFraction * .5, (Math.PI / 180) * 90, (Math.PI / 180) * 180);
        context.stroke();

        context.restore();
    }
};
