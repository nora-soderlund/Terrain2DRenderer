import { Direction } from "../types/Direction";
import { Point } from "../types/Point";

export default class TerrainRenderer {
    private readonly halfSize: number;

    private readonly edgeSize: number;
    private readonly halfEdgeSize: number;
    

    private readonly terrainColor = "#C3ECB2";
    private readonly edgeColor = "#FFF2AF";

    private readonly debug = true;
    private readonly debugArrowSize: number;
    private readonly debugColor = "black";

    constructor(private readonly context: CanvasRenderingContext2D, private readonly size: number, private readonly offset: Point) {
        this.halfSize = this.size / 2;

        this.edgeSize = this.size * 0.2;
        this.halfEdgeSize = this.edgeSize / 2;

        this.debugArrowSize = this.size * 0.05;
    };

    private getAngle(degrees: number) {
        return (Math.PI / 180) * degrees;
    }

    private setTransformation(row: number, column: number, direction: number) {
        const left = column * this.size;
        const top = row * this.size;

        this.context.translate(this.offset.left, this.offset.top);
        this.context.translate(left, top);
        this.context.translate(this.halfSize, this.halfSize);

        this.context.rotate((Math.PI / 180) * (Direction.South + direction));
    }

    private drawDebugTile(row: number, column: number, direction: Direction) {
        if(this.debug) {
            this.context.save();
    
            this.setTransformation(row, column, direction);

            this.context.strokeStyle = this.debugColor;

            this.context.beginPath();

            this.context.translate(0, this.halfSize - this.edgeSize);

            this.context.moveTo(-this.debugArrowSize, 0);
            this.context.lineTo(0, this.debugArrowSize);
            this.context.lineTo(this.debugArrowSize, 0);
            this.context.stroke();

            this.context.restore();

            this.context.save();

            this.context.fillStyle = this.debugColor;

            this.setTransformation(row, column, Direction.South);

            this.context.textAlign = "center";

            this.context.textBaseline = "bottom";
            this.context.fillText(`Row ${row}`, 0, 0);
            
            this.context.textBaseline = "hanging";
            this.context.fillText(`Column ${column}`, 0, 0);

            this.context.restore();
        }
    };

    public drawFlatTile(row: number, column: number, direction: Direction) {
        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.terrainColor;
        this.context.fillRect(-this.halfSize, -this.halfSize, this.size, this.size);

        this.context.restore();

        this.drawDebugTile(row, column, direction);
    }

    public drawFlatTileWithFlatEdge(row: number, column: number, direction: Direction) {
        this.drawFlatTile(row, column, direction);

        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize, this.halfSize, this.size, this.edgeSize);

