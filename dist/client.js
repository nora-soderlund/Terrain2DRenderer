/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const TerrainCanvas_1 = __importDefault(__webpack_require__(/*! ./terrain/TerrainCanvas */ "./src/terrain/TerrainCanvas.ts"));
const TerrainDebugCanvas_1 = __importDefault(__webpack_require__(/*! ./terrain/TerrainDebugCanvas */ "./src/terrain/TerrainDebugCanvas.ts"));
const TerrainGrid_1 = __importDefault(__webpack_require__(/*! ./terrain/TerrainGrid */ "./src/terrain/TerrainGrid.ts"));
fetch("assets/sweden.json").then((response) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield response.json();
    const swedenTerrainGrid = new TerrainGrid_1.default(result);
    const testTerrainGrid = new TerrainGrid_1.default([
        [1, 0, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 0, 1, 0, 0]
    ]);
    document.body.append(new TerrainCanvas_1.default(swedenTerrainGrid, 10).element);
    document.body.append(new TerrainDebugCanvas_1.default(100).element);
}));


/***/ }),

/***/ "./src/terrain/TerrainCanvas.ts":
/*!**************************************!*\
  !*** ./src/terrain/TerrainCanvas.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const TerrainCanvasMouseEvents_1 = __importDefault(__webpack_require__(/*! ./events/TerrainCanvasMouseEvents */ "./src/terrain/events/TerrainCanvasMouseEvents.ts"));
const TerrainGridRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainGridRenderer */ "./src/terrain/renderers/TerrainGridRenderer.ts"));
const TerrainTileRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainTileRenderer */ "./src/terrain/renderers/TerrainTileRenderer.ts"));
const TerrainWaterRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainWaterRenderer */ "./src/terrain/renderers/TerrainWaterRenderer.ts"));
const TerrainTiles_1 = __importDefault(__webpack_require__(/*! ./TerrainTiles */ "./src/terrain/TerrainTiles.ts"));
class TerrainCanvas {
    constructor(grid, size) {
        this.grid = grid;
        this.size = size;
        this.element = document.createElement("canvas");
        this.offset = {
            left: 0,
            top: 0
        };
        this.mouseEvents = new TerrainCanvasMouseEvents_1.default(this.element);
        this.tiles = new TerrainTiles_1.default(grid);
        this.requestRender();
    }
    ;
    requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    }
    ;
    render() {
        const bounds = this.element.getBoundingClientRect();
        this.element.width = bounds.width;
        this.element.height = bounds.height;
        this.offset.left = this.mouseEvents.offset.left + Math.floor(this.element.width / 2) - Math.floor((this.grid.columns * this.size) / 2);
        this.offset.top = this.mouseEvents.offset.top + Math.floor(this.element.height / 2) - Math.floor((this.grid.rows * this.size) / 2);
        const context = this.element.getContext("2d");
        const terrainWaterRenderer = new TerrainWaterRenderer_1.default(context);
        terrainWaterRenderer.drawWater();
        const terrainGridRenderer = new TerrainGridRenderer_1.default(context, this.size, this.offset);
        terrainGridRenderer.drawGrid();
        const terrainTileRenderer = new TerrainTileRenderer_1.default(context, this.size, this.offset);
        for (let tileDefinition of this.tiles.definitions) {
            terrainTileRenderer.draw(tileDefinition.type, tileDefinition.row, tileDefinition.column, tileDefinition.direction);
        }
        for (let tileDefinition of this.tiles.definitions) {
            terrainTileRenderer.drawDebugArrow(tileDefinition.row, tileDefinition.column, tileDefinition.direction);
        }
        this.requestRender();
    }
    ;
}
exports["default"] = TerrainCanvas;
;


/***/ }),

/***/ "./src/terrain/TerrainDebugCanvas.ts":
/*!*******************************************!*\
  !*** ./src/terrain/TerrainDebugCanvas.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const TerrainGridRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainGridRenderer */ "./src/terrain/renderers/TerrainGridRenderer.ts"));
const TerrainTileRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainTileRenderer */ "./src/terrain/renderers/TerrainTileRenderer.ts"));
const TerrainWaterRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainWaterRenderer */ "./src/terrain/renderers/TerrainWaterRenderer.ts"));
const TerrainCanvasMouseEvents_1 = __importDefault(__webpack_require__(/*! ./events/TerrainCanvasMouseEvents */ "./src/terrain/events/TerrainCanvasMouseEvents.ts"));
class TerrainDebugCanvas {
    constructor(size) {
        this.size = size;
        this.element = document.createElement("canvas");
        this.offset = {
            left: 0,
            top: 0
        };
        this.mouseEvents = new TerrainCanvasMouseEvents_1.default(this.element);
        this.requestRender();
    }
    ;
    requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    }
    ;
    render() {
        const bounds = this.element.getBoundingClientRect();
        this.element.width = bounds.width;
        this.element.height = bounds.height;
        this.offset.left = this.mouseEvents.offset.left + -1300;
        this.offset.top = this.mouseEvents.offset.top;
        const context = this.element.getContext("2d");
        const terrainWaterRenderer = new TerrainWaterRenderer_1.default(context);
        terrainWaterRenderer.drawWater();
        const terrainGridRenderer = new TerrainGridRenderer_1.default(context, this.size, this.offset);
        terrainGridRenderer.drawGrid();
        const terrainTileRenderer = new TerrainTileRenderer_1.default(context, this.size, this.offset);
        for (let direction = 0; direction < 4; direction++) {
            for (let index = 0; index < 14; index += 2)
                terrainTileRenderer.drawFlatTile(1 + (direction * 2), index, direction * 90);
            terrainTileRenderer.drawFlatTileWithLeftFlatEdge(1 + (direction * 2), 2, direction * 90);
            terrainTileRenderer.drawFlatTileWithRightFlatEdge(1 + (direction * 2), 4, direction * 90);
            terrainTileRenderer.drawFlatTileWithLeftInsideCornerEdge(1 + (direction * 2), 6, direction * 90);
            terrainTileRenderer.drawFlatTileWithRightInsideCornerEdge(1 + (direction * 2), 8, direction * 90);
            terrainTileRenderer.drawFlatTileWithLeftOutsideCornerEdge(1 + (direction * 2), 10, direction * 90);
            terrainTileRenderer.drawFlatTileWithRightOutsideCornerEdge(1 + (direction * 2), 12, direction * 90);
            for (let index = 14; index < 24; index += 2)
                terrainTileRenderer.drawSlopedTile(1 + (direction * 2), index, (direction * 90) + 45);
            terrainTileRenderer.drawSlopedTileWithLeftFlatEdge(1 + (direction * 2), 16, (direction * 90) + 45);
            terrainTileRenderer.drawSlopedTileWithRightFlatEdge(1 + (direction * 2), 18, (direction * 90) + 45);
            terrainTileRenderer.drawSlopedTileWithLeftOutsideCornerEdge(1 + (direction * 2), 20, (direction * 90) + 45);
            terrainTileRenderer.drawSlopedTileWithRightOutsideCornerEdge(1 + (direction * 2), 22, (direction * 90) + 45);
        }
        this.requestRender();
    }
    ;
}
exports["default"] = TerrainDebugCanvas;
;


/***/ }),

/***/ "./src/terrain/TerrainGrid.ts":
/*!************************************!*\
  !*** ./src/terrain/TerrainGrid.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../types/Direction */ "./src/types/Direction.ts");
