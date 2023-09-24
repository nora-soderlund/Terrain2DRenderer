import { Direction } from "../../types/Direction";
import TerrainGrid from "./TerrainGrid";
import { TerrainTileDefinition } from "./types/TerrainTileDefinition";
import { TerrainTileType } from "./types/TerrainTileType";

export default class TerrainTiles {
    public readonly definitions: TerrainTileDefinition[];

    constructor(public readonly grid: TerrainGrid) {
        this.definitions = this.getTiles();
    }

    private getTiles() {
        const tiles: TerrainTileDefinition[] = [];

        for(let row = 0; row < this.grid.rows; row++)
        for(let column = 0; column < this.grid.columns; column++) {
            if(this.grid.isTileWater(row, column))
                continue;

            if(this.grid.isTileSlope(row, column)) {
                console.log("slope at " + row + " x " + column);

                for(let direction = 45; direction < 360; direction += 90) {
                    if(!this.grid.isTileByDirectionWater(row, column, direction + Direction.NorthEast))
                        continue;

                    if(!this.grid.isTileByDirectionFlat(row, column, direction + Direction.SouthEast))
                        continue;

                    tiles.push(this.getSlopedTile(row, column, direction));

                    if(this.shouldSlopedTileHaveLeftFlatEdge(row, column, direction - 45))
                        tiles.push(this.getSlopedTileLeftFlatEdge(row, column, direction))

                    if(this.shouldSlopedTileHaveLeftOutsideCornerEdge(row, column, direction - 45))
                        tiles.push(this.getSlopedTileLeftOutsideCornerEdge(row, column, direction))

                    if(this.shouldSlopedTileHaveRightFlatEdge(row, column, direction - 45))
                        tiles.push(this.getSlopedTileRightFlatEdge(row, column, direction))

                    if(this.shouldSlopedTileHaveRightOutsideCornerEdge(row, column, direction - 45))
                        tiles.push(this.getSlopedTileRightOutsideCornerEdge(row, column, direction))

                    break;
                }
                
                continue;
            }

            tiles.push(this.getFlatTile(row, column, Direction.North));

            for(let direction = 0; direction < 360; direction += 90) {
                if(this.shouldTileHaveLeftFlatEdge(row, column, direction))
                    tiles.push(this.getFlatTileWithLeftFlatEdge(row, column, direction));

                if(this.shouldTileHaveLeftInsideCornerEdge(row, column, direction))
                    tiles.push(this.getFlatTileWithLeftInsideCornerEdge(row, column, direction));

                if(this.shouldTileHaveLeftOutsideCornerEdge(row, column, direction))
                    tiles.push(this.getFlatTileWithLeftOutsideCornerEdge(row, column, direction));
                
                if(this.shouldTileHaveRightFlatEdge(row, column, direction))
                    tiles.push(this.getFlatTileWithRightFlatEdge(row, column, direction));

                if(this.shouldTileHaveRightInsideCornerEdge(row, column, direction))
                    tiles.push(this.getFlatTileWithRightInsideCornerEdge(row, column, direction));

                if(this.shouldTileHaveRightOutsideCornerEdge(row, column, direction))
                    tiles.push(this.getFlatTileWithRightOutsideCornerEdge(row, column, direction));
            }
        }

        return tiles;
    }

    private getFlatTile(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.FlatTile
        };
    }

    private shouldTileHaveLeftFlatEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionWater(row, column, direction))
            return false;

        if(this.shouldTileHaveLeftInsideCornerEdge(row, column, direction))
            return false;

        if(this.shouldTileHaveLeftOutsideCornerEdge(row, column, direction))
            return false;

        return true;
    }

    private getFlatTileWithLeftFlatEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction.West))?(TerrainTileType.FlatTileWithLeftInsideCornerEdge):(TerrainTileType.FlatTileWithLeftFlatEdge)
        };
    }

    private shouldTileHaveRightFlatEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionWater(row, column, direction))
            return false;

        if(this.shouldTileHaveRightInsideCornerEdge(row, column, direction))
            return false;

        if(this.shouldTileHaveRightOutsideCornerEdge(row, column, direction))
            return false;

        return true;
    }

    private getFlatTileWithRightFlatEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction.East))?(TerrainTileType.FlatTileWithRightInsideCornerEdge):(TerrainTileType.FlatTileWithRightFlatEdge)
        };
    }

    private shouldTileHaveLeftInsideCornerEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        
        if(!this.grid.isTileByDirectionWater(row, column, direction - Direction.NorthEast))
            return false;
        
        if(!this.grid.isTileByDirectionWater(row, column, direction - Direction.East))
            return false;

        return true;
    }

    private getFlatTileWithLeftInsideCornerEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.FlatTileWithLeftInsideCornerEdge
        };
    }

    private shouldTileHaveRightInsideCornerEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        
        if(!this.grid.isTileByDirectionWater(row, column, direction + Direction.NorthEast))
            return false;
        
        if(!this.grid.isTileByDirectionWater(row, column, direction + Direction.East))
            return false;

        if(this.shouldTileHaveRightOutsideCornerEdge(row, column, direction))
            return false;

        return true;
    }

    private getFlatTileWithRightInsideCornerEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.FlatTileWithRightInsideCornerEdge
        };
    }

    private shouldTileHaveLeftOutsideCornerEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        
        if(this.grid.isTileByDirectionWater(row, column, direction + Direction.NorthWest))
            return false;

        return true;
    }

    private getFlatTileWithLeftOutsideCornerEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction.NorthWest))?(TerrainTileType.FlatTileWithLeftFlatEdge):(TerrainTileType.FlatTileWithLeftOutsideCornerEdge)
        };
    }

    private shouldTileHaveRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        
        if(this.grid.isTileByDirectionWater(row, column, direction + Direction.NorthEast))
            return false;

        return true;
    }

    private getFlatTileWithRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction.NorthEast))?(TerrainTileType.FlatTileWithRightFlatEdge):(TerrainTileType.FlatTileWithRightOutsideCornerEdge)
        };
    }

    private getSlopedTile(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.SlopedTile
        };
    }

    private shouldSlopedTileHaveLeftFlatEdge(row: number, column: number, direction: Direction) {
        if(this.grid.isTileByDirectionFlat(row, column, direction + Direction.NorthWest))
            return;

        return true;
    }

    private getSlopedTileLeftFlatEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.SlopedTileWithLeftFlatEdge
        };
    }

    private shouldSlopedTileHaveLeftOutsideCornerEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionFlat(row, column, direction + Direction.NorthWest))
            return;

        return true;
    }

    private getSlopedTileLeftOutsideCornerEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.SlopedTileWithLeftOutsideCornerEdge
        };
    }

    private shouldSlopedTileHaveRightFlatEdge(row: number, column: number, direction: Direction) {
        if(this.grid.isTileByDirectionFlat(row, column, direction + Direction.SouthEast))
            return;

        return true;
    }

    private getSlopedTileRightFlatEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.SlopedTileWithRightFlatEdge
        };
    }

    private shouldSlopedTileHaveRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        if(!this.grid.isTileByDirectionFlat(row, column, direction + Direction.SouthEast))
            return;

        return true;
    }

    private getSlopedTileRightOutsideCornerEdge(row: number, column: number, direction: Direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType.SlopedTileWithRightOutsideCornerEdge
        };
    }
};
