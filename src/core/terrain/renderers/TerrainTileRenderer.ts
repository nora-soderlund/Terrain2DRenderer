import { CanvasRenderingContext2D } from "canvas";
import { Direction } from "../../../types/Direction";
import { Point } from "../../../types/Point";
import { Side } from "../../../types/Side";
import { TerrainTileType } from "../types/TerrainTileType";

export default class TerrainTileRenderer {
    private readonly halfSize: number;

    private readonly edgeSize: number;
    private readonly halfEdgeSize: number;
    

    private readonly terrainColor = "#C3ECB2";
    private readonly edgeColor = "#FFF2AF";

    private readonly debugArrowSize: number;
    private readonly debugColor = "black";

    constructor(private readonly context: CanvasRenderingContext2D, private readonly size: number, private readonly offset: Point, private readonly debug: boolean = false) {
        this.halfSize = this.size / 2;

        this.edgeSize = this.size * 0.2;
        this.halfEdgeSize = this.edgeSize / 2;

        this.debugArrowSize = this.size * 0.05;
    };

    public draw(type: TerrainTileType, row: number, column: number, direction: Direction) {
        switch(type) {
            case TerrainTileType.FlatTile: {
                this.drawFlatTile(row, column, direction);

                break;
            }

            case TerrainTileType.FlatTileWithLeftFlatEdge: {
                this.drawFlatTileWithLeftFlatEdge(row, column, direction);

                break;
            }

            case TerrainTileType.FlatTileWithRightFlatEdge: {
                this.drawFlatTileWithRightFlatEdge(row, column, direction);

                break;
            }

            case TerrainTileType.FlatTileWithLeftInsideCornerEdge: {
                this.drawFlatTileWithLeftInsideCornerEdge(row, column, direction);

                break;
            }

            case TerrainTileType.FlatTileWithRightInsideCornerEdge: {
                this.drawFlatTileWithRightInsideCornerEdge(row, column, direction);

                break;
            }

            case TerrainTileType.FlatTileWithLeftOutsideCornerEdge: {
                this.drawFlatTileWithLeftOutsideCornerEdge(row, column, direction);

                break;
            }

            case TerrainTileType.FlatTileWithRightOutsideCornerEdge: {
                this.drawFlatTileWithRightOutsideCornerEdge(row, column, direction);

                break;
            }
            
            case TerrainTileType.SlopedTile: {
                this.drawSlopedTile(row, column, direction);

                break;
            }
            
            case TerrainTileType.SlopedTileWithLeftFlatEdge: {
                this.drawSlopedTileWithLeftFlatEdge(row, column, direction);

                break;
            }
            
            case TerrainTileType.SlopedTileWithRightFlatEdge: {
                this.drawSlopedTileWithRightFlatEdge(row, column, direction);

                break;
            }
            
            case TerrainTileType.SlopedTileWithRightOutsideCornerEdge: {
                this.drawSlopedTileWithRightOutsideCornerEdge(row, column, direction);

                break;
            }
            
            case TerrainTileType.SlopedTileWithLeftOutsideCornerEdge: {
                this.drawSlopedTileWithLeftOutsideCornerEdge(row, column, direction);

                break;
            }
        }
    }

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

    public drawDebugArrow(row: number, column: number, direction: Direction) {
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

    private drawFlatEdge(row: number, column: number, direction: Direction, side: Side, gap: number = 0) {
        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;

        if(side === Side.Left)
            this.context.fillRect(0, this.halfSize, this.halfSize - gap, this.edgeSize);
        else if(side === Side.Right)
            this.context.fillRect(-this.halfSize + gap, this.halfSize, this.halfSize - gap, this.edgeSize);

        this.context.restore();
    }

    public drawFlatTileWithLeftFlatEdge(row: number, column: number, direction: Direction) {
        this.drawFlatEdge(row, column, direction, Side.Left);
    }

    public drawFlatTileWithRightFlatEdge(row: number, column: number, direction: Direction) {
        this.drawFlatEdge(row, column, direction, Side.Right);
    }

    private drawLeftInsideCornerEdge(row: number, column: number, direction: Direction) {
        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(this.halfSize - this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(45), this.getAngle(45 + 45));
        this.context.stroke();

        this.context.restore();
    }

    private drawRightInsideCornerEdge(row: number, column: number, direction: Direction) {
        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(90), this.getAngle(90 + 45));
        this.context.stroke();

        this.context.restore();
    }

    public drawFlatTileWithLeftInsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawFlatEdge(row, column, direction, Side.Left, this.edgeSize);

        this.drawLeftInsideCornerEdge(row, column, direction);
    }

    public drawFlatTileWithRightInsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawFlatEdge(row, column, direction, Side.Right, this.edgeSize);

        this.drawRightInsideCornerEdge(row, column, direction);
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
        this.context.save();
        this.setTransformation(row, column, direction);
        this.drawLeftOutsideCornerEdge();
        this.context.restore();

        this.drawFlatEdge(row, column, direction, Side.Left, this.edgeSize * 2);
    }

    public drawFlatTileWithRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.drawRightOutsideCornerEdge();
        this.context.restore();

        this.drawFlatEdge(row, column, direction, Side.Right, this.edgeSize * 2);
    }

    public drawSlopedTile(row: number, column: number, direction: Direction) {
        this.context.save();

        this.setTransformation(row, column, direction - 45);
        
        this.context.fillStyle = this.terrainColor;

        this.context.beginPath();
        this.context.moveTo(-this.halfSize, -this.halfSize);
        this.context.lineTo(this.halfSize, this.halfSize);
        this.context.lineTo(this.halfSize, -this.halfSize);

        this.context.fill();

        this.context.restore();

        this.drawDebugTile(row, column, direction - 45);
    }

    private drawSlopedEdge(row: number, column: number, direction: Direction, side: Side, gap: number = 0) {
        this.context.save();

        this.setTransformation(row, column, direction);

        this.context.fillStyle = this.edgeColor;

        if(side === Side.Left)
            this.context.fillRect(0, -this.halfEdgeSize + 1.5, this.size * .75 - gap, this.edgeSize);
        else if(side === Side.Right)
            this.context.fillRect(-this.halfSize * 1.5 + (gap * 1), -this.halfEdgeSize + 1.5, this.size * .75 - gap, this.edgeSize);

        this.context.restore();
    }

    public drawSlopedTileWithLeftFlatEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedEdge(row, column, direction, Side.Left);
    }

    public drawSlopedTileWithRightFlatEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedEdge(row, column, direction, Side.Right);
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

    public drawSlopedTileWithRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedEdge(row, column, direction, Side.Right, this.edgeSize);
        this.drawSlopedRightOutsideCorner(row, column, direction);
    }

    public drawSlopedTileWithLeftOutsideCornerEdge(row: number, column: number, direction: Direction) {
        this.drawSlopedEdge(row, column, direction, Side.Left, this.edgeSize)
        this.drawSlopedLeftOutsideCorner(row, column, direction);
    }
}