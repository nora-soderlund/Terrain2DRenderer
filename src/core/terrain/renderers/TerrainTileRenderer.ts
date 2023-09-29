import { CanvasRenderingContext2D } from "canvas";
import { Direction } from "../../../types/Direction";
import { Point } from "../../../types/Point";
import { Side } from "../../../types/Side";
import { TerrainTileType } from "../types/TerrainTileType";
import { Canvas2DContext } from "../../../types/Canvas2DContext";

export default class TerrainTileRenderer {
    private readonly halfSize: number;

    private readonly edgeSize: number;
    private readonly halfEdgeSize: number;

    private readonly terrainColor = "#C3ECB2";
    private readonly edgeColor = "#FFF2AF";

    private readonly debugArrowSize: number;
    private readonly debugColor = "black";

    constructor(public readonly size: number, private readonly debug: boolean = false) {
        this.halfSize = this.size / 2;

        this.edgeSize = this.size * 0.2;
        this.halfEdgeSize = this.edgeSize / 2;

        this.debugArrowSize = this.size * 0.05;

        /*
        this.terrainTileOptions.terrainColor ??= "#C3ECB2";
        this.terrainTileOptions.edgeColor ??= "#FFF2AF";*/
    };

    private getAngle(degrees: number) {
        return (Math.PI / 180) * degrees;
    }

    private setTransformation(context: Canvas2DContext, row: number, column: number) {
        const left = column * this.size;
        const top = row * this.size;

        context.translate(left, top);
        context.translate(this.halfSize, this.halfSize);
    }

    private drawDebugTile(context: Canvas2DContext, row: number, column: number) {
        if(this.debug) {
            context.save();

            context.fillStyle = this.debugColor;

            this.setTransformation(context, row, column);

            context.textAlign = "center";

            context.textBaseline = "bottom";
            context.fillText(`Row ${row}`, 0, 0);
            
            context.textBaseline = "hanging";
            context.fillText(`Column ${column}`, 0, 0);

            context.restore();
        }
    };

    public drawDebugArrow(context: Canvas2DContext, row: number, column: number) {
        if(this.debug) {
            context.save();
    
            this.setTransformation(context, row, column);

            context.strokeStyle = this.debugColor;

            context.beginPath();

            context.translate(0, this.halfSize - this.edgeSize);

            context.moveTo(-this.debugArrowSize, 0);
            context.lineTo(0, this.debugArrowSize);
            context.lineTo(this.debugArrowSize, 0);
            context.stroke();

            context.restore();
        }
    };

    public drawFlatTile(context: Canvas2DContext, row: number, column: number) {
        context.save();

        this.setTransformation(context, row, column);

        context.fillStyle = this.terrainColor;
        context.fillRect(-this.halfSize, -this.halfSize, this.size, this.size);

        context.restore();

        this.drawDebugTile(context, row, column);
    }

    private drawFlatEdge(context: Canvas2DContext, row: number, column: number, side: Side, gap: number = 0) {
        context.save();

        this.setTransformation(context, row, column);

        context.fillStyle = this.edgeColor;

        if(side === Side.Left)
            context.fillRect(0, this.halfSize, this.halfSize - gap, this.edgeSize);
        else if(side === Side.Right)
            context.fillRect(-this.halfSize + gap, this.halfSize, this.halfSize - gap, this.edgeSize);

        context.restore();
    }

    public drawFlatTileWithLeftFlatEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawFlatEdge(context, row, column, Side.Left);
    }

    public drawFlatTileWithRightFlatEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawFlatEdge(context, row, column, Side.Right);
    }

    private drawLeftInsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        context.save();

        this.setTransformation(context, row, column);

        context.beginPath();
        context.strokeStyle = this.edgeColor;
        context.lineWidth = this.edgeSize;
        context.arc(this.halfSize - this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(45), this.getAngle(45 + 45));
        context.stroke();

        context.restore();
    }

    private drawRightInsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        context.save();

        this.setTransformation(context, row, column);

        context.beginPath();
        context.strokeStyle = this.edgeColor;
        context.lineWidth = this.edgeSize;
        context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(90), this.getAngle(90 + 45));
        context.stroke();

        context.restore();
    }

    public drawFlatTileWithLeftInsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawFlatEdge(context, row, column, Side.Left, this.edgeSize);

        this.drawLeftInsideCornerEdge(context, row, column);
    }

    public drawFlatTileWithRightInsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawFlatEdge(context, row, column, Side.Right, this.edgeSize);

        this.drawRightInsideCornerEdge(context, row, column);
    }

    private drawLeftOutsideCornerEdge(context: Canvas2DContext) {
        context.beginPath();
        context.fillStyle = this.terrainColor;
        context.moveTo(this.halfSize, this.halfSize);
        context.lineTo(this.halfSize - (this.halfEdgeSize * 1.5), this.halfSize + (this.halfEdgeSize * 1.5));
        context.lineTo(this.halfSize - (this.halfEdgeSize * 4), this.halfSize);
        context.fill();

        context.beginPath();
        context.strokeStyle = this.edgeColor;
        context.lineWidth = this.edgeSize;
        context.arc(this.halfSize - (this.edgeSize * 2), this.halfSize + (this.edgeSize * 2), this.edgeSize * 1.5, this.getAngle(-90), this.getAngle(-45));
        context.stroke();
    }

    private drawRightOutsideCornerEdge(context: Canvas2DContext) {
        context.beginPath();
        context.fillStyle = this.terrainColor;
        context.moveTo(-this.halfSize + (this.halfEdgeSize * 4), this.halfSize);
        context.lineTo(-this.halfSize + (this.halfEdgeSize * 2), this.halfSize + this.edgeSize);
        context.lineTo(-this.halfSize, this.halfSize);
        context.fill();

        context.beginPath();
        context.strokeStyle = this.edgeColor;
        context.lineWidth = this.edgeSize;
        context.arc(-this.halfSize + (this.edgeSize * 2), this.halfSize + (this.edgeSize * 2), this.edgeSize * 1.5, this.getAngle(180 + 45), this.getAngle(270));
        context.stroke();
    }

    public drawFlatTileWithLeftOutsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        context.save();
        this.setTransformation(context, row, column);
        this.drawLeftOutsideCornerEdge(context);
        context.restore();

        this.drawFlatEdge(context, row, column, Side.Left, this.edgeSize * 2);
    }

    public drawFlatTileWithRightOutsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        context.save();
        this.setTransformation(context, row, column);
        this.drawRightOutsideCornerEdge(context);
        context.restore();

        this.drawFlatEdge(context, row, column, Side.Right, this.edgeSize * 2);
    }

    public drawSlopedTile(context: Canvas2DContext, row: number, column: number) {
        context.save();

        this.setTransformation(context, row, column);
        
        context.fillStyle = this.terrainColor;

        context.beginPath();
        context.moveTo(-this.halfSize, -this.halfSize);
        context.lineTo(this.halfSize, this.halfSize);
        context.lineTo(this.halfSize, -this.halfSize);

        context.fill();

        context.restore();

        this.drawDebugTile(context, row, column);
    }

    private drawSlopedEdge(context: Canvas2DContext, row: number, column: number, side: Side, gap: number = 0) {
        context.save();

        this.setTransformation(context, row, column);

        context.fillStyle = this.edgeColor;

        if(side === Side.Left)
            context.fillRect(0, -this.halfEdgeSize + 1.5, this.size * .75 - gap, this.edgeSize);
        else if(side === Side.Right)
            context.fillRect(-this.halfSize * 1.5 + (gap * 1), -this.halfEdgeSize + 1.5, this.size * .75 - gap, this.edgeSize);

        context.restore();
    }

    public drawSlopedTileWithLeftFlatEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawSlopedEdge(context, row, column, Side.Left);
    }

    public drawSlopedTileWithRightFlatEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawSlopedEdge(context, row, column, Side.Right);
    }

    private drawSlopedLeftOutsideCorner(context: Canvas2DContext, row: number, column: number) {
        context.save();

        this.setTransformation(context, row, column);

        context.rotate(this.getAngle(180));

        context.translate(-this.edgeSize * 1 + 4, -this.edgeSize * 3 -2);

        context.beginPath();
        context.strokeStyle = this.edgeColor;
        context.lineWidth = this.edgeSize;
        context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(45 + 45), this.getAngle((45 + 45) + 45));
        context.stroke();

        context.restore();
    };

    private drawSlopedRightOutsideCorner(context: Canvas2DContext, row: number, column: number) {
        context.save();

        this.setTransformation(context, row, column);

        context.translate(-this.edgeSize + 1, 3)

        context.beginPath();
        context.strokeStyle = this.edgeColor;
        context.lineWidth = this.edgeSize;
        context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(180 + 45), this.getAngle((180 + 45) + 45));
        context.stroke();

        context.restore();
    };

    public drawSlopedTileWithRightOutsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawSlopedEdge(context, row, column, Side.Right, this.edgeSize);
        this.drawSlopedRightOutsideCorner(context, row, column);
    }

    public drawSlopedTileWithLeftOutsideCornerEdge(context: Canvas2DContext, row: number, column: number) {
        this.drawSlopedEdge(context, row, column, Side.Left, this.edgeSize)
        this.drawSlopedLeftOutsideCorner(context, row, column);
    }
}
