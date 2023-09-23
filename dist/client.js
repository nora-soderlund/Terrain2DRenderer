/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game/GameCanvas.ts":
/*!********************************!*\
  !*** ./src/game/GameCanvas.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const GameCanvasMouseEvents_1 = __importDefault(__webpack_require__(/*! ./events/GameCanvasMouseEvents */ "./src/game/events/GameCanvasMouseEvents.ts"));
class GameCanvas {
    constructor(canvasEntities = []) {
        this.canvasEntities = canvasEntities;
        this.element = document.createElement("canvas");
        this.mouseEvents = new GameCanvasMouseEvents_1.default(this.element);
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
        const offset = {
            left: this.mouseEvents.offset.left,
            top: this.mouseEvents.offset.top
        };
        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);
        const context = this.element.getContext("2d");
        for (let canvasEntity of this.canvasEntities) {
            context.save();
            canvasEntity.draw(context, offset);
            context.restore();
        }
        this.requestRender();
    }
    ;
}
exports["default"] = GameCanvas;
;


/***/ }),

/***/ "./src/game/events/GameCanvasMouseEvents.ts":
/*!**************************************************!*\
  !*** ./src/game/events/GameCanvasMouseEvents.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class GameCanvasMouseEvents {
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
exports["default"] = GameCanvasMouseEvents;
;


/***/ }),

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
const GameCanvas_1 = __importDefault(__webpack_require__(/*! ./game/GameCanvas */ "./src/game/GameCanvas.ts"));
const TerrainCanvas_1 = __importDefault(__webpack_require__(/*! ./terrain/TerrainCanvas */ "./src/terrain/TerrainCanvas.ts"));
const TerrainGrid_1 = __importDefault(__webpack_require__(/*! ./terrain/TerrainGrid */ "./src/terrain/TerrainGrid.ts"));
const TerrainTiles_1 = __importDefault(__webpack_require__(/*! ./terrain/TerrainTiles */ "./src/terrain/TerrainTiles.ts"));
const testTerrainGrid = new TerrainGrid_1.default([
    [1, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 1, 0, 0]
]);
const sweden = [
    "Sweden_Blekinge.json",
    "Sweden_Dalarna.json",
    "Sweden_Gävleborg.json",
    "Sweden_Gotland.json",
    "Sweden_Halland.json",
    "Sweden_Jämtland.json",
    "Sweden_Jönköping.json",
    "Sweden_Kalmar.json",
    "Sweden_Kronoberg.json",
    "Sweden_Norrbotten.json",
    "Sweden_Orebro.json",
    "Sweden_Östergötland.json",
    "Sweden_Skåne.json",
    "Sweden_Södermanland.json",
    "Sweden_Stockholm.json",
    "Sweden_Uppsala.json",
    "Sweden_Värmland.json",
    "Sweden_Västerbotten.json",
    "Sweden_Västernorrland.json",
    "Sweden_Västmanland.json",
    "Sweden_Västra_Götaland.json"
];
(() => __awaiter(void 0, void 0, void 0, function* () {
    const terrainGrid = yield TerrainGrid_1.default.fromAsset("sweden/Sweden_Västra_Götaland.json");
    const terrainGrids = (yield Promise.all(sweden.map((asset) => {
        return TerrainGrid_1.default.fromAsset("sweden/" + asset);
    })));
    const terrainTilesCollection = terrainGrids.map((terrainGrid) => {
        const terrainTiles = new TerrainTiles_1.default(terrainGrid);
        return terrainTiles;
    });
    const terrainCanvas = new TerrainCanvas_1.default(terrainTilesCollection, 50);
    const gameCanvas = new GameCanvas_1.default([terrainCanvas]);
    document.body.append(gameCanvas.element);
    //document.body.append(new TerrainDebugCanvas(100).element);
}))();


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
const TerrainGridRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainGridRenderer */ "./src/terrain/renderers/TerrainGridRenderer.ts"));
const TerrainTileRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainTileRenderer */ "./src/terrain/renderers/TerrainTileRenderer.ts"));
const TerrainWaterRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainWaterRenderer */ "./src/terrain/renderers/TerrainWaterRenderer.ts"));
class TerrainCanvas {
    constructor(tiles, size) {
        this.tiles = tiles;
        this.size = size;
        this.element = document.createElement("canvas");
        this.rows = Math.max(...tiles.map((tiles) => tiles.grid.rows));
        this.columns = Math.max(...tiles.map((tiles) => tiles.grid.columns));
        this.render();
    }
    ;
    draw(context, offset) {
        context.drawImage(this.element, 0, 0, this.element.width, this.element.height, offset.left, offset.top, this.element.width, this.element.height);
    }
    ;
    requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    }
    ;
    render() {
        this.element.width = this.columns * this.size;
        this.element.height = this.rows * this.size;
        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);
        const context = this.element.getContext("2d");
        const offset = {
            left: 0,
            top: 0
        };
        const terrainWaterRenderer = new TerrainWaterRenderer_1.default(context);
        terrainWaterRenderer.drawWater();
        const terrainGridRenderer = new TerrainGridRenderer_1.default(context, this.size, offset);
        terrainGridRenderer.drawGrid();
        const terrainTileRenderer = new TerrainTileRenderer_1.default(context, this.size, offset);
        for (let tiles of this.tiles) {
            for (let tileDefinition of tiles.definitions) {
                terrainTileRenderer.draw(tileDefinition.type, tileDefinition.row, tileDefinition.column, tileDefinition.direction);
            }
            for (let tileDefinition of tiles.definitions) {
                terrainTileRenderer.drawDebugArrow(tileDefinition.row, tileDefinition.column, tileDefinition.direction);
            }
        }
    }
    ;
}
exports["default"] = TerrainCanvas;
;


