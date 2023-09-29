import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";
import TerrainTileRenderer from "./renderers/TerrainTileRenderer";
import { TerrainTileType } from "./types/TerrainTileType";
import { Direction } from "../../types/Direction";
import { MercatorCoordinates } from "../../browser/game/mercator/types/MercatorCoordinates";
import { MercatorPixelCoordinates } from "../../browser/game/mercator/types/MercatorPixelCoordinates";

export default class TerrainTileKit {
    public readonly flatTile: Canvas;
    
    public readonly flatTileWithLeftFlatEdge: Canvas;
    public readonly flatTileWithRightFlatEdge: Canvas;
    
    public readonly flatTileWithLeftInsideCornerEdge: Canvas;
    public readonly flatTileWithRightInsideCornerEdge: Canvas;
    
    public readonly flatTileWithLeftOutsideCornerEdge: Canvas;
    public readonly flatTileWithRightOutsideCornerEdge: Canvas;
    
    public readonly slopedTile: Canvas;
    
    public readonly slopedTileWithLeftFlatEdge: Canvas;
    public readonly slopedTileWithRightFlatEdge: Canvas;

    public readonly slopedTileWithRightOutsideCornerEdge: Canvas;
    public readonly slopedTileWithLeftOutsideCornerEdge: Canvas;

    private readonly halfSize: number;

    constructor(private readonly terrainTileRenderer: TerrainTileRenderer) {
        this.halfSize = Math.floor(this.terrainTileRenderer.size / 2);

        this.flatTile = this.createFlatTile();

        this.flatTileWithLeftFlatEdge = this.createFlatTileWithLeftFlatEdge();
        this.flatTileWithRightFlatEdge = this.createFlatTileWithRightFlatEdge();
        
        this.flatTileWithLeftInsideCornerEdge = this.createFlatTileWithLeftInsideCornerEdge();
        this.flatTileWithRightInsideCornerEdge = this.createFlatTileWithRightInsideCornerEdge();
        
        this.flatTileWithLeftOutsideCornerEdge = this.createFlatTileWithLeftOutsideCornerEdge();
        this.flatTileWithRightOutsideCornerEdge = this.createFlatTileWithRightOutsideCornerEdge();
        
        this.slopedTile = this.createSlopedTile();
        
        this.slopedTileWithLeftFlatEdge = this.createSlopedTileWithLeftFlatEdge();
        this.slopedTileWithRightFlatEdge = this.createSlopedTileWithRightFlatEdge();
    
        this.slopedTileWithRightOutsideCornerEdge = this.createSlopedTileWithRightOutsideCornerEdge();
        this.slopedTileWithLeftOutsideCornerEdge = this.createSlopedTileWithLeftOutsideCornerEdge();
    };

    // TODO: remove MercatorCoordinate
    public draw(context: CanvasRenderingContext2D, offset: MercatorPixelCoordinates, type: TerrainTileType, row: number, column: number, direction: Direction) {
        let left = column * this.terrainTileRenderer.size;
        let top = row * this.terrainTileRenderer.size;

        left += offset.left;
        top += offset.top;

        left += this.halfSize;
        top += this.halfSize;

        const centerOffset = -(this.terrainTileRenderer.size * 1.5);

        context.save();

        context.translate(left, top);

        context.rotate((Math.PI / 180) * (180 + direction));

        switch(type) {
            case TerrainTileType.FlatTile: {
                context.drawImage(this.flatTile, centerOffset, centerOffset);

                break;
            }

            case TerrainTileType.FlatTileWithLeftFlatEdge: {
                context.drawImage(this.flatTileWithLeftFlatEdge, centerOffset, centerOffset);

                break;
            }

            case TerrainTileType.FlatTileWithRightFlatEdge: {
                context.drawImage(this.flatTileWithRightFlatEdge, centerOffset, centerOffset);

                break;
            }

            case TerrainTileType.FlatTileWithLeftInsideCornerEdge: {
                context.drawImage(this.flatTileWithLeftInsideCornerEdge, centerOffset, centerOffset);

                break;
            }

            case TerrainTileType.FlatTileWithRightInsideCornerEdge: {
                context.drawImage(this.flatTileWithRightInsideCornerEdge, centerOffset, centerOffset);

                break;
            }

            case TerrainTileType.FlatTileWithLeftOutsideCornerEdge: {
                context.drawImage(this.flatTileWithLeftOutsideCornerEdge, centerOffset, centerOffset);

                break;
            }

            case TerrainTileType.FlatTileWithRightOutsideCornerEdge: {
                context.drawImage(this.flatTileWithRightOutsideCornerEdge, centerOffset, centerOffset);

                break;
            }
            
            case TerrainTileType.SlopedTile: {
                context.rotate((Math.PI / 180) * -45);

                context.drawImage(this.slopedTile, centerOffset, centerOffset);

                break;
            }
            
            case TerrainTileType.SlopedTileWithLeftFlatEdge: {
                context.drawImage(this.slopedTileWithLeftFlatEdge, centerOffset, centerOffset);

                break;
            }
            
            case TerrainTileType.SlopedTileWithRightFlatEdge: {
                context.drawImage(this.slopedTileWithRightFlatEdge, centerOffset, centerOffset);

                break;
            }
            
            case TerrainTileType.SlopedTileWithRightOutsideCornerEdge: {
                context.drawImage(this.slopedTileWithRightOutsideCornerEdge, centerOffset, centerOffset);

                break;
            }
            
            case TerrainTileType.SlopedTileWithLeftOutsideCornerEdge: {
                context.drawImage(this.slopedTileWithLeftOutsideCornerEdge, centerOffset, centerOffset);

                break;
            }

            case TerrainTileType.DebugArrow: {
                break;
            }
        }

        context.restore();
    }

    private createTileCanvas() {
        const width = this.terrainTileRenderer.size * 3;
        const height = width;

        return createCanvas(width, height);
    };

    private createFlatTile() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawFlatTile(context, 1, 1);

        return context.canvas;
    };

    private createFlatTileWithLeftFlatEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawFlatTileWithLeftFlatEdge(context, 1, 1);

        return context.canvas;
    };

    private createFlatTileWithRightFlatEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawFlatTileWithRightFlatEdge(context, 1, 1);

        return context.canvas;
    };

    private createFlatTileWithLeftInsideCornerEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawFlatTileWithLeftInsideCornerEdge(context, 1, 1);

        return context.canvas;
    };

    private createFlatTileWithRightInsideCornerEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawFlatTileWithRightInsideCornerEdge(context, 1, 1);

        return context.canvas;
    };

    private createFlatTileWithLeftOutsideCornerEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawFlatTileWithLeftOutsideCornerEdge(context, 1, 1);

        return context.canvas;
    };

    private createFlatTileWithRightOutsideCornerEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawFlatTileWithRightOutsideCornerEdge(context, 1, 1);

        return context.canvas;
    };

    private createSlopedTile() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawSlopedTile(context, 1, 1);

        return context.canvas;
    };

    private createSlopedTileWithLeftFlatEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawSlopedTileWithLeftFlatEdge(context, 1, 1);

        return context.canvas;
    };

    private createSlopedTileWithRightFlatEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawSlopedTileWithRightFlatEdge(context, 1, 1);

        return context.canvas;
    };

    private createSlopedTileWithRightOutsideCornerEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawSlopedTileWithRightOutsideCornerEdge(context, 1, 1);

        return context.canvas;
    };

    private createSlopedTileWithLeftOutsideCornerEdge() {
        const canvas = this.createTileCanvas();
        const context = canvas.getContext("2d");

        this.terrainTileRenderer.drawSlopedTileWithLeftOutsideCornerEdge(context, 1, 1);

        return context.canvas;
    };
};
