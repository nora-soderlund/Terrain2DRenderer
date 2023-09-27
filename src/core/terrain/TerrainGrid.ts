import { Direction } from "../../types/Direction";
import { GridMap } from "../../types/GridMap";

export default class TerrainGrid {
    public readonly rows: number;
    public readonly columns: number;

    constructor(private readonly map: GridMap) {
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

            for(let direction = 0; direction < 360; direction += 90) {
                if(this.isTileByDirectionFlat(row, column, direction + Direction.East))
                    continue;

                if(!this.isTileByDirectionFlat(row, column, direction + Direction.South))
                    continue;

                if(!this.isTileByDirectionFlat(row, column, direction + Direction.West))
                    continue;

                if(this.isTileByDirectionFlat(row, column, direction + Direction.North))
                    continue;
                
                this.map[row][column] = 255;

                break;
            }
        }

        this.rows = this.map.length;
        this.columns = Math.max(...this.map.map((row) => row.length));
    }

    private getOffsetByDirection(direction: Direction) {
        while(direction >= 360)
            direction -= 360;

        while(direction < 0)
            direction += 360;

        switch(direction) {
            case Direction.North:
                return { row: -1, column: 0 };

            case Direction.NorthEast:
                return { row: -1, column: 1 };

            case Direction.East:
                return { row: 0, column: 1 };

            case Direction.SouthEast:
                return { row: 1, column: 1 };

            case Direction.South:
                return { row: 1, column: 0 };

            case Direction.SouthWest:
                return { row: 1, column: -1 };

            case Direction.West:
                return { row: 0, column: -1 };

            case Direction.NorthWest:
                return { row: -1, column: -1 };
        }
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

        return this.map[row][column] !== 255;
    }

    public isTileByDirectionFlat(row: number, column: number, direction: Direction) {
        const coordinate = this.getTileByDirection(row, column, direction);

        return this.isTileFlat(coordinate.row, coordinate.column);
    }

    public isTileSlope(row: number, column: number) {
        if(this.isTileWater(row, column))
            return false;

        return this.map[row][column] === 255;
    }

    public isTileByDirectionSlope(row: number, column: number, direction: Direction) {
        const coordinate = this.getTileByDirection(row, column, direction);

        return this.isTileSlope(coordinate.row, coordinate.column);
    }
};