/***/ }),

/***/ "./src/terrain/TerrainGrid.ts":
/*!************************************!*\
  !*** ./src/terrain/TerrainGrid.ts ***!
  \************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../types/Direction */ "./src/types/Direction.ts");
class TerrainGrid {
    static fromAsset(assetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("assets/" + assetName);
            const result = yield response.json();
            return new this(result);
        });
    }
    constructor(map) {
        this.map = map;
        for (let row = 0; row < map.length; row++)
            this.map[row] = [0, ...map[row], 0];
        this.map.unshift([]);
        this.map.push([]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWUsUUFtQjFCO0FBQUEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNuQkYsSUFBWSxTQVlYO0FBWkQsV0FBWSxTQUFTO0lBQ2pCLDJDQUFTO0lBQ1Qsb0RBQXNCO0lBRXRCLDBDQUFTO0lBQ1QscURBQXFCO0lBRXJCLDZDQUFXO0lBQ1gscURBQXNCO0lBRXRCLDJDQUFVO0lBQ1YscURBQXFCO0FBQ3pCLENBQUMsRUFaVyxTQUFTLHlCQUFULFNBQVMsUUFZcEI7Ozs7Ozs7Ozs7Ozs7O0FDWkQsSUFBWSxJQUdYO0FBSEQsV0FBWSxJQUFJO0lBQ1osK0JBQUk7SUFDSixpQ0FBSztBQUNULENBQUMsRUFIVyxJQUFJLG9CQUFKLElBQUksUUFHZjs7Ozs7OztVQ0hEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2dhbWUvR2FtZUNhbnZhcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2dhbWUvZXZlbnRzL0dhbWVDYW52YXNNb3VzZUV2ZW50cy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdGVycmFpbi9UZXJyYWluQ2FudmFzLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdGVycmFpbi9UZXJyYWluR3JpZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vVGVycmFpblRpbGVzLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdGVycmFpbi9yZW5kZXJlcnMvVGVycmFpbkdyaWRSZW5kZXJlci50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vcmVuZGVyZXJzL1RlcnJhaW5UaWxlUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL3JlbmRlcmVycy9UZXJyYWluV2F0ZXJSZW5kZXJlci50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vdHlwZXMvVGVycmFpblRpbGVUeXBlLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdHlwZXMvRGlyZWN0aW9uLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdHlwZXMvU2lkZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RlcnJhaW4vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzIGZyb20gXCIuL2V2ZW50cy9HYW1lQ2FudmFzTW91c2VFdmVudHNcIjtcbmltcG9ydCBHYW1lQ2FudmFzRW50aXR5IGZyb20gXCIuL3R5cGVzL0dhbWVDYW52YXNFbnRpdHlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNhbnZhcyB7XG4gICAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbW91c2VFdmVudHMgPSBuZXcgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzKHRoaXMuZWxlbWVudCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNhbnZhc0VudGl0aWVzOiBHYW1lQ2FudmFzRW50aXR5W10gPSBbXSkge1xuICAgICAgICB0aGlzLnJlcXVlc3RSZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHJlcXVlc3RSZW5kZXIoKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBib3VuZHMud2lkdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBib3VuZHMuaGVpZ2h0O1xuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICB0b3A6IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LnRvcFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vdGhpcy5vZmZzZXQubGVmdCA9ICAtIE1hdGguZmxvb3IoKHRoaXMudGlsZXMuZ3JpZC5jb2x1bW5zICogdGhpcy5zaXplKSAvIDIpO1xuICAgICAgICAvL3RoaXMub2Zmc2V0LnRvcCA9ICAtIE1hdGguZmxvb3IoKHRoaXMudGlsZXMuZ3JpZC5yb3dzICogdGhpcy5zaXplKSAvIDIpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpITtcblxuICAgICAgICBmb3IobGV0IGNhbnZhc0VudGl0eSBvZiB0aGlzLmNhbnZhc0VudGl0aWVzKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNhdmUoKTtcblxuICAgICAgICAgICAgY2FudmFzRW50aXR5LmRyYXcoY29udGV4dCwgb2Zmc2V0KTtcblxuICAgICAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlcXVlc3RSZW5kZXIoKTtcbiAgICB9O1xufTtcbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDYW52YXNNb3VzZUV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBlbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm1vdXNlZG93bi5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb2Zmc2V0OiBQb2ludCA9IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgfTtcblxuICAgIHByaXZhdGUgbGFzdE1vdXNlUGFnZU9mZnNldDogUG9pbnQgPSB7XG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMFxuICAgIH07XG5cbiAgICBwcml2YXRlIG1vdXNlZG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmxhc3RNb3VzZVBhZ2VPZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiBldmVudC5wYWdlWCxcbiAgICAgICAgICAgIHRvcDogZXZlbnQucGFnZVlcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlbW92ZUV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3VzZW1vdmVFdmVudCA9IHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcyk7XG4gICAgcHJpdmF0ZSBtb3VzZW1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYIC0gdGhpcy5sYXN0TW91c2VQYWdlT2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICB0b3A6IGV2ZW50LnBhZ2VZIC0gdGhpcy5sYXN0TW91c2VQYWdlT2Zmc2V0LnRvcFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGFzdE1vdXNlUGFnZU9mZnNldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYLFxuICAgICAgICAgICAgdG9wOiBldmVudC5wYWdlWVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMub2Zmc2V0ID0ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5vZmZzZXQubGVmdCArIGRpZmZlcmVuY2UubGVmdCxcbiAgICAgICAgICAgIHRvcDogdGhpcy5vZmZzZXQudG9wICsgZGlmZmVyZW5jZS50b3BcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBtb3VzZXVwRXZlbnQgPSB0aGlzLm1vdXNldXAuYmluZCh0aGlzKTtcbiAgICBwcml2YXRlIG1vdXNldXAoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2Vtb3ZlRXZlbnQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMubW91c2V1cEV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMubW91c2V1cEV2ZW50KTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IEdhbWVDYW52YXMgZnJvbSBcIi4vZ2FtZS9HYW1lQ2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkNhbnZhcyBmcm9tIFwiLi90ZXJyYWluL1RlcnJhaW5DYW52YXNcIjtcbmltcG9ydCBUZXJyYWluRGVidWdDYW52YXMgZnJvbSBcIi4vdGVycmFpbi9UZXJyYWluRGVidWdDYW52YXNcIjtcbmltcG9ydCBUZXJyYWluR3JpZCBmcm9tIFwiLi90ZXJyYWluL1RlcnJhaW5HcmlkXCI7XG5pbXBvcnQgVGVycmFpblRpbGVzIGZyb20gXCIuL3RlcnJhaW4vVGVycmFpblRpbGVzXCI7XG5cbmNvbnN0IHRlc3RUZXJyYWluR3JpZCA9IG5ldyBUZXJyYWluR3JpZChbXG4gIFsgMSwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCBdLFxuICBbIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDAgXSxcbiAgWyAwLCAwLCAxLCAxLCAxLCAwLCAxLCAxLCAxIF0sXG4gIFsgMCwgMCwgMCwgMSwgMCwgMSwgMSwgMSwgMSBdLFxuICBbIDAsIDAsIDEsIDEsIDEsIDAsIDEsIDAsIDAgXVxuXSk7XG5cbmNvbnN0IHN3ZWRlbiA9IFtcbiAgXCJTd2VkZW5fQmxla2luZ2UuanNvblwiLFxuICBcIlN3ZWRlbl9EYWxhcm5hLmpzb25cIixcbiAgXCJTd2VkZW5fR8OkdmxlYm9yZy5qc29uXCIsXG4gIFwiU3dlZGVuX0dvdGxhbmQuanNvblwiLFxuICBcIlN3ZWRlbl9IYWxsYW5kLmpzb25cIixcbiAgXCJTd2VkZW5fSsOkbXRsYW5kLmpzb25cIixcbiAgXCJTd2VkZW5fSsO2bmvDtnBpbmcuanNvblwiLFxuICBcIlN3ZWRlbl9LYWxtYXIuanNvblwiLFxuICBcIlN3ZWRlbl9Lcm9ub2JlcmcuanNvblwiLFxuICBcIlN3ZWRlbl9Ob3JyYm90dGVuLmpzb25cIixcbiAgXCJTd2VkZW5fT3JlYnJvLmpzb25cIixcbiAgXCJTd2VkZW5fw5ZzdGVyZ8O2dGxhbmQuanNvblwiLFxuICBcIlN3ZWRlbl9Ta8OlbmUuanNvblwiLFxuICBcIlN3ZWRlbl9Tw7ZkZXJtYW5sYW5kLmpzb25cIixcbiAgXCJTd2VkZW5fU3RvY2tob2xtLmpzb25cIixcbiAgXCJTd2VkZW5fVXBwc2FsYS5qc29uXCIsXG4gIFwiU3dlZGVuX1bDpHJtbGFuZC5qc29uXCIsXG4gIFwiU3dlZGVuX1bDpHN0ZXJib3R0ZW4uanNvblwiLFxuICBcIlN3ZWRlbl9Ww6RzdGVybm9ycmxhbmQuanNvblwiLFxuICBcIlN3ZWRlbl9Ww6RzdG1hbmxhbmQuanNvblwiLFxuICBcIlN3ZWRlbl9Ww6RzdHJhX0fDtnRhbGFuZC5qc29uXCJcbl07XG5cbihhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHRlcnJhaW5HcmlkID0gYXdhaXQgVGVycmFpbkdyaWQuZnJvbUFzc2V0KFwic3dlZGVuL1N3ZWRlbl9Ww6RzdHJhX0fDtnRhbGFuZC5qc29uXCIpO1xuXG4gIGNvbnN0IHRlcnJhaW5HcmlkcyA9IChhd2FpdCBQcm9taXNlLmFsbChzd2VkZW4ubWFwKChhc3NldCkgPT4ge1xuICAgIHJldHVybiBUZXJyYWluR3JpZC5mcm9tQXNzZXQoXCJzd2VkZW4vXCIgKyBhc3NldCk7XG4gIH0pKSk7XG4gIFxuICBjb25zdCB0ZXJyYWluVGlsZXNDb2xsZWN0aW9uID0gdGVycmFpbkdyaWRzLm1hcCgodGVycmFpbkdyaWQpID0+IHtcbiAgICBjb25zdCB0ZXJyYWluVGlsZXMgPSBuZXcgVGVycmFpblRpbGVzKHRlcnJhaW5HcmlkKTtcbiAgIFxuICAgIHJldHVybiB0ZXJyYWluVGlsZXM7XG4gIH0pO1xuXG4gIGNvbnN0IHRlcnJhaW5DYW52YXMgPSBuZXcgVGVycmFpbkNhbnZhcyh0ZXJyYWluVGlsZXNDb2xsZWN0aW9uLCA1MCk7XG4gIFxuICBjb25zdCBnYW1lQ2FudmFzID0gbmV3IEdhbWVDYW52YXMoWyB0ZXJyYWluQ2FudmFzIF0pO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGdhbWVDYW52YXMuZWxlbWVudCk7XG4gIC8vZG9jdW1lbnQuYm9keS5hcHBlbmQobmV3IFRlcnJhaW5EZWJ1Z0NhbnZhcygxMDApLmVsZW1lbnQpO1xufSkoKTtcbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi90eXBlcy9EaXJlY3Rpb25cIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3R5cGVzL1BvaW50XCI7XG5pbXBvcnQgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzIGZyb20gXCIuLi9nYW1lL2V2ZW50cy9HYW1lQ2FudmFzTW91c2VFdmVudHNcIjtcbmltcG9ydCBUZXJyYWluR3JpZCBmcm9tIFwiLi9UZXJyYWluR3JpZFwiO1xuaW1wb3J0IFRlcnJhaW5HcmlkUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5HcmlkUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluVGlsZVJlbmRlcmVyIGZyb20gXCIuL3JlbmRlcmVycy9UZXJyYWluVGlsZVJlbmRlcmVyXCI7XG5pbXBvcnQgVGVycmFpbldhdGVyUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5XYXRlclJlbmRlcmVyXCI7XG5pbXBvcnQgVGVycmFpblRpbGVzIGZyb20gXCIuL1RlcnJhaW5UaWxlc1wiO1xuaW1wb3J0IEdhbWVDYW52YXNFbnRpdHkgZnJvbSBcIi4uL2dhbWUvdHlwZXMvR2FtZUNhbnZhc0VudGl0eVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJyYWluQ2FudmFzIGltcGxlbWVudHMgR2FtZUNhbnZhc0VudGl0eSB7XG4gICAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSByb3dzOiBudW1iZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2x1bW5zOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRpbGVzOiBUZXJyYWluVGlsZXNbXSwgcHJpdmF0ZSByZWFkb25seSBzaXplOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yb3dzID0gTWF0aC5tYXgoLi4udGlsZXMubWFwKCh0aWxlcykgPT4gdGlsZXMuZ3JpZC5yb3dzKSk7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IE1hdGgubWF4KC4uLnRpbGVzLm1hcCgodGlsZXMpID0+IHRpbGVzLmdyaWQuY29sdW1ucykpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBkcmF3KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgb2Zmc2V0OiBQb2ludCk6IHZvaWQge1xuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgICAwLCAwLCB0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQsXG4gICAgICAgICAgICBvZmZzZXQubGVmdCwgb2Zmc2V0LnRvcCwgdGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXF1ZXN0UmVuZGVyKCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LndpZHRoID0gdGhpcy5jb2x1bW5zICogdGhpcy5zaXplO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5yb3dzICogdGhpcy5zaXplO1xuXG4gICAgICAgIC8vdGhpcy5vZmZzZXQubGVmdCA9ICAtIE1hdGguZmxvb3IoKHRoaXMudGlsZXMuZ3JpZC5jb2x1bW5zICogdGhpcy5zaXplKSAvIDIpO1xuICAgICAgICAvL3RoaXMub2Zmc2V0LnRvcCA9ICAtIE1hdGguZmxvb3IoKHRoaXMudGlsZXMuZ3JpZC5yb3dzICogdGhpcy5zaXplKSAvIDIpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpITtcblxuICAgICAgICBjb25zdCBvZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGVycmFpbldhdGVyUmVuZGVyZXIgPSBuZXcgVGVycmFpbldhdGVyUmVuZGVyZXIoY29udGV4dCk7XG4gICAgICAgIHRlcnJhaW5XYXRlclJlbmRlcmVyLmRyYXdXYXRlcigpO1xuXG4gICAgICAgIGNvbnN0IHRlcnJhaW5HcmlkUmVuZGVyZXIgPSBuZXcgVGVycmFpbkdyaWRSZW5kZXJlcihjb250ZXh0LCB0aGlzLnNpemUsIG9mZnNldCk7XG4gICAgICAgIHRlcnJhaW5HcmlkUmVuZGVyZXIuZHJhd0dyaWQoKTtcblxuICAgICAgICBjb25zdCB0ZXJyYWluVGlsZVJlbmRlcmVyID0gbmV3IFRlcnJhaW5UaWxlUmVuZGVyZXIoY29udGV4dCwgdGhpcy5zaXplLCBvZmZzZXQpO1xuXG4gICAgICAgIGZvcihsZXQgdGlsZXMgb2YgdGhpcy50aWxlcykge1xuICAgICAgICAgICAgZm9yKGxldCB0aWxlRGVmaW5pdGlvbiBvZiB0aWxlcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhdyh0aWxlRGVmaW5pdGlvbi50eXBlLCB0aWxlRGVmaW5pdGlvbi5yb3csIHRpbGVEZWZpbml0aW9uLmNvbHVtbiwgdGlsZURlZmluaXRpb24uZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGxldCB0aWxlRGVmaW5pdGlvbiBvZiB0aWxlcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd0RlYnVnQXJyb3codGlsZURlZmluaXRpb24ucm93LCB0aWxlRGVmaW5pdGlvbi5jb2x1bW4sIHRpbGVEZWZpbml0aW9uLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi90eXBlcy9EaXJlY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbkdyaWQge1xuICAgIHB1YmxpYyByZWFkb25seSByb3dzOiBudW1iZXI7XG4gICAgcHVibGljIHJlYWRvbmx5IGNvbHVtbnM6IG51bWJlcjtcblxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZnJvbUFzc2V0KGFzc2V0TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJhc3NldHMvXCIgKyBhc3NldE5hbWUpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKHJlc3VsdCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBtYXA6IG51bWJlcltdW10pIHtcbiAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCBtYXAubGVuZ3RoOyByb3crKylcbiAgICAgICAgICAgIHRoaXMubWFwW3Jvd10gPSBbIDAsIC4uLm1hcFtyb3ddLCAwIF07XG5cbiAgICAgICAgdGhpcy5tYXAudW5zaGlmdChbXSk7XG4gICAgICAgIHRoaXMubWFwLnB1c2goW10pO1xuXG4gICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5tYXAubGVuZ3RoOyByb3crKylcbiAgICAgICAgZm9yKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPCB0aGlzLm1hcFtyb3ddLmxlbmd0aDsgY29sdW1uKyspIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLmlzVGlsZVdhdGVyKHJvdywgY29sdW1uKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgZm9yKGxldCBkaXJlY3Rpb24gPSAwOyBkaXJlY3Rpb24gPCAzNjA7IGRpcmVjdGlvbiArPSA5MCkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uRWFzdCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uU291dGgpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLldlc3QpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGgpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLm1hcFtyb3ddW2NvbHVtbl0gPSAyNTU7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kIHNsb3BlIGF0IFwiICsgcm93ICsgXCIgeCBcIiArIGNvbHVtbiArIFwiIGF0IGRpcmVjdGlvbiBcIiArIGRpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvd3MgPSB0aGlzLm1hcC5sZW5ndGg7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IE1hdGgubWF4KC4uLnRoaXMubWFwLm1hcCgocm93KSA9PiByb3cubGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPZmZzZXRCeURpcmVjdGlvbihkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB3aGlsZShkaXJlY3Rpb24gPj0gMzYwKVxuICAgICAgICAgICAgZGlyZWN0aW9uIC09IDM2MDtcblxuICAgICAgICB3aGlsZShkaXJlY3Rpb24gPCAwKVxuICAgICAgICAgICAgZGlyZWN0aW9uICs9IDM2MDtcblxuICAgICAgICBzd2l0Y2goZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Ob3J0aDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IC0xLCBjb2x1bW46IDAgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uTm9ydGhFYXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogLTEsIGNvbHVtbjogMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5FYXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogMCwgY29sdW1uOiAxIH07XG5cbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLlNvdXRoRWFzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IDEsIGNvbHVtbjogMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Tb3V0aDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IDEsIGNvbHVtbjogMCB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Tb3V0aFdlc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAxLCBjb2x1bW46IC0xIH07XG5cbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLldlc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAwLCBjb2x1bW46IC0xIH07XG5cbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLk5vcnRoV2VzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IC0xLCBjb2x1bW46IC0xIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VGlsZUJ5RGlyZWN0aW9uKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0cyA9IHRoaXMuZ2V0T2Zmc2V0QnlEaXJlY3Rpb24oZGlyZWN0aW9uKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93OiByb3cgKyBvZmZzZXRzLnJvdyxcbiAgICAgICAgICAgIGNvbHVtbjogY29sdW1uICsgb2Zmc2V0cy5jb2x1bW5cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldFRpbGVCeURpcmVjdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pc1RpbGVXYXRlcihjb29yZGluYXRlLnJvdywgY29vcmRpbmF0ZS5jb2x1bW4pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1RpbGVXYXRlcihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuICghdGhpcy5tYXBbcm93XSB8fCAhdGhpcy5tYXBbcm93XVtjb2x1bW5dKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlRmxhdChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpIHtcbiAgICAgICAgaWYodGhpcy5pc1RpbGVXYXRlcihyb3csIGNvbHVtbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWFwW3Jvd11bY29sdW1uXSAhPT0gMjU1O1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1RpbGVCeURpcmVjdGlvbkZsYXQocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRUaWxlQnlEaXJlY3Rpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUaWxlRmxhdChjb29yZGluYXRlLnJvdywgY29vcmRpbmF0ZS5jb2x1bW4pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1RpbGVTbG9wZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpIHtcbiAgICAgICAgaWYodGhpcy5pc1RpbGVXYXRlcihyb3csIGNvbHVtbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWFwW3Jvd11bY29sdW1uXSA9PT0gMjU1O1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1RpbGVCeURpcmVjdGlvblNsb3BlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IHRoaXMuZ2V0VGlsZUJ5RGlyZWN0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlzVGlsZVNsb3BlKGNvb3JkaW5hdGUucm93LCBjb29yZGluYXRlLmNvbHVtbik7XG4gICAgfVxufTtcbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi90eXBlcy9EaXJlY3Rpb25cIjtcbmltcG9ydCBUZXJyYWluR3JpZCBmcm9tIFwiLi9UZXJyYWluR3JpZFwiO1xuaW1wb3J0IHsgVGVycmFpblRpbGVEZWZpbml0aW9uIH0gZnJvbSBcIi4vdHlwZXMvVGVycmFpblRpbGVEZWZpbml0aW9uXCI7XG5pbXBvcnQgeyBUZXJyYWluVGlsZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9UZXJyYWluVGlsZVR5cGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpblRpbGVzIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmaW5pdGlvbnM6IFRlcnJhaW5UaWxlRGVmaW5pdGlvbltdO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGdyaWQ6IFRlcnJhaW5HcmlkKSB7XG4gICAgICAgIHRoaXMuZGVmaW5pdGlvbnMgPSB0aGlzLmdldFRpbGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaWxlcygpIHtcbiAgICAgICAgY29uc3QgdGlsZXM6IFRlcnJhaW5UaWxlRGVmaW5pdGlvbltdID0gW107XG5cbiAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQucm93czsgcm93KyspXG4gICAgICAgIGZvcihsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgdGhpcy5ncmlkLmNvbHVtbnM7IGNvbHVtbisrKSB7XG4gICAgICAgICAgICBpZih0aGlzLmdyaWQuaXNUaWxlV2F0ZXIocm93LCBjb2x1bW4pKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZih0aGlzLmdyaWQuaXNUaWxlU2xvcGUocm93LCBjb2x1bW4pKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzbG9wZSBhdCBcIiArIHJvdyArIFwiIHggXCIgKyBjb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgZm9yKGxldCBkaXJlY3Rpb24gPSA0NTsgZGlyZWN0aW9uIDwgMzYwOyBkaXJlY3Rpb24gKz0gOTApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhFYXN0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uU291dGhFYXN0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRTbG9wZWRUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcblxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFNsb3BlZFRpbGVIYXZlTGVmdEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0U2xvcGVkVGlsZUxlZnRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcblxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFNsb3BlZFRpbGVIYXZlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0U2xvcGVkVGlsZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcblxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFNsb3BlZFRpbGVIYXZlUmlnaHRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGVSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkU2xvcGVkVGlsZUhhdmVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0U2xvcGVkVGlsZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGUocm93LCBjb2x1bW4sIERpcmVjdGlvbi5Ob3J0aCkpO1xuXG4gICAgICAgICAgICBmb3IobGV0IGRpcmVjdGlvbiA9IDA7IGRpcmVjdGlvbiA8IDM2MDsgZGlyZWN0aW9uICs9IDkwKSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlUmlnaHRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbGVzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRUaWxlSGF2ZUxlZnRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiAodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uU2xvcGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5XZXN0KSk/KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZSk6KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2UpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRUaWxlSGF2ZVJpZ2h0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvblNsb3BlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uRWFzdCkpPyhUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlKTooVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2UpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRUaWxlSGF2ZUxlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSBEaXJlY3Rpb24uTm9ydGhFYXN0KSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gRGlyZWN0aW9uLkVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRUaWxlSGF2ZVJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5FYXN0KSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZih0aGlzLnNob3VsZFRpbGVIYXZlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRUaWxlSGF2ZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhXZXN0KSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiAodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uU2xvcGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aFdlc3QpKT8oVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZSk6KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2UpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6ICh0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoRWFzdCkpPyhUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZSk6KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2xvcGVkVGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkU2xvcGVkVGlsZUhhdmVMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZih0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhXZXN0KSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNsb3BlZFRpbGVMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoTGVmdEZsYXRFZGdlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRTbG9wZWRUaWxlSGF2ZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhXZXN0KSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNsb3BlZFRpbGVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRTbG9wZWRUaWxlSGF2ZVJpZ2h0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZih0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uU291dGhFYXN0KSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNsb3BlZFRpbGVSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFNsb3BlZFRpbGVIYXZlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uU291dGhFYXN0KSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNsb3BlZFRpbGVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2VcbiAgICAgICAgfTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vLi4vdHlwZXMvUG9pbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbkdyaWRSZW5kZXJlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHByaXZhdGUgcmVhZG9ubHkgc2l6ZTogbnVtYmVyLCBwcml2YXRlIHJlYWRvbmx5IG9mZnNldDogUG9pbnQpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3R3JpZCgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIC4wNSlcIjtcblxuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMub2Zmc2V0LmxlZnQsIHRoaXMub2Zmc2V0LnRvcCk7XG5cbiAgICAgICAgY29uc3QgdG9wU3RhcnQgPSAtdGhpcy5vZmZzZXQudG9wICsgTWF0aC5mbG9vcigodGhpcy5vZmZzZXQudG9wICUgdGhpcy5zaXplKSAtIHRoaXMuc2l6ZSk7XG4gICAgICAgIGNvbnN0IHRvcEVuZCA9IHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAgIGNvbnN0IGxlZnRTdGFydCA9IC10aGlzLm9mZnNldC5sZWZ0ICsgTWF0aC5mbG9vcigodGhpcy5vZmZzZXQubGVmdCAlIHRoaXMuc2l6ZSkgLSB0aGlzLnNpemUpO1xuICAgICAgICBjb25zdCBsZWZ0RW5kID0gdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aDtcblxuICAgICAgICBmb3IobGV0IHRvcCA9IHRvcFN0YXJ0OyB0b3AgPCB0b3BFbmQ7IHRvcCArPSB0aGlzLnNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdChsZWZ0U3RhcnQsIHRvcCAtIC41LCB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgbGVmdCA9IGxlZnRTdGFydDsgbGVmdCA8IGxlZnRFbmQ7IGxlZnQgKz0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QobGVmdCAtIC41LCB0b3BTdGFydCwgMSwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSBcIi4uLy4uL3R5cGVzL0RpcmVjdGlvblwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vLi4vdHlwZXMvUG9pbnRcIjtcbmltcG9ydCB7IFNpZGUgfSBmcm9tIFwiLi4vLi4vdHlwZXMvU2lkZVwiO1xuaW1wb3J0IHsgVGVycmFpblRpbGVUeXBlIH0gZnJvbSBcIi4uL3R5cGVzL1RlcnJhaW5UaWxlVHlwZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJyYWluVGlsZVJlbmRlcmVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGhhbGZTaXplOiBudW1iZXI7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGVkZ2VTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBoYWxmRWRnZVNpemU6IG51bWJlcjtcbiAgICBcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgdGVycmFpbkNvbG9yID0gXCIjQzNFQ0IyXCI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBlZGdlQ29sb3IgPSBcIiNGRkYyQUZcIjtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGVidWcgPSBmYWxzZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlYnVnQXJyb3dTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWJ1Z0NvbG9yID0gXCJibGFja1wiO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHByaXZhdGUgcmVhZG9ubHkgc2l6ZTogbnVtYmVyLCBwcml2YXRlIHJlYWRvbmx5IG9mZnNldDogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5oYWxmU2l6ZSA9IHRoaXMuc2l6ZSAvIDI7XG5cbiAgICAgICAgdGhpcy5lZGdlU2l6ZSA9IHRoaXMuc2l6ZSAqIDAuMjtcbiAgICAgICAgdGhpcy5oYWxmRWRnZVNpemUgPSB0aGlzLmVkZ2VTaXplIC8gMjtcblxuICAgICAgICB0aGlzLmRlYnVnQXJyb3dTaXplID0gdGhpcy5zaXplICogMC4wNTtcbiAgICB9O1xuXG4gICAgcHVibGljIGRyYXcodHlwZTogVGVycmFpblRpbGVUeXBlLCByb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTbG9wZWRUaWxlV2l0aExlZnRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTbG9wZWRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QW5nbGUoZGVncmVlczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5QSSAvIDE4MCkgKiBkZWdyZWVzO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0VHJhbnNmb3JtYXRpb24ocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IG51bWJlcikge1xuICAgICAgICBjb25zdCBsZWZ0ID0gY29sdW1uICogdGhpcy5zaXplO1xuICAgICAgICBjb25zdCB0b3AgPSByb3cgKiB0aGlzLnNpemU7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLm9mZnNldC5sZWZ0LCB0aGlzLm9mZnNldC50b3ApO1xuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKGxlZnQsIHRvcCk7XG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUodGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJvdGF0ZSgoTWF0aC5QSSAvIDE4MCkgKiAoRGlyZWN0aW9uLlNvdXRoICsgZGlyZWN0aW9uKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3RGVidWdUaWxlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZGVidWdDb2xvcjtcblxuICAgICAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgRGlyZWN0aW9uLlNvdXRoKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KGBSb3cgJHtyb3d9YCwgMCwgMCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcImhhbmdpbmdcIjtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChgQ29sdW1uICR7Y29sdW1ufWAsIDAsIDApO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBkcmF3RGVidWdBcnJvdyhyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKHRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgXG4gICAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmRlYnVnQ29sb3I7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSgwLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oLXRoaXMuZGVidWdBcnJvd1NpemUsIDApO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbygwLCB0aGlzLmRlYnVnQXJyb3dTaXplKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5kZWJ1Z0Fycm93U2l6ZSwgMCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSwgLXRoaXMuaGFsZlNpemUsIHRoaXMuc2l6ZSwgdGhpcy5zaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd0RlYnVnVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uLCBzaWRlOiBTaWRlLCBnYXA6IG51bWJlciA9IDApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcblxuICAgICAgICBpZihzaWRlID09PSBTaWRlLkxlZnQpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgdGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSAtIGdhcCwgdGhpcy5lZGdlU2l6ZSk7XG4gICAgICAgIGVsc2UgaWYoc2lkZSA9PT0gU2lkZS5SaWdodClcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSArIGdhcCwgdGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSAtIGdhcCwgdGhpcy5lZGdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuTGVmdCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5SaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGVmdEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmModGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUsIHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDQ1KSwgdGhpcy5nZXRBbmdsZSg0NSArIDQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1JpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYygtdGhpcy5oYWxmU2l6ZSArIHRoaXMuZWRnZVNpemUsIHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDkwKSwgdGhpcy5nZXRBbmdsZSg5MCArIDQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLkxlZnQsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuZHJhd0xlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5SaWdodCwgdGhpcy5lZGdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5kcmF3UmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xlZnRPdXRzaWRlQ29ybmVyRWRnZSgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8odGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSAtICh0aGlzLmhhbGZFZGdlU2l6ZSAqIDEuNSksIHRoaXMuaGFsZlNpemUgKyAodGhpcy5oYWxmRWRnZVNpemUgKiAxLjUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmhhbGZTaXplIC0gKHRoaXMuaGFsZkVkZ2VTaXplICogNCksIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKHRoaXMuaGFsZlNpemUgLSAodGhpcy5lZGdlU2l6ZSAqIDIpLCB0aGlzLmhhbGZTaXplICsgKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSgtOTApLCB0aGlzLmdldEFuZ2xlKC00NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3UmlnaHRPdXRzaWRlQ29ybmVyRWRnZSgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oLXRoaXMuaGFsZlNpemUgKyAodGhpcy5oYWxmRWRnZVNpemUgKiA0KSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oLXRoaXMuaGFsZlNpemUgKyAodGhpcy5oYWxmRWRnZVNpemUgKiAyKSwgdGhpcy5oYWxmU2l6ZSArIHRoaXMuZWRnZVNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKC10aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYygtdGhpcy5oYWxmU2l6ZSArICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuaGFsZlNpemUgKyAodGhpcy5lZGdlU2l6ZSAqIDIpLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDE4MCArIDQ1KSwgdGhpcy5nZXRBbmdsZSgyNzApKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICAgICAgdGhpcy5kcmF3TGVmdE91dHNpZGVDb3JuZXJFZGdlKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICAgICAgdGhpcy5kcmF3RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5MZWZ0LCB0aGlzLmVkZ2VTaXplICogMik7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICAgICAgdGhpcy5kcmF3UmlnaHRPdXRzaWRlQ29ybmVyRWRnZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuUmlnaHQsIHRoaXMuZWRnZVNpemUgKiAyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnRlcnJhaW5Db2xvcjtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oLXRoaXMuaGFsZlNpemUsIC10aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmhhbGZTaXplLCAtdGhpcy5oYWxmU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd0RlYnVnVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1Nsb3BlZEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbiwgc2lkZTogU2lkZSwgZ2FwOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG5cbiAgICAgICAgaWYoc2lkZSA9PT0gU2lkZS5MZWZ0KVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIC10aGlzLmhhbGZFZGdlU2l6ZSArIDEuNSwgdGhpcy5zaXplICogLjc1IC0gZ2FwLCB0aGlzLmVkZ2VTaXplKTtcbiAgICAgICAgZWxzZSBpZihzaWRlID09PSBTaWRlLlJpZ2h0KVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KC10aGlzLmhhbGZTaXplICogMS41ICsgKGdhcCAqIDEpLCAtdGhpcy5oYWxmRWRnZVNpemUgKyAxLjUsIHRoaXMuc2l6ZSAqIC43NSAtIGdhcCwgdGhpcy5lZGdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLkxlZnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3U2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLlJpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTbG9wZWRMZWZ0T3V0c2lkZUNvcm5lcihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucm90YXRlKHRoaXMuZ2V0QW5nbGUoMTgwKSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5lZGdlU2l6ZSAqIDEgKyA0LCAtdGhpcy5lZGdlU2l6ZSAqIDMgLTIpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKC10aGlzLmhhbGZTaXplICsgdGhpcy5lZGdlU2l6ZSwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUsIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoNDUgKyA0NSksIHRoaXMuZ2V0QW5nbGUoKDQ1ICsgNDUpICsgNDUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgZHJhd1Nsb3BlZFJpZ2h0T3V0c2lkZUNvcm5lcihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKC10aGlzLmVkZ2VTaXplICsgMSwgMylcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYygtdGhpcy5oYWxmU2l6ZSArIHRoaXMuZWRnZVNpemUsIHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDE4MCArIDQ1KSwgdGhpcy5nZXRBbmdsZSgoMTgwICsgNDUpICsgNDUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBkcmF3U2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLlJpZ2h0LCB0aGlzLmVkZ2VTaXplKTtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkUmlnaHRPdXRzaWRlQ29ybmVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3U2xvcGVkVGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdTbG9wZWRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuTGVmdCwgdGhpcy5lZGdlU2l6ZSlcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkTGVmdE91dHNpZGVDb3JuZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgfVxufSIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5XYXRlclJlbmRlcmVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuXG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdXYXRlcigpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCIjQUFEQUZGXCI7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9O1xufVxuIiwiZXhwb3J0IGVudW0gVGVycmFpblRpbGVUeXBlIHtcbiAgICBGbGF0VGlsZSxcbiAgICBcbiAgICBGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2UsXG4gICAgRmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZSxcbiAgICBcbiAgICBGbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZSxcbiAgICBGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2UsXG4gICAgXG4gICAgRmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlLFxuICAgIEZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2UsXG4gICAgXG4gICAgU2xvcGVkVGlsZSxcbiAgICBcbiAgICBTbG9wZWRUaWxlV2l0aExlZnRGbGF0RWRnZSxcbiAgICBTbG9wZWRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2UsXG5cbiAgICBTbG9wZWRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2UsXG4gICAgU2xvcGVkVGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Vcbn07XG4iLCJleHBvcnQgZW51bSBEaXJlY3Rpb24ge1xuICAgIE5vcnRoID0gMCxcbiAgICBOb3J0aEVhc3QgPSBOb3J0aCArIDQ1LFxuICAgIFxuICAgIEVhc3QgPSA5MCxcbiAgICBTb3V0aEVhc3QgPSBFYXN0ICsgNDUsXG5cbiAgICBTb3V0aCA9IDE4MCxcbiAgICBTb3V0aFdlc3QgPSBTb3V0aCArIDQ1LFxuXG4gICAgV2VzdCA9IDI3MCxcbiAgICBOb3J0aFdlc3QgPSBXZXN0ICsgNDVcbn1cbiIsImV4cG9ydCBlbnVtIFNpZGUge1xuICAgIExlZnQsXG4gICAgUmlnaHRcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==