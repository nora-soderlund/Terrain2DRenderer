import { Direction } from "../../types/Direction";
import { GridMap } from "../../types/GridMap";

/**
 * A data class that provides the 2d terrain logic.
 */
export default class TerrainGrid {
    public readonly rows: number;
    public readonly columns: number;

    constructor(private readonly map: GridMap) {
        console.time("TerrainGrid");

        for(let row = 0; row < map.length; row++) {
            this.map[row].unshift(0);
            this.map[row].push(0);            
        }

        this.map.unshift([]);
        this.map.push([]);

        for(let row = 0; row < this.map.length; row++)
        for(let column = 0; column < this.map[row].length; column++) {
            if(!this.isTileWater(row, column))
                continue;

            const squareTiles = [
                this.isTileByDirectionWater(row, column, Direction.East),
                this.isTileByDirectionWater(row, column, Direction.South),
                this.isTileByDirectionWater(row, column, Direction.West),
                this.isTileByDirectionWater(row, column, Direction.North)
            ];

            if(squareTiles.every((item) => item === squareTiles[0]))
                continue;

            for(let direction = 0; direction < 360; direction += 90) {
                if(this.isTileByDirectionFlat(row, column, direction + Direction.East))
                    continue;

                if(!this.isTileByDirectionFlat(row, column, direction + Direction.South))
                    continue;

                if(!this.isTileByDirectionFlat(row, column, direction + Direction.West))
                    continue;

                if(this.isTileByDirectionFlat(row, column, direction + Direction.North))
                    continue;
                
                // values between 255 and 251 indicates a slope; 251 being a north-east slope and 255 a north-west slope
                this.map[row][column] = 255 - (direction / 360 * 4);

                break;
            }
        }

        this.rows = this.map.length;
        this.columns = Math.max(...this.map.map((row) => row.length));

        console.timeEnd("TerrainGrid");
    }

    private offsetsByDirection = {
        [Direction.North]: { row: -1, column: 0 },
        [Direction.NorthEast]: { row: -1, column: 1 },
        [Direction.East]: { row: 0, column: 1 },
        [Direction.SouthEast]: { row: 1, column: 1 },
        [Direction.South]: { row: 1, column: 0 },
        [Direction.SouthWest]: { row: 1, column: -1 },
        [Direction.West]: { row: 0, column: -1 },
        [Direction.NorthWest]: { row: -1, column: -1 }
    };

    private getOffsetByDirection(direction: Direction) {
        while(direction >= 360)
            direction -= 360;

        while(direction < 0)
            direction += 360;

        return this.offsetsByDirection[direction];
    }

    public getTileByDirection(row: number, column: number, direction: Direction) {
        const offsets = this.getOffsetByDirection(direction);

        return {
            row: row + offsets.row,
            column: column + offsets.column
        };
    }

    public isTileByDirectionWater(row: number, column: number, direction: Direction) {
        const coordinate = this.getTileByDirection(row, column, direction);

        return this.isTileWater(coordinate.row, coordinate.column);
    }

    public isTileWater(row: number, column: number) {
        return (!this.map[row] || !this.map[row][column]);
    }

    public isTileFlat(row: number, column: number) {
        if(this.isTileWater(row, column))
            return false;

        return this.map[row][column] < 251;
    }

    public isTileByDirectionFlat(row: number, column: number, direction: Direction) {
        const coordinate = this.getTileByDirection(row, column, direction);

        return this.isTileFlat(coordinate.row, coordinate.column);
    }

    public isTileSlope(row: number, column: number) {
        if(this.isTileWater(row, column))
            return false;

        return this.map[row][column] >= 251;
    }

    public isTileByDirectionSlope(row: number, column: number, direction: Direction) {
        const coordinate = this.getTileByDirection(row, column, direction);

        return this.isTileSlope(coordinate.row, coordinate.column);
    }

    public getTileSlopeDirection(row: number, column: number): Direction {
        return (255 - this.map[row][column]) * 90;
    }
};