class TerrainGrid {
    constructor(map) {
        this.map = map;
        for (let row = 0; row < this.map.length; row++)
            for (let column = 0; column < this.map[row].length; column++) {
                if (!this.isTileWater(row, column))
                    continue;
                for (let direction = 0; direction < 360; direction += 90) {
                    if (this.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.East))
                        continue;
                    if (!this.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.South))
                        continue;
                    if (!this.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.West))
                        continue;
                    if (this.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.North))
                        continue;
                    this.map[row][column] = 255;
                    console.log("found slope at " + row + " x " + column + " at direction " + direction);
                    break;
                }
            }
        this.rows = this.map.length;
        this.columns = Math.max(...this.map.map((row) => row.length));
    }
    getOffsetByDirection(direction) {
        while (direction >= 360)
            direction -= 360;
        while (direction < 0)
            direction += 360;
        switch (direction) {
            case Direction_1.Direction.North:
                return { row: -1, column: 0 };
            case Direction_1.Direction.NorthEast:
                return { row: -1, column: 1 };
            case Direction_1.Direction.East:
                return { row: 0, column: 1 };
            case Direction_1.Direction.SouthEast:
                return { row: 1, column: 1 };
            case Direction_1.Direction.South:
                return { row: 1, column: 0 };
            case Direction_1.Direction.SouthWest:
                return { row: 1, column: -1 };
            case Direction_1.Direction.West:
                return { row: 0, column: -1 };
            case Direction_1.Direction.NorthWest:
                return { row: -1, column: -1 };
        }
    }
    getTileByDirection(row, column, direction) {
        const offsets = this.getOffsetByDirection(direction);
        return {
            row: row + offsets.row,
            column: column + offsets.column
        };
    }
    isTileByDirectionWater(row, column, direction) {
        const coordinate = this.getTileByDirection(row, column, direction);
        return this.isTileWater(coordinate.row, coordinate.column);
    }
    isTileWater(row, column) {
        return (!this.map[row] || !this.map[row][column]);
    }
    isTileFlat(row, column) {
        if (this.isTileWater(row, column))
            return false;
        return this.map[row][column] !== 255;
    }
    isTileByDirectionFlat(row, column, direction) {
        const coordinate = this.getTileByDirection(row, column, direction);
        return this.isTileFlat(coordinate.row, coordinate.column);
    }
    isTileSlope(row, column) {
        if (this.isTileWater(row, column))
            return false;
        return this.map[row][column] === 255;
    }
    isTileByDirectionSlope(row, column, direction) {
        const coordinate = this.getTileByDirection(row, column, direction);
        return this.isTileSlope(coordinate.row, coordinate.column);
    }
}
exports["default"] = TerrainGrid;
;


/***/ }),

/***/ "./src/terrain/TerrainTiles.ts":
/*!*************************************!*\
  !*** ./src/terrain/TerrainTiles.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../types/Direction */ "./src/types/Direction.ts");
const TerrainTileType_1 = __webpack_require__(/*! ./types/TerrainTileType */ "./src/terrain/types/TerrainTileType.ts");
class TerrainTiles {
    constructor(grid) {
        this.grid = grid;
        this.definitions = this.getTiles();
    }
    getTiles() {
        const tiles = [];
        for (let row = 0; row < this.grid.rows; row++)
            for (let column = 0; column < this.grid.columns; column++) {
                if (this.grid.isTileWater(row, column))
                    continue;
                if (this.grid.isTileSlope(row, column)) {
                    console.log("slope at " + row + " x " + column);
                    for (let direction = 45; direction < 360; direction += 90) {
                        if (!this.grid.isTileByDirectionWater(row, column, direction + Direction_1.Direction.NorthEast))
                            continue;
                        if (!this.grid.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.SouthEast))
                            continue;
                        tiles.push(this.getSlopedTile(row, column, direction));
                        if (this.shouldSlopedTileHaveLeftFlatEdge(row, column, direction - 45))
                            tiles.push(this.getSlopedTileLeftFlatEdge(row, column, direction));
                        if (this.shouldSlopedTileHaveLeftOutsideCornerEdge(row, column, direction - 45))
                            tiles.push(this.getSlopedTileLeftOutsideCornerEdge(row, column, direction));
                        if (this.shouldSlopedTileHaveRightFlatEdge(row, column, direction - 45))
                            tiles.push(this.getSlopedTileRightFlatEdge(row, column, direction));
                        if (this.shouldSlopedTileHaveRightOutsideCornerEdge(row, column, direction - 45))
                            tiles.push(this.getSlopedTileRightOutsideCornerEdge(row, column, direction));
                        break;
                    }
                    continue;
                }
                tiles.push(this.getFlatTile(row, column, Direction_1.Direction.North));
                for (let direction = 0; direction < 360; direction += 90) {
                    if (this.shouldTileHaveLeftFlatEdge(row, column, direction))
                        tiles.push(this.getFlatTileWithLeftFlatEdge(row, column, direction));
                    if (this.shouldTileHaveLeftInsideCornerEdge(row, column, direction))
                        tiles.push(this.getFlatTileWithLeftInsideCornerEdge(row, column, direction));
                    if (this.shouldTileHaveLeftOutsideCornerEdge(row, column, direction))
                        tiles.push(this.getFlatTileWithLeftOutsideCornerEdge(row, column, direction));
                    if (this.shouldTileHaveRightFlatEdge(row, column, direction))
                        tiles.push(this.getFlatTileWithRightFlatEdge(row, column, direction));
                    if (this.shouldTileHaveRightInsideCornerEdge(row, column, direction))
                        tiles.push(this.getFlatTileWithRightInsideCornerEdge(row, column, direction));
                    if (this.shouldTileHaveRightOutsideCornerEdge(row, column, direction))
                        tiles.push(this.getFlatTileWithRightOutsideCornerEdge(row, column, direction));
                }
            }
        return tiles;
    }
    getFlatTile(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.FlatTile
        };
    }
    shouldTileHaveLeftFlatEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        if (this.shouldTileHaveLeftInsideCornerEdge(row, column, direction))
            return false;
        if (this.shouldTileHaveLeftOutsideCornerEdge(row, column, direction))
            return false;
        return true;
    }
    getFlatTileWithLeftFlatEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction_1.Direction.West)) ? (TerrainTileType_1.TerrainTileType.FlatTileWithLeftInsideCornerEdge) : (TerrainTileType_1.TerrainTileType.FlatTileWithLeftFlatEdge)
        };
    }
    shouldTileHaveRightFlatEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        if (this.shouldTileHaveRightInsideCornerEdge(row, column, direction))
            return false;
        if (this.shouldTileHaveRightOutsideCornerEdge(row, column, direction))
            return false;
        return true;
    }
    getFlatTileWithRightFlatEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction_1.Direction.East)) ? (TerrainTileType_1.TerrainTileType.FlatTileWithRightInsideCornerEdge) : (TerrainTileType_1.TerrainTileType.FlatTileWithRightFlatEdge)
        };
    }
    shouldTileHaveLeftInsideCornerEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        if (!this.grid.isTileByDirectionWater(row, column, direction - Direction_1.Direction.NorthEast))
            return false;
        if (!this.grid.isTileByDirectionWater(row, column, direction - Direction_1.Direction.East))
            return false;
        return true;
    }
    getFlatTileWithLeftInsideCornerEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.FlatTileWithLeftInsideCornerEdge
        };
    }
    shouldTileHaveRightInsideCornerEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        if (!this.grid.isTileByDirectionWater(row, column, direction + Direction_1.Direction.NorthEast))
            return false;
        if (!this.grid.isTileByDirectionWater(row, column, direction + Direction_1.Direction.East))
            return false;
        if (this.shouldTileHaveRightOutsideCornerEdge(row, column, direction))
            return false;
        return true;
    }
    getFlatTileWithRightInsideCornerEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.FlatTileWithRightInsideCornerEdge
        };
    }
    shouldTileHaveLeftOutsideCornerEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        if (this.grid.isTileByDirectionWater(row, column, direction + Direction_1.Direction.NorthWest))
            return false;
        return true;
    }
    getFlatTileWithLeftOutsideCornerEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction_1.Direction.NorthWest)) ? (TerrainTileType_1.TerrainTileType.FlatTileWithLeftFlatEdge) : (TerrainTileType_1.TerrainTileType.FlatTileWithLeftOutsideCornerEdge)
        };
    }
    shouldTileHaveRightOutsideCornerEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionWater(row, column, direction))
            return false;
        if (this.grid.isTileByDirectionWater(row, column, direction + Direction_1.Direction.NorthEast))
            return false;
        return true;
    }
    getFlatTileWithRightOutsideCornerEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: (this.grid.isTileByDirectionSlope(row, column, direction + Direction_1.Direction.NorthEast)) ? (TerrainTileType_1.TerrainTileType.FlatTileWithRightFlatEdge) : (TerrainTileType_1.TerrainTileType.FlatTileWithRightOutsideCornerEdge)
        };
    }
    getSlopedTile(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.SlopedTile
        };
    }
    shouldSlopedTileHaveLeftFlatEdge(row, column, direction) {
        if (this.grid.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.NorthWest))
            return;
        return true;
    }
    getSlopedTileLeftFlatEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.SlopedTileWithLeftFlatEdge
        };
    }
    shouldSlopedTileHaveLeftOutsideCornerEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.NorthWest))
            return;
        return true;
    }
    getSlopedTileLeftOutsideCornerEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.SlopedTileWithLeftOutsideCornerEdge
        };
    }
    shouldSlopedTileHaveRightFlatEdge(row, column, direction) {
        if (this.grid.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.SouthEast))
            return;
        return true;
    }
    getSlopedTileRightFlatEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.SlopedTileWithRightFlatEdge
        };
    }
    shouldSlopedTileHaveRightOutsideCornerEdge(row, column, direction) {
        if (!this.grid.isTileByDirectionFlat(row, column, direction + Direction_1.Direction.SouthEast))
            return;
        return true;
    }
    getSlopedTileRightOutsideCornerEdge(row, column, direction) {
        return {
            row,
            column,
            direction,
            type: TerrainTileType_1.TerrainTileType.SlopedTileWithRightOutsideCornerEdge
        };
    }
}
exports["default"] = TerrainTiles;
;