        this.context.restore();
    }

    public drawFlatTileWithRightInsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawFlatTile(row, column, direction);

        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize + this.edgeSize, this.halfSize, this.size - this.edgeSize, this.edgeSize);

        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(90), this.getAngle(90 + 45));
        this.context.stroke();

        this.context.restore();
    }

    private drawLeftOutsideCornerEdge() {
        this.context.beginPath();
        this.context.fillStyle = this.terrainColor;
        this.context.moveTo(this.halfSize, this.halfSize);
        this.context.lineTo(this.halfSize - (this.halfEdgeSize * 1.5), this.halfSize + (this.halfEdgeSize * 1.5));
        this.context.lineTo(this.halfSize - (this.halfEdgeSize * 4), this.halfSize);
        this.context.fill();

        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(this.halfSize - (this.edgeSize * 2), this.halfSize + (this.edgeSize * 2), this.edgeSize * 1.5, this.getAngle(-90), this.getAngle(-45));
        this.context.stroke();
    }

    private drawRightOutsideCornerEdge() {
        this.context.beginPath();
        this.context.fillStyle = this.terrainColor;
        this.context.moveTo(-this.halfSize + (this.halfEdgeSize * 4), this.halfSize);
        this.context.lineTo(-this.halfSize + (this.halfEdgeSize * 2), this.halfSize + this.edgeSize);
        this.context.lineTo(-this.halfSize, this.halfSize);
        this.context.fill();

        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + (this.edgeSize * 2), this.halfSize + (this.edgeSize * 2), this.edgeSize * 1.5, this.getAngle(180 + 45), this.getAngle(270));
        this.context.stroke();
    }

    public drawFlatTileWithLeftOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawFlatTile(row, column, direction);

        this.context.save();

        this.setTransformation(row, column, direction);
        this.drawLeftOutsideCornerEdge();

        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize, this.halfSize, this.size - (this.edgeSize * 2), this.edgeSize);

        this.context.restore();
    }

    public drawFlatTileWithRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawFlatTile(row, column, direction);

        this.context.save();

        this.setTransformation(row, column, direction);
        this.drawRightOutsideCornerEdge();

        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize + (this.edgeSize * 2), this.halfSize, this.size - (this.edgeSize * 2), this.edgeSize);

        this.context.restore();
    }

    public drawFlatTileWithOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawFlatTile(row, column, direction);

        this.context.save();

        this.setTransformation(row, column, direction);
        this.drawLeftOutsideCornerEdge();
        this.drawRightOutsideCornerEdge();

        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize + (this.edgeSize * 2), this.halfSize, this.size - (this.edgeSize * 4), this.edgeSize);

        this.context.restore();
    }

    private drawSlopedTile(row: number, column: number, direction: Direction) {
        this.context.save();

        this.setTransformation(row, column, direction);
        
        this.context.fillStyle = this.terrainColor;

        this.context.beginPath();
        this.context.moveTo(-this.halfSize, -this.halfSize);
        this.context.lineTo(this.halfSize, this.halfSize);
        this.context.lineTo(this.halfSize, -this.halfSize);

        this.context.fill();

        this.context.restore();

        this.drawDebugTile(row, column, direction);
    }

    public drawSlopedTileWithFlatEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedTile(row, column, direction - 45);

        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;

        this.context.fillRect(-this.halfSize * 1.5, -this.halfEdgeSize + 1.5, this.size * 1.5, this.edgeSize);

        this.context.restore();
    }

    private drawSlopedLeftOutsideCorner(row: number, column: number, direction: Direction) {
        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.rotate(this.getAngle(180));

        this.context.translate(-this.edgeSize * 1 + 4, -this.edgeSize * 3 -2);

        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(45 + 45), this.getAngle((45 + 45) + 45));
        this.context.stroke();

        this.context.restore();
    };

    private drawSlopedRightOutsideCorner(row: number, column: number, direction: Direction) {
        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.translate(-this.edgeSize + 1, 3)

        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(180 + 45), this.getAngle((180 + 45) + 45));
        this.context.stroke();

        this.context.restore();
    };

    public drawSlopedTileWithOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedTile(row, column, direction - 45);

        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;

        this.context.fillRect(-(this.halfSize * 1.5) + this.edgeSize, -this.halfEdgeSize + (this.halfEdgeSize * .2), (this.size * 1.5) - (this.edgeSize * 2) - 4, this.edgeSize);

        this.context.restore();

        this.drawSlopedLeftOutsideCorner(row, column, direction);
        this.drawSlopedRightOutsideCorner(row, column, direction);
    }

    public drawSlopedTileWithRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedTile(row, column, direction - 45);

        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;

        this.context.fillRect(-(this.halfSize * 1.5) + this.edgeSize, -this.halfEdgeSize + (this.halfEdgeSize * .2), (this.size * 1.5) - this.edgeSize - 4, this.edgeSize);

        this.context.restore();

        this.drawSlopedRightOutsideCorner(row, column, direction);
    }

    public drawSlopedTileWithLeftOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedTile(row, column, direction - 45);

        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;

        this.context.fillRect(-(this.halfSize * 1.5), -this.halfEdgeSize + (this.halfEdgeSize * .2), (this.size * 1.5) - this.edgeSize - 4, this.edgeSize);

        this.context.restore();

        this.drawSlopedLeftOutsideCorner(row, column, direction);
    }
}