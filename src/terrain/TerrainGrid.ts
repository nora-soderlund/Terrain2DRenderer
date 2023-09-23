import { Direction } from "../types/Direction";
import { TerrainGridItem } from "../types/TerrainGridItem";
import { TerrainGridItemWithAngle } from "../types/TerrainGridItemWithAngle";

export default class TerrainGrid {
    public readonly pattern: number[][];
    public readonly rows: number;
    public readonly columns: number;

    constructor(pattern: number[][]) {
        this.pattern = pattern;
        this.rows = this.pattern.length;
        this.columns = Math.max(...this.pattern.map((row) => row.length));
    }

    public isNorthTileWater(row: number, column: number) {
        return (!this.pattern[row - 1] || !this.pattern[row - 1][column]);
    }

    public isEastTileWater(row: number, column: number) {
        return (!this.pattern[row] || !this.pattern[row][column + 1]);
    }

    public isWestTileWater(row: number, column: number) {
        return (!this.pattern[row] || !this.pattern[row][column - 1]);
    }

    public isSouthTileWater(row: number, column: number) {
        return (!this.pattern[row + 1] || !this.pattern[row + 1][column]);
    }

    public getTiles() {
        const items: TerrainGridItem[] = [];

        for(let row = 0; row < this.rows; row++)
        for(let column = 0; column < this.pattern[row].length; column++) {
            if(!this.pattern[row][column])
                continue;

            items.push({
                row,
                column,
                direction: Direction.North
            });
        }

        return items;
    }

    public getInnerEdgeCorners() {
        const items: TerrainGridItem[] = [];

        for(let row = 0; row < this.rows; row++)
        for(let column = 0; column < this.pattern[row].length; column++) {
            if(this.pattern[row][column])
                continue;

            if(!this.isSouthTileWater(row, column) && !this.isEastTileWater(row, column)) {
                items.push({
                    row: row + 1,
                    column: column + 1,
                    direction: Direction.NorthWest
                });
            }

            if(!this.isSouthTileWater(row, column) && !this.isWestTileWater(row, column)) {
                items.push({
                    row: row + 1,
                    column: column - 1,
                    direction: Direction.NorthEast
                });
            }

            if(!this.isNorthTileWater(row, column) && !this.isEastTileWater(row, column)) {
                items.push({
                    row: row - 1,
                    column: column + 1,
                    direction: Direction.SouthWest
                });
            }

            if(!this.isNorthTileWater(row, column) && !this.isWestTileWater(row, column)) {
                items.push({
                    row: row - 1,
                    column: column - 1,
                    direction: Direction.SouthEast
                });
            }
        }

        return items;
    }

    public getOuterEdges() {
        const items: TerrainGridItem[] = [];
        const connectors: TerrainGridItem[] = [];

        for(let row = 0; row < this.rows; row++)
        for(let column = 0; column < this.pattern[row].length; column++) {
            if(!this.pattern[row][column])
                continue;

            if(this.isNorthTileWater(row, column)) {
                if(this.isWestTileWater(row - 1, column) || !this.isEastTileWater(row - 1, column)) {
                    items.push({
                        row: row - 1,
                        column,
                        direction: Direction.North
                    });

                    if(!this.isEastTileWater(row, column) && this.isEastTileWater(row - 1, column)) {
                        connectors.push({
                            row: row - 1,
                            column,
                            direction: Direction.North
                        });
                    }
                }
            }

            if(this.isSouthTileWater(row, column)) {
                items.push({
                    row: row + 1,
                    column,
                    direction: Direction.South
                });

                if(!this.isWestTileWater(row, column) && this.isWestTileWater(row + 1, column)) {
                    connectors.push({
                        row: row + 1,
                        column,
                        direction: Direction.South
                    });
                }
            }

            if(this.isEastTileWater(row, column)) {
                if(this.isEastTileWater(row + 1, column) || !this.isEastTileWater(row, column + 1)) {
                    items.push({
                        row,
                        column: column + 1,
                        direction: Direction.East
                    });

                    if(!this.isSouthTileWater(row, column) && this.isEastTileWater(row + 1, column)) {
                        connectors.push({
                            row,
                            column: column + 1,
                            direction: Direction.East
                        });
                    }
                }
                else {
                    items.push({
                        row,
                        column: column + 1,
                        direction: Direction.NorthEast
                    });
                }
            }
            
            if(this.isWestTileWater(row, column)) {
                items.push({
                    row,
                    column: column - 1,
                    direction: Direction.West
                });
                
                if(!this.isNorthTileWater(row, column) && this.isNorthTileWater(row, column - 1)) {
                    connectors.push({
                        row,
                        column: column - 1,
                        direction: Direction.West
                    });
                }
            }
        }

        return {
            items,
            connectors
        };
    };


    public getOuterEdgeCorners() {
        const items: TerrainGridItemWithAngle[] = [];

        for(let row = 0; row < this.rows; row++)
        for(let column = 0; column < this.pattern[row].length; column++) {
            if(!this.pattern[row][column])
                continue;

            if((this.isNorthTileWater(row, column)) && (this.isEastTileWater(row, column))) {
                if(this.isEastTileWater(row - 1, column)) {
                    if(!this.isSouthTileWater(row, column + 1) && this.isEastTileWater(row, column + 1)) {
                        items.push({
                            row: row - 1,
                            column: column + 1,
                            direction: Direction.NorthEast,
                            angle: 45
                        });
                    }
                    else {
                        items.push({
                            row: row - 1,
                            column: column + 1,
                            direction: Direction.NorthEast,
                            angle: 90
                        });
                    }
                }
            }

            if((this.isNorthTileWater(row, column)) && (this.isWestTileWater(row, column))) {
                if(this.isWestTileWater(row - 1, column)) {
                    items.push({
                        row: row - 1,
                        column: column - 1,
                        direction: Direction.NorthWest,
                        angle: 90
                    });
                }
            }

            if((this.isSouthTileWater(row, column)) && (this.isEastTileWater(row, column))) {
                if(this.isEastTileWater(row + 1, column)) {
                    items.push({
                        row: row + 1,
                        column: column + 1,
                        direction: Direction.SouthEast,
                        angle: 90
                    });
                }
            }

            if((this.isSouthTileWater(row, column)) && (this.isWestTileWater(row, column))) {
                if(this.isWestTileWater(row + 1, column)) {
                    items.push({
                        row: row + 1,
                        column: column - 1,
                        direction: Direction.SouthWest,
                        angle: 90
                    });
                }
            }
        }

        return items;
    }
};