/***/ }),

/***/ "./src/terrain/events/TerrainCanvasMouseEvents.ts":
/*!********************************************************!*\
  !*** ./src/terrain/events/TerrainCanvasMouseEvents.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class TerrainCanvasMouseEvents {
    constructor(element) {
        this.element = element;
        this.offset = {
            left: 0,
            top: 0
        };
        this.lastMousePageOffset = {
            left: 0,
            top: 0
        };
        this.mousemoveEvent = this.mousemove.bind(this);
        this.mouseupEvent = this.mouseup.bind(this);
        this.element.addEventListener("mousedown", this.mousedown.bind(this));
    }
    mousedown(event) {
        this.lastMousePageOffset = {
            left: event.pageX,
            top: event.pageY
        };
        this.element.addEventListener("mousemove", this.mousemoveEvent);
        this.element.addEventListener("mouseout", this.mouseupEvent);
        this.element.addEventListener("mouseup", this.mouseupEvent);
    }
    mousemove(event) {
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
    }
    ;
    mouseup() {
        this.element.removeEventListener("mousemove", this.mousemoveEvent);
        this.element.removeEventListener("mouseout", this.mouseupEvent);
        this.element.removeEventListener("mouseup", this.mouseupEvent);
    }
}
exports["default"] = TerrainCanvasMouseEvents;
;


/***/ }),

/***/ "./src/terrain/renderers/TerrainGridRenderer.ts":
/*!******************************************************!*\
  !*** ./src/terrain/renderers/TerrainGridRenderer.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class TerrainGridRenderer {
    constructor(context, size, offset) {
        this.context = context;
        this.size = size;
        this.offset = offset;
    }
    drawGrid() {
        this.context.save();
        this.context.fillStyle = "rgba(0, 0, 0, .05)";
        this.context.translate(this.offset.left, this.offset.top);
        const topStart = -this.offset.top + Math.floor((this.offset.top % this.size) - this.size);
        const topEnd = this.context.canvas.height;
        const leftStart = -this.offset.left + Math.floor((this.offset.left % this.size) - this.size);
        const leftEnd = this.context.canvas.width;
        for (let top = topStart; top < topEnd; top += this.size) {
            this.context.fillRect(leftStart, top - .5, this.context.canvas.width, 1);
        }
        for (let left = leftStart; left < leftEnd; left += this.size) {
            this.context.fillRect(left - .5, topStart, 1, this.context.canvas.height);
        }
        this.context.restore();
    }
    ;
}
exports["default"] = TerrainGridRenderer;


/***/ }),

/***/ "./src/terrain/renderers/TerrainTileRenderer.ts":
/*!******************************************************!*\
  !*** ./src/terrain/renderers/TerrainTileRenderer.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../../types/Direction */ "./src/types/Direction.ts");
const Side_1 = __webpack_require__(/*! ../../types/Side */ "./src/types/Side.ts");
const TerrainTileType_1 = __webpack_require__(/*! ../types/TerrainTileType */ "./src/terrain/types/TerrainTileType.ts");
class TerrainTileRenderer {
    constructor(context, size, offset) {
        this.context = context;
        this.size = size;
        this.offset = offset;
        this.terrainColor = "#C3ECB2";
        this.edgeColor = "#FFF2AF";
        this.debug = false;
        this.debugColor = "black";
        this.halfSize = this.size / 2;
        this.edgeSize = this.size * 0.2;
        this.halfEdgeSize = this.edgeSize / 2;
        this.debugArrowSize = this.size * 0.05;
    }
    ;
    draw(type, row, column, direction) {
        switch (type) {
            case TerrainTileType_1.TerrainTileType.FlatTile: {
                this.drawFlatTile(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.FlatTileWithLeftFlatEdge: {
                this.drawFlatTileWithLeftFlatEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.FlatTileWithRightFlatEdge: {
                this.drawFlatTileWithRightFlatEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.FlatTileWithLeftInsideCornerEdge: {
                this.drawFlatTileWithLeftInsideCornerEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.FlatTileWithRightInsideCornerEdge: {
                this.drawFlatTileWithRightInsideCornerEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.FlatTileWithLeftOutsideCornerEdge: {
                this.drawFlatTileWithLeftOutsideCornerEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.FlatTileWithRightOutsideCornerEdge: {
                this.drawFlatTileWithRightOutsideCornerEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.SlopedTile: {
                this.drawSlopedTile(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.SlopedTileWithLeftFlatEdge: {
                this.drawSlopedTileWithLeftFlatEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.SlopedTileWithRightFlatEdge: {
                this.drawSlopedTileWithRightFlatEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.SlopedTileWithRightOutsideCornerEdge: {
                this.drawSlopedTileWithRightOutsideCornerEdge(row, column, direction);
                break;
            }
            case TerrainTileType_1.TerrainTileType.SlopedTileWithLeftOutsideCornerEdge: {
                this.drawSlopedTileWithLeftOutsideCornerEdge(row, column, direction);
                break;
            }
        }
    }
    getAngle(degrees) {
        return (Math.PI / 180) * degrees;
    }
    setTransformation(row, column, direction) {
        const left = column * this.size;
        const top = row * this.size;
        this.context.translate(this.offset.left, this.offset.top);
        this.context.translate(left, top);
        this.context.translate(this.halfSize, this.halfSize);
        this.context.rotate((Math.PI / 180) * (Direction_1.Direction.South + direction));
    }
    drawDebugTile(row, column, direction) {
        if (this.debug) {
            this.context.save();
            this.context.fillStyle = this.debugColor;
            this.setTransformation(row, column, Direction_1.Direction.South);
            this.context.textAlign = "center";
            this.context.textBaseline = "bottom";
            this.context.fillText(`Row ${row}`, 0, 0);
            this.context.textBaseline = "hanging";
            this.context.fillText(`Column ${column}`, 0, 0);
            this.context.restore();
        }
    }
    ;
    drawDebugArrow(row, column, direction) {
        if (this.debug) {
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
    }
    ;
    drawFlatTile(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.terrainColor;
        this.context.fillRect(-this.halfSize, -this.halfSize, this.size, this.size);
        this.context.restore();
        this.drawDebugTile(row, column, direction);
    }
    drawFlatEdge(row, column, direction, side, gap = 0) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.edgeColor;
        if (side === Side_1.Side.Left)
            this.context.fillRect(0, this.halfSize, this.halfSize - gap, this.edgeSize);
        else if (side === Side_1.Side.Right)
            this.context.fillRect(-this.halfSize + gap, this.halfSize, this.halfSize - gap, this.edgeSize);
        this.context.restore();
    }
    drawFlatTileWithLeftFlatEdge(row, column, direction) {
        this.drawFlatEdge(row, column, direction, Side_1.Side.Left);
    }
    drawFlatTileWithRightFlatEdge(row, column, direction) {
        this.drawFlatEdge(row, column, direction, Side_1.Side.Right);
    }
    drawLeftInsideCornerEdge(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(this.halfSize - this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(45), this.getAngle(45 + 45));
        this.context.stroke();
        this.context.restore();
    }
    drawRightInsideCornerEdge(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(90), this.getAngle(90 + 45));
        this.context.stroke();
        this.context.restore();
    }
    drawFlatTileWithLeftInsideCornerEdge(row, column, direction) {
        this.drawFlatEdge(row, column, direction, Side_1.Side.Left, this.edgeSize);
        this.drawLeftInsideCornerEdge(row, column, direction);
    }
    drawFlatTileWithRightInsideCornerEdge(row, column, direction) {
        this.drawFlatEdge(row, column, direction, Side_1.Side.Right, this.edgeSize);
        this.drawRightInsideCornerEdge(row, column, direction);
    }
    drawLeftOutsideCornerEdge() {
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
    drawRightOutsideCornerEdge() {
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
    drawFlatTileWithLeftOutsideCornerEdge(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.drawLeftOutsideCornerEdge();
        this.context.restore();
        this.drawFlatEdge(row, column, direction, Side_1.Side.Left, this.edgeSize * 2);
    }
    drawFlatTileWithRightOutsideCornerEdge(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.drawRightOutsideCornerEdge();
        this.context.restore();
        this.drawFlatEdge(row, column, direction, Side_1.Side.Right, this.edgeSize * 2);
    }
    drawSlopedTile(row, column, direction) {
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
    drawSlopedEdge(row, column, direction, side, gap = 0) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.edgeColor;
        if (side === Side_1.Side.Left)
            this.context.fillRect(0, -this.halfEdgeSize + 1.5, this.size * .75 - gap, this.edgeSize);
        else if (side === Side_1.Side.Right)
            this.context.fillRect(-this.halfSize * 1.5 + (gap * 1), -this.halfEdgeSize + 1.5, this.size * .75 - gap, this.edgeSize);
        this.context.restore();
    }
    drawSlopedTileWithLeftFlatEdge(row, column, direction) {
        this.drawSlopedEdge(row, column, direction, Side_1.Side.Left);
    }
    drawSlopedTileWithRightFlatEdge(row, column, direction) {
        this.drawSlopedEdge(row, column, direction, Side_1.Side.Right);
    }
    drawSlopedLeftOutsideCorner(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.rotate(this.getAngle(180));
        this.context.translate(-this.edgeSize * 1 + 4, -this.edgeSize * 3 - 2);
        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(45 + 45), this.getAngle((45 + 45) + 45));
        this.context.stroke();
        this.context.restore();
    }
    ;
    drawSlopedRightOutsideCorner(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.translate(-this.edgeSize + 1, 3);
        this.context.beginPath();
        this.context.strokeStyle = this.edgeColor;
        this.context.lineWidth = this.edgeSize;
        this.context.arc(-this.halfSize + this.edgeSize, this.halfSize - this.edgeSize, this.edgeSize * 1.5, this.getAngle(180 + 45), this.getAngle((180 + 45) + 45));
        this.context.stroke();
        this.context.restore();
    }
    ;
    drawSlopedTileWithRightOutsideCornerEdge(row, column, direction) {
        this.drawSlopedEdge(row, column, direction, Side_1.Side.Right, this.edgeSize);
        this.drawSlopedRightOutsideCorner(row, column, direction);
    }
    drawSlopedTileWithLeftOutsideCornerEdge(row, column, direction) {
        this.drawSlopedEdge(row, column, direction, Side_1.Side.Left, this.edgeSize);
        this.drawSlopedLeftOutsideCorner(row, column, direction);
    }
}
exports["default"] = TerrainTileRenderer;


/***/ }),

/***/ "./src/terrain/renderers/TerrainWaterRenderer.ts":
/*!*******************************************************!*\
  !*** ./src/terrain/renderers/TerrainWaterRenderer.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class TerrainWaterRenderer {
    constructor(context) {
        this.context = context;
    }
    drawWater() {
        this.context.save();
        this.context.fillStyle = "#AADAFF";
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.restore();
    }
    ;
}
exports["default"] = TerrainWaterRenderer;


/***/ }),

/***/ "./src/terrain/types/TerrainTileType.ts":
/*!**********************************************!*\
  !*** ./src/terrain/types/TerrainTileType.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerrainTileType = void 0;
var TerrainTileType;
(function (TerrainTileType) {
    TerrainTileType[TerrainTileType["FlatTile"] = 0] = "FlatTile";
    TerrainTileType[TerrainTileType["FlatTileWithLeftFlatEdge"] = 1] = "FlatTileWithLeftFlatEdge";
    TerrainTileType[TerrainTileType["FlatTileWithRightFlatEdge"] = 2] = "FlatTileWithRightFlatEdge";
    TerrainTileType[TerrainTileType["FlatTileWithLeftInsideCornerEdge"] = 3] = "FlatTileWithLeftInsideCornerEdge";
    TerrainTileType[TerrainTileType["FlatTileWithRightInsideCornerEdge"] = 4] = "FlatTileWithRightInsideCornerEdge";
    TerrainTileType[TerrainTileType["FlatTileWithLeftOutsideCornerEdge"] = 5] = "FlatTileWithLeftOutsideCornerEdge";
    TerrainTileType[TerrainTileType["FlatTileWithRightOutsideCornerEdge"] = 6] = "FlatTileWithRightOutsideCornerEdge";
    TerrainTileType[TerrainTileType["SlopedTile"] = 7] = "SlopedTile";
    TerrainTileType[TerrainTileType["SlopedTileWithLeftFlatEdge"] = 8] = "SlopedTileWithLeftFlatEdge";
    TerrainTileType[TerrainTileType["SlopedTileWithRightFlatEdge"] = 9] = "SlopedTileWithRightFlatEdge";
    TerrainTileType[TerrainTileType["SlopedTileWithRightOutsideCornerEdge"] = 10] = "SlopedTileWithRightOutsideCornerEdge";
    TerrainTileType[TerrainTileType["SlopedTileWithLeftOutsideCornerEdge"] = 11] = "SlopedTileWithLeftOutsideCornerEdge";
})(TerrainTileType || (exports.TerrainTileType = TerrainTileType = {}));
;


/***/ }),

/***/ "./src/types/Direction.ts":
/*!********************************!*\
  !*** ./src/types/Direction.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["NorthEast"] = 45] = "NorthEast";
    Direction[Direction["East"] = 90] = "East";
    Direction[Direction["SouthEast"] = 135] = "SouthEast";
    Direction[Direction["South"] = 180] = "South";
    Direction[Direction["SouthWest"] = 225] = "SouthWest";
    Direction[Direction["West"] = 270] = "West";
    Direction[Direction["NorthWest"] = 315] = "NorthWest";
})(Direction || (exports.Direction = Direction = {}));


/***/ }),

/***/ "./src/types/Side.ts":
/*!***************************!*\
  !*** ./src/types/Side.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Side = void 0;
var Side;
(function (Side) {
    Side[Side["Left"] = 0] = "Left";
    Side[Side["Right"] = 1] = "Right";
})(Side || (exports.Side = Side = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVyRSxJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU8seUJBQXlCO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFB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dEIsMENBQVM7SUFDVCxxREFBcUI7SUFFckIsNkNBQVc7SUFDWCxxREFBc0I7SUFFdEIsMkNBQVU7SUFDVixxREFBcUI7QUFDekIsQ0FBQyxFQVpXLFNBQVMseUJBQVQsU0FBUyxRQVlwQjs7Ozs7Ozs7Ozs7Ozs7QUNaRCxJQUFZLElBR1g7QUFIRCxXQUFZLElBQUk7SUFDWiwrQkFBSTtJQUNKLGlDQUFLO0FBQ1QsQ0FBQyxFQUhXLElBQUksb0JBQUosSUFBSSxRQUdmOzs7Ozs7O1VDSEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RlcnJhaW4vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL1RlcnJhaW5DYW52YXMudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL1RlcnJhaW5EZWJ1Z0NhbnZhcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vVGVycmFpbkdyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL1RlcnJhaW5UaWxlcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vZXZlbnRzL1RlcnJhaW5DYW52YXNNb3VzZUV2ZW50cy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vcmVuZGVyZXJzL1RlcnJhaW5HcmlkUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL3JlbmRlcmVycy9UZXJyYWluVGlsZVJlbmRlcmVyLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdGVycmFpbi9yZW5kZXJlcnMvVGVycmFpbldhdGVyUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL3R5cGVzL1RlcnJhaW5UaWxlVHlwZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3R5cGVzL0RpcmVjdGlvbi50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3R5cGVzL1NpZGUudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlcnJhaW5DYW52YXMgZnJvbSBcIi4vdGVycmFpbi9UZXJyYWluQ2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkRlYnVnQ2FudmFzIGZyb20gXCIuL3RlcnJhaW4vVGVycmFpbkRlYnVnQ2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkdyaWQgZnJvbSBcIi4vdGVycmFpbi9UZXJyYWluR3JpZFwiO1xuXG5mZXRjaChcImFzc2V0cy9zd2VkZW4uanNvblwiKS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgY29uc3Qgc3dlZGVuVGVycmFpbkdyaWQgPSBuZXcgVGVycmFpbkdyaWQocmVzdWx0KTtcblxuICBjb25zdCB0ZXN0VGVycmFpbkdyaWQgPSBuZXcgVGVycmFpbkdyaWQoW1xuICAgIFsgMSwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCBdLFxuICAgIFsgMCwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMCBdLFxuICAgIFsgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMSwgMSBdLFxuICAgIFsgMCwgMCwgMCwgMSwgMCwgMSwgMSwgMSwgMSBdLFxuICAgIFsgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMCwgMCBdXG4gIF0pO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG5ldyBUZXJyYWluQ2FudmFzKHN3ZWRlblRlcnJhaW5HcmlkLCAxMCkuZWxlbWVudCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG5ldyBUZXJyYWluRGVidWdDYW52YXMoMTAwKS5lbGVtZW50KTtcbn0pO1xuIiwiaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSBcIi4uL3R5cGVzL0RpcmVjdGlvblwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vdHlwZXMvUG9pbnRcIjtcbmltcG9ydCBUZXJyYWluQ2FudmFzTW91c2VFdmVudHMgZnJvbSBcIi4vZXZlbnRzL1RlcnJhaW5DYW52YXNNb3VzZUV2ZW50c1wiO1xuaW1wb3J0IFRlcnJhaW5HcmlkIGZyb20gXCIuL1RlcnJhaW5HcmlkXCI7XG5pbXBvcnQgVGVycmFpbkdyaWRSZW5kZXJlciBmcm9tIFwiLi9yZW5kZXJlcnMvVGVycmFpbkdyaWRSZW5kZXJlclwiO1xuaW1wb3J0IFRlcnJhaW5UaWxlUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5UaWxlUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluV2F0ZXJSZW5kZXJlciBmcm9tIFwiLi9yZW5kZXJlcnMvVGVycmFpbldhdGVyUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluVGlsZXMgZnJvbSBcIi4vVGVycmFpblRpbGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5DYW52YXMge1xuICAgIHB1YmxpYyByZWFkb25seSBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblxuICAgIHByaXZhdGUgb2Zmc2V0OiBQb2ludCA9IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgfTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgbW91c2VFdmVudHMgPSBuZXcgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzKHRoaXMuZWxlbWVudCk7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHRpbGVzOiBUZXJyYWluVGlsZXM7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGdyaWQ6IFRlcnJhaW5HcmlkLCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnRpbGVzID0gbmV3IFRlcnJhaW5UaWxlcyhncmlkKTtcblxuICAgICAgICB0aGlzLnJlcXVlc3RSZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXF1ZXN0UmVuZGVyKCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IGJvdW5kcy53aWR0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IGJvdW5kcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5vZmZzZXQubGVmdCA9IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LmxlZnQgKyBNYXRoLmZsb29yKHRoaXMuZWxlbWVudC53aWR0aCAvIDIpIC0gTWF0aC5mbG9vcigodGhpcy5ncmlkLmNvbHVtbnMgKiB0aGlzLnNpemUpIC8gMik7XG4gICAgICAgIHRoaXMub2Zmc2V0LnRvcCA9IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LnRvcCArIE1hdGguZmxvb3IodGhpcy5lbGVtZW50LmhlaWdodCAvIDIpIC0gTWF0aC5mbG9vcigodGhpcy5ncmlkLnJvd3MgKiB0aGlzLnNpemUpIC8gMik7XG5cbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuZWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIikhO1xuXG5cbiAgICAgICAgY29uc3QgdGVycmFpbldhdGVyUmVuZGVyZXIgPSBuZXcgVGVycmFpbldhdGVyUmVuZGVyZXIoY29udGV4dCk7XG4gICAgICAgIHRlcnJhaW5XYXRlclJlbmRlcmVyLmRyYXdXYXRlcigpO1xuXG4gICAgICAgIGNvbnN0IHRlcnJhaW5HcmlkUmVuZGVyZXIgPSBuZXcgVGVycmFpbkdyaWRSZW5kZXJlcihjb250ZXh0LCB0aGlzLnNpemUsIHRoaXMub2Zmc2V0KTtcbiAgICAgICAgdGVycmFpbkdyaWRSZW5kZXJlci5kcmF3R3JpZCgpO1xuXG4gICAgICAgIGNvbnN0IHRlcnJhaW5UaWxlUmVuZGVyZXIgPSBuZXcgVGVycmFpblRpbGVSZW5kZXJlcihjb250ZXh0LCB0aGlzLnNpemUsIHRoaXMub2Zmc2V0KTtcbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQgdGlsZURlZmluaXRpb24gb2YgdGhpcy50aWxlcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgdGVycmFpblRpbGVSZW5kZXJlci5kcmF3KHRpbGVEZWZpbml0aW9uLnR5cGUsIHRpbGVEZWZpbml0aW9uLnJvdywgdGlsZURlZmluaXRpb24uY29sdW1uLCB0aWxlRGVmaW5pdGlvbi5kaXJlY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCB0aWxlRGVmaW5pdGlvbiBvZiB0aGlzLnRpbGVzLmRlZmluaXRpb25zKSB7XG4gICAgICAgICAgICB0ZXJyYWluVGlsZVJlbmRlcmVyLmRyYXdEZWJ1Z0Fycm93KHRpbGVEZWZpbml0aW9uLnJvdywgdGlsZURlZmluaXRpb24uY29sdW1uLCB0aWxlRGVmaW5pdGlvbi5kaXJlY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0UmVuZGVyKCk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi90eXBlcy9Qb2ludFwiO1xuaW1wb3J0IFRlcnJhaW5HcmlkUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5HcmlkUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluVGlsZVJlbmRlcmVyIGZyb20gXCIuL3JlbmRlcmVycy9UZXJyYWluVGlsZVJlbmRlcmVyXCI7XG5pbXBvcnQgVGVycmFpbldhdGVyUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5XYXRlclJlbmRlcmVyXCI7XG5pbXBvcnQgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzIGZyb20gXCIuL2V2ZW50cy9UZXJyYWluQ2FudmFzTW91c2VFdmVudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbkRlYnVnQ2FudmFzIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cbiAgICBwcml2YXRlIG9mZnNldDogUG9pbnQgPSB7XG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMFxuICAgIH07XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IG1vdXNlRXZlbnRzID0gbmV3IFRlcnJhaW5DYW52YXNNb3VzZUV2ZW50cyh0aGlzLmVsZW1lbnQpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzaXplOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0UmVuZGVyKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgcmVxdWVzdFJlbmRlcigpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBib3VuZHMud2lkdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBib3VuZHMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMub2Zmc2V0LmxlZnQgPSB0aGlzLm1vdXNlRXZlbnRzLm9mZnNldC5sZWZ0ICsgLTEzMDA7XG4gICAgICAgIHRoaXMub2Zmc2V0LnRvcCA9IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LnRvcDtcblxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5lbGVtZW50LmdldENvbnRleHQoXCIyZFwiKSE7XG5cblxuICAgICAgICBjb25zdCB0ZXJyYWluV2F0ZXJSZW5kZXJlciA9IG5ldyBUZXJyYWluV2F0ZXJSZW5kZXJlcihjb250ZXh0KTtcbiAgICAgICAgdGVycmFpbldhdGVyUmVuZGVyZXIuZHJhd1dhdGVyKCk7XG5cbiAgICAgICAgY29uc3QgdGVycmFpbkdyaWRSZW5kZXJlciA9IG5ldyBUZXJyYWluR3JpZFJlbmRlcmVyKGNvbnRleHQsIHRoaXMuc2l6ZSwgdGhpcy5vZmZzZXQpO1xuICAgICAgICB0ZXJyYWluR3JpZFJlbmRlcmVyLmRyYXdHcmlkKCk7XG5cbiAgICAgICAgY29uc3QgdGVycmFpblRpbGVSZW5kZXJlciA9IG5ldyBUZXJyYWluVGlsZVJlbmRlcmVyKGNvbnRleHQsIHRoaXMuc2l6ZSwgdGhpcy5vZmZzZXQpO1xuXG4gICAgICAgIGZvcihsZXQgZGlyZWN0aW9uID0gMDsgZGlyZWN0aW9uIDwgNDsgZGlyZWN0aW9uKyspIHtcbiAgICAgICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleCA8IDE0OyBpbmRleCArPSAyKVxuICAgICAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd0ZsYXRUaWxlKDEgKyAoZGlyZWN0aW9uICogMiksIGluZGV4LCBkaXJlY3Rpb24gKiA5MCk7XG4gICAgXG4gICAgICAgICAgICB0ZXJyYWluVGlsZVJlbmRlcmVyLmRyYXdGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgMiwgZGlyZWN0aW9uICogOTApO1xuICAgICAgICAgICAgdGVycmFpblRpbGVSZW5kZXJlci5kcmF3RmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCA0LCBkaXJlY3Rpb24gKiA5MCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDYsIGRpcmVjdGlvbiAqIDkwKTtcbiAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCA4LCBkaXJlY3Rpb24gKiA5MCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAxMCwgZGlyZWN0aW9uICogOTApO1xuICAgICAgICAgICAgdGVycmFpblRpbGVSZW5kZXJlci5kcmF3RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAxMiwgZGlyZWN0aW9uICogOTApO1xuXG4gICAgICAgICAgICBmb3IobGV0IGluZGV4ID0gMTQ7IGluZGV4IDwgMjQ7IGluZGV4ICs9IDIpXG4gICAgICAgICAgICAgICAgdGVycmFpblRpbGVSZW5kZXJlci5kcmF3U2xvcGVkVGlsZSgxICsgKGRpcmVjdGlvbiAqIDIpLCBpbmRleCwgKGRpcmVjdGlvbiAqIDkwKSArIDQ1KTtcblxuICAgICAgICAgICAgdGVycmFpblRpbGVSZW5kZXJlci5kcmF3U2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgMTYsIChkaXJlY3Rpb24gKiA5MCkgKyA0NSk7XG4gICAgICAgICAgICB0ZXJyYWluVGlsZVJlbmRlcmVyLmRyYXdTbG9wZWRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgMTgsIChkaXJlY3Rpb24gKiA5MCkgKyA0NSk7XG5cbiAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDIwLCAoZGlyZWN0aW9uICogOTApICsgNDUpO1xuICAgICAgICAgICAgdGVycmFpblRpbGVSZW5kZXJlci5kcmF3U2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDIyLCAoZGlyZWN0aW9uICogOTApICsgNDUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0UmVuZGVyKCk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tIFwiLi4vdHlwZXMvRGlyZWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5HcmlkIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm93czogbnVtYmVyO1xuICAgIHB1YmxpYyByZWFkb25seSBjb2x1bW5zOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG1hcDogbnVtYmVyW11bXSkge1xuICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMubWFwLmxlbmd0aDsgcm93KyspXG4gICAgICAgIGZvcihsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgdGhpcy5tYXBbcm93XS5sZW5ndGg7IGNvbHVtbisrKSB7XG4gICAgICAgICAgICBpZighdGhpcy5pc1RpbGVXYXRlcihyb3csIGNvbHVtbikpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGZvcihsZXQgZGlyZWN0aW9uID0gMDsgZGlyZWN0aW9uIDwgMzYwOyBkaXJlY3Rpb24gKz0gOTApIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLkVhc3QpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5XZXN0KSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBbcm93XVtjb2x1bW5dID0gMjU1O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBzbG9wZSBhdCBcIiArIHJvdyArIFwiIHggXCIgKyBjb2x1bW4gKyBcIiBhdCBkaXJlY3Rpb24gXCIgKyBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3dzID0gdGhpcy5tYXAubGVuZ3RoO1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBNYXRoLm1heCguLi50aGlzLm1hcC5tYXAoKHJvdykgPT4gcm93Lmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T2Zmc2V0QnlEaXJlY3Rpb24oZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgd2hpbGUoZGlyZWN0aW9uID49IDM2MClcbiAgICAgICAgICAgIGRpcmVjdGlvbiAtPSAzNjA7XG5cbiAgICAgICAgd2hpbGUoZGlyZWN0aW9uIDwgMClcbiAgICAgICAgICAgIGRpcmVjdGlvbiArPSAzNjA7XG5cbiAgICAgICAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uTm9ydGg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAtMSwgY29sdW1uOiAwIH07XG5cbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLk5vcnRoRWFzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IC0xLCBjb2x1bW46IDEgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uRWFzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IDAsIGNvbHVtbjogMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Tb3V0aEVhc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAxLCBjb2x1bW46IDEgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uU291dGg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAxLCBjb2x1bW46IDAgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uU291dGhXZXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogMSwgY29sdW1uOiAtMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5XZXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogMCwgY29sdW1uOiAtMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Ob3J0aFdlc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAtMSwgY29sdW1uOiAtMSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRpbGVCeURpcmVjdGlvbihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldHMgPSB0aGlzLmdldE9mZnNldEJ5RGlyZWN0aW9uKGRpcmVjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdzogcm93ICsgb2Zmc2V0cy5yb3csXG4gICAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIG9mZnNldHMuY29sdW1uXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRUaWxlQnlEaXJlY3Rpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUaWxlV2F0ZXIoY29vcmRpbmF0ZS5yb3csIGNvb3JkaW5hdGUuY29sdW1uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAoIXRoaXMubWFwW3Jvd10gfHwgIXRoaXMubWFwW3Jvd11bY29sdW1uXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzVGlsZUZsYXQocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuaXNUaWxlV2F0ZXIocm93LCBjb2x1bW4pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1hcFtyb3ddW2NvbHVtbl0gIT09IDI1NTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IHRoaXMuZ2V0VGlsZUJ5RGlyZWN0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlzVGlsZUZsYXQoY29vcmRpbmF0ZS5yb3csIGNvb3JkaW5hdGUuY29sdW1uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlU2xvcGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuaXNUaWxlV2F0ZXIocm93LCBjb2x1bW4pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1hcFtyb3ddW2NvbHVtbl0gPT09IDI1NTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldFRpbGVCeURpcmVjdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pc1RpbGVTbG9wZShjb29yZGluYXRlLnJvdywgY29vcmRpbmF0ZS5jb2x1bW4pO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tIFwiLi4vdHlwZXMvRGlyZWN0aW9uXCI7XG5pbXBvcnQgVGVycmFpbkdyaWQgZnJvbSBcIi4vVGVycmFpbkdyaWRcIjtcbmltcG9ydCB7IFRlcnJhaW5UaWxlRGVmaW5pdGlvbiB9IGZyb20gXCIuL3R5cGVzL1RlcnJhaW5UaWxlRGVmaW5pdGlvblwiO1xuaW1wb3J0IHsgVGVycmFpblRpbGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvVGVycmFpblRpbGVUeXBlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5UaWxlcyB7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmluaXRpb25zOiBUZXJyYWluVGlsZURlZmluaXRpb25bXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZ3JpZDogVGVycmFpbkdyaWQpIHtcbiAgICAgICAgdGhpcy5kZWZpbml0aW9ucyA9IHRoaXMuZ2V0VGlsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRpbGVzKCkge1xuICAgICAgICBjb25zdCB0aWxlczogVGVycmFpblRpbGVEZWZpbml0aW9uW10gPSBbXTtcblxuICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuZ3JpZC5yb3dzOyByb3crKylcbiAgICAgICAgZm9yKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPCB0aGlzLmdyaWQuY29sdW1uczsgY29sdW1uKyspIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JpZC5pc1RpbGVXYXRlcihyb3csIGNvbHVtbikpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuZ3JpZC5pc1RpbGVTbG9wZShyb3csIGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNsb3BlIGF0IFwiICsgcm93ICsgXCIgeCBcIiArIGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICBmb3IobGV0IGRpcmVjdGlvbiA9IDQ1OyBkaXJlY3Rpb24gPCAzNjA7IGRpcmVjdGlvbiArPSA5MCkge1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aEVhc3QpKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Tb3V0aEVhc3QpKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkU2xvcGVkVGlsZUhhdmVMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRTbG9wZWRUaWxlTGVmdEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkU2xvcGVkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRTbG9wZWRUaWxlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkU2xvcGVkVGlsZUhhdmVSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0U2xvcGVkVGlsZVJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRTbG9wZWRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRTbG9wZWRUaWxlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZShyb3csIGNvbHVtbiwgRGlyZWN0aW9uLk5vcnRoKSk7XG5cbiAgICAgICAgICAgIGZvcihsZXQgZGlyZWN0aW9uID0gMDsgZGlyZWN0aW9uIDwgMzYwOyBkaXJlY3Rpb24gKz0gOTApIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlTGVmdEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlUmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGlsZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFRpbGVIYXZlTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6ICh0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLldlc3QpKT8oVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKTooVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFRpbGVIYXZlUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlUmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiAodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uU2xvcGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5FYXN0KSk/KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2UpOihUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFRpbGVIYXZlTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIERpcmVjdGlvbi5Ob3J0aEVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSBEaXJlY3Rpb24uRWFzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFRpbGVIYXZlUmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhFYXN0KSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLkVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFRpbGVIYXZlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aFdlc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6ICh0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoV2VzdCkpPyhUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlKTooVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFRpbGVIYXZlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhFYXN0KSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvblNsb3BlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhFYXN0KSk/KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKTooVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2UpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRTbG9wZWRUaWxlSGF2ZUxlZnRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aFdlc3QpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2xvcGVkVGlsZUxlZnRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFNsb3BlZFRpbGVIYXZlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aFdlc3QpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2xvcGVkVGlsZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFNsb3BlZFRpbGVIYXZlUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Tb3V0aEVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2xvcGVkVGlsZVJpZ2h0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoUmlnaHRGbGF0RWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkU2xvcGVkVGlsZUhhdmVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Tb3V0aEVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2xvcGVkVGlsZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZVxuICAgICAgICB9O1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi8uLi90eXBlcy9Qb2ludFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJyYWluQ2FudmFzTW91c2VFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5tb3VzZWRvd24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9mZnNldDogUG9pbnQgPSB7XG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMFxuICAgIH07XG5cbiAgICBwcml2YXRlIGxhc3RNb3VzZVBhZ2VPZmZzZXQ6IFBvaW50ID0ge1xuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0b3A6IDBcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBtb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5sYXN0TW91c2VQYWdlT2Zmc2V0ID0ge1xuICAgICAgICAgICAgbGVmdDogZXZlbnQucGFnZVgsXG4gICAgICAgICAgICB0b3A6IGV2ZW50LnBhZ2VZXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZW1vdmVFdmVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgdGhpcy5tb3VzZXVwRXZlbnQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZXVwRXZlbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbW91c2Vtb3ZlRXZlbnQgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xuICAgIHByaXZhdGUgbW91c2Vtb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSB7XG4gICAgICAgICAgICBsZWZ0OiBldmVudC5wYWdlWCAtIHRoaXMubGFzdE1vdXNlUGFnZU9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgdG9wOiBldmVudC5wYWdlWSAtIHRoaXMubGFzdE1vdXNlUGFnZU9mZnNldC50b3BcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxhc3RNb3VzZVBhZ2VPZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiBldmVudC5wYWdlWCxcbiAgICAgICAgICAgIHRvcDogZXZlbnQucGFnZVlcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm9mZnNldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMub2Zmc2V0LmxlZnQgKyBkaWZmZXJlbmNlLmxlZnQsXG4gICAgICAgICAgICB0b3A6IHRoaXMub2Zmc2V0LnRvcCArIGRpZmZlcmVuY2UudG9wXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHByaXZhdGUgbW91c2V1cEV2ZW50ID0gdGhpcy5tb3VzZXVwLmJpbmQodGhpcyk7XG4gICAgcHJpdmF0ZSBtb3VzZXVwKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlbW92ZUV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgfVxufTtcbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5HcmlkUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSBvZmZzZXQ6IFBvaW50KSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0dyaWQoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAuMDUpXCI7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLm9mZnNldC5sZWZ0LCB0aGlzLm9mZnNldC50b3ApO1xuXG4gICAgICAgIGNvbnN0IHRvcFN0YXJ0ID0gLXRoaXMub2Zmc2V0LnRvcCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LnRvcCAlIHRoaXMuc2l6ZSkgLSB0aGlzLnNpemUpO1xuICAgICAgICBjb25zdCB0b3BFbmQgPSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDtcblxuICAgICAgICBjb25zdCBsZWZ0U3RhcnQgPSAtdGhpcy5vZmZzZXQubGVmdCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LmxlZnQgJSB0aGlzLnNpemUpIC0gdGhpcy5zaXplKTtcbiAgICAgICAgY29uc3QgbGVmdEVuZCA9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7XG5cbiAgICAgICAgZm9yKGxldCB0b3AgPSB0b3BTdGFydDsgdG9wIDwgdG9wRW5kOyB0b3AgKz0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QobGVmdFN0YXJ0LCB0b3AgLSAuNSwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGxlZnQgPSBsZWZ0U3RhcnQ7IGxlZnQgPCBsZWZ0RW5kOyBsZWZ0ICs9IHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KGxlZnQgLSAuNSwgdG9wU3RhcnQsIDEsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi8uLi90eXBlcy9EaXJlY3Rpb25cIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uL3R5cGVzL1BvaW50XCI7XG5pbXBvcnQgeyBTaWRlIH0gZnJvbSBcIi4uLy4uL3R5cGVzL1NpZGVcIjtcbmltcG9ydCB7IFRlcnJhaW5UaWxlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9UZXJyYWluVGlsZVR5cGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpblRpbGVSZW5kZXJlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBoYWxmU2l6ZTogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBlZGdlU2l6ZTogbnVtYmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFsZkVkZ2VTaXplOiBudW1iZXI7XG4gICAgXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlcnJhaW5Db2xvciA9IFwiI0MzRUNCMlwiO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZWRnZUNvbG9yID0gXCIjRkZGMkFGXCI7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlYnVnID0gZmFsc2U7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWJ1Z0Fycm93U2l6ZTogbnVtYmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZGVidWdDb2xvciA9IFwiYmxhY2tcIjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSBvZmZzZXQ6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuaGFsZlNpemUgPSB0aGlzLnNpemUgLyAyO1xuXG4gICAgICAgIHRoaXMuZWRnZVNpemUgPSB0aGlzLnNpemUgKiAwLjI7XG4gICAgICAgIHRoaXMuaGFsZkVkZ2VTaXplID0gdGhpcy5lZGdlU2l6ZSAvIDI7XG5cbiAgICAgICAgdGhpcy5kZWJ1Z0Fycm93U2l6ZSA9IHRoaXMuc2l6ZSAqIDAuMDU7XG4gICAgfTtcblxuICAgIHB1YmxpYyBkcmF3KHR5cGU6IFRlcnJhaW5UaWxlVHlwZSwgcm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGU6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGU6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTbG9wZWRUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoTGVmdEZsYXRFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEFuZ2xlKGRlZ3JlZXM6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKE1hdGguUEkgLyAxODApICogZGVncmVlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRyYW5zZm9ybWF0aW9uKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGVmdCA9IGNvbHVtbiAqIHRoaXMuc2l6ZTtcbiAgICAgICAgY29uc3QgdG9wID0gcm93ICogdGhpcy5zaXplO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUodGhpcy5vZmZzZXQubGVmdCwgdGhpcy5vZmZzZXQudG9wKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZShsZWZ0LCB0b3ApO1xuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yb3RhdGUoKE1hdGguUEkgLyAxODApICogKERpcmVjdGlvbi5Tb3V0aCArIGRpcmVjdGlvbikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0RlYnVnVGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKHRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmRlYnVnQ29sb3I7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIERpcmVjdGlvbi5Tb3V0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChgUm93ICR7cm93fWAsIDAsIDApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJoYW5naW5nXCI7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoYENvbHVtbiAke2NvbHVtbn1gLCAwLCAwKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgZHJhd0RlYnVnQXJyb3cocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZih0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5kZWJ1Z0NvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoMCwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKC10aGlzLmRlYnVnQXJyb3dTaXplLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oMCwgdGhpcy5kZWJ1Z0Fycm93U2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuZGVidWdBcnJvd1NpemUsIDApO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMudGVycmFpbkNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoLXRoaXMuaGFsZlNpemUsIC10aGlzLmhhbGZTaXplLCB0aGlzLnNpemUsIHRoaXMuc2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdEZWJ1Z1RpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbiwgc2lkZTogU2lkZSwgZ2FwOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG5cbiAgICAgICAgaWYoc2lkZSA9PT0gU2lkZS5MZWZ0KVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUgLSBnYXAsIHRoaXMuZWRnZVNpemUpO1xuICAgICAgICBlbHNlIGlmKHNpZGUgPT09IFNpZGUuUmlnaHQpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoLXRoaXMuaGFsZlNpemUgKyBnYXAsIHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUgLSBnYXAsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLkxlZnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuUmlnaHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSg0NSksIHRoaXMuZ2V0QW5nbGUoNDUgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSg5MCksIHRoaXMuZ2V0QW5nbGUoOTAgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5MZWZ0LCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmRyYXdMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuUmlnaHQsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuZHJhd1JpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMZWZ0T3V0c2lkZUNvcm5lckVkZ2UoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMudGVycmFpbkNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuaGFsZlNpemUgLSAodGhpcy5oYWxmRWRnZVNpemUgKiAxLjUpLCB0aGlzLmhhbGZTaXplICsgKHRoaXMuaGFsZkVkZ2VTaXplICogMS41KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSAtICh0aGlzLmhhbGZFZGdlU2l6ZSAqIDQpLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYyh0aGlzLmhhbGZTaXplIC0gKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5oYWxmU2l6ZSArICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoLTkwKSwgdGhpcy5nZXRBbmdsZSgtNDUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1JpZ2h0T3V0c2lkZUNvcm5lckVkZ2UoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMudGVycmFpbkNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKC10aGlzLmhhbGZTaXplICsgKHRoaXMuaGFsZkVkZ2VTaXplICogNCksIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKC10aGlzLmhhbGZTaXplICsgKHRoaXMuaGFsZkVkZ2VTaXplICogMiksIHRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbygtdGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyAodGhpcy5lZGdlU2l6ZSAqIDIpLCB0aGlzLmhhbGZTaXplICsgKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSgxODAgKyA0NSksIHRoaXMuZ2V0QW5nbGUoMjcwKSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMuZHJhd0xlZnRPdXRzaWRlQ29ybmVyRWRnZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuTGVmdCwgdGhpcy5lZGdlU2l6ZSAqIDIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMuZHJhd1JpZ2h0T3V0c2lkZUNvcm5lckVkZ2UoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLlJpZ2h0LCB0aGlzLmVkZ2VTaXplICogMik7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKC10aGlzLmhhbGZTaXplLCAtdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSwgLXRoaXMuaGFsZlNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdEZWJ1Z1RpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTbG9wZWRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24sIHNpZGU6IFNpZGUsIGdhcDogbnVtYmVyID0gMCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuXG4gICAgICAgIGlmKHNpZGUgPT09IFNpZGUuTGVmdClcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAtdGhpcy5oYWxmRWRnZVNpemUgKyAxLjUsIHRoaXMuc2l6ZSAqIC43NSAtIGdhcCwgdGhpcy5lZGdlU2l6ZSk7XG4gICAgICAgIGVsc2UgaWYoc2lkZSA9PT0gU2lkZS5SaWdodClcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSAqIDEuNSArIChnYXAgKiAxKSwgLXRoaXMuaGFsZkVkZ2VTaXplICsgMS41LCB0aGlzLnNpemUgKiAuNzUgLSBnYXAsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlV2l0aExlZnRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5MZWZ0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5SaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3U2xvcGVkTGVmdE91dHNpZGVDb3JuZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJvdGF0ZSh0aGlzLmdldEFuZ2xlKDE4MCkpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoLXRoaXMuZWRnZVNpemUgKiAxICsgNCwgLXRoaXMuZWRnZVNpemUgKiAzIC0yKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYygtdGhpcy5oYWxmU2l6ZSArIHRoaXMuZWRnZVNpemUsIHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDQ1ICsgNDUpLCB0aGlzLmdldEFuZ2xlKCg0NSArIDQ1KSArIDQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGRyYXdTbG9wZWRSaWdodE91dHNpZGVDb3JuZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5lZGdlU2l6ZSArIDEsIDMpXG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSgxODAgKyA0NSksIHRoaXMuZ2V0QW5nbGUoKDE4MCArIDQ1KSArIDQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5SaWdodCwgdGhpcy5lZGdlU2l6ZSk7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZFJpZ2h0T3V0c2lkZUNvcm5lcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLkxlZnQsIHRoaXMuZWRnZVNpemUpXG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZExlZnRPdXRzaWRlQ29ybmVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi8uLi90eXBlcy9Qb2ludFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJyYWluV2F0ZXJSZW5kZXJlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3V2F0ZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwiI0FBREFGRlwiO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcbn1cbiIsImV4cG9ydCBlbnVtIFRlcnJhaW5UaWxlVHlwZSB7XG4gICAgRmxhdFRpbGUsXG4gICAgXG4gICAgRmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlLFxuICAgIEZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2UsXG4gICAgXG4gICAgRmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2UsXG4gICAgRmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlLFxuICAgIFxuICAgIEZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZSxcbiAgICBGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlLFxuICAgIFxuICAgIFNsb3BlZFRpbGUsXG4gICAgXG4gICAgU2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2UsXG4gICAgU2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlLFxuXG4gICAgU2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlLFxuICAgIFNsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlXG59O1xuIiwiZXhwb3J0IGVudW0gRGlyZWN0aW9uIHtcbiAgICBOb3J0aCA9IDAsXG4gICAgTm9ydGhFYXN0ID0gTm9ydGggKyA0NSxcbiAgICBcbiAgICBFYXN0ID0gOTAsXG4gICAgU291dGhFYXN0ID0gRWFzdCArIDQ1LFxuXG4gICAgU291dGggPSAxODAsXG4gICAgU291dGhXZXN0ID0gU291dGggKyA0NSxcblxuICAgIFdlc3QgPSAyNzAsXG4gICAgTm9ydGhXZXN0ID0gV2VzdCArIDQ1XG59XG4iLCJleHBvcnQgZW51bSBTaWRlIHtcbiAgICBMZWZ0LFxuICAgIFJpZ2h0XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=