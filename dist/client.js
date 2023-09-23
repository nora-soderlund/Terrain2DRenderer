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
    const terrainGrid = new TerrainGrid_1.default([
        [1, 0, 1, 1, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 0, 1, 0, 0]
    ]);
    document.body.append(new TerrainCanvas_1.default(terrainGrid, 100).element);
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
const TerrainCanvasMouseEvents_1 = __importDefault(__webpack_require__(/*! ./TerrainCanvasMouseEvents */ "./src/terrain/TerrainCanvasMouseEvents.ts"));
const TerrainGridRenderer_1 = __importDefault(__webpack_require__(/*! ./TerrainGridRenderer */ "./src/terrain/TerrainGridRenderer.ts"));
const TerrainRenderer_1 = __importDefault(__webpack_require__(/*! ./TerrainRenderer */ "./src/terrain/TerrainRenderer.ts"));
const TerrainWaterRenderer_1 = __importDefault(__webpack_require__(/*! ./TerrainWaterRenderer */ "./src/terrain/TerrainWaterRenderer.ts"));
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
        const terrainRenderer = new TerrainRenderer_1.default(context, this.size, this.offset);
        for (let direction = 0; direction < 4; direction++) {
            terrainRenderer.drawFlatTile(1 + (direction * 2), 0, direction * 90);
            terrainRenderer.drawFlatTileWithFlatEdge(1 + (direction * 2), 2, direction * 90);
            terrainRenderer.drawFlatTileWithRightInsideCornerEdge(1 + (direction * 2), 4, direction * 90);
            terrainRenderer.drawFlatTileWithLeftOutsideCornerEdge(1 + (direction * 2), 6, direction * 90);
            terrainRenderer.drawFlatTileWithRightOutsideCornerEdge(1 + (direction * 2), 8, direction * 90);
            terrainRenderer.drawFlatTileWithOutsideCornerEdge(1 + (direction * 2), 10, direction * 90);
            terrainRenderer.drawSlopedTileWithFlatEdge(1 + (direction * 2), 12, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithOutsideCornerEdge(1 + (direction * 2), 14, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithLeftOutsideCornerEdge(1 + (direction * 2), 16, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithRightOutsideCornerEdge(1 + (direction * 2), 18, (direction * 90) + 45);
        }
        this.requestRender();
    }
    ;
}
exports["default"] = TerrainCanvas;
;


/***/ }),

/***/ "./src/terrain/TerrainCanvasMouseEvents.ts":
/*!*************************************************!*\
  !*** ./src/terrain/TerrainCanvasMouseEvents.ts ***!
  \*************************************************/
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

/***/ "./src/terrain/TerrainDebugCanvas.ts":
/*!*******************************************!*\
  !*** ./src/terrain/TerrainDebugCanvas.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const TerrainCanvasMouseEvents_1 = __importDefault(__webpack_require__(/*! ./TerrainCanvasMouseEvents */ "./src/terrain/TerrainCanvasMouseEvents.ts"));
const TerrainGridRenderer_1 = __importDefault(__webpack_require__(/*! ./TerrainGridRenderer */ "./src/terrain/TerrainGridRenderer.ts"));
const TerrainRenderer_1 = __importDefault(__webpack_require__(/*! ./TerrainRenderer */ "./src/terrain/TerrainRenderer.ts"));
const TerrainWaterRenderer_1 = __importDefault(__webpack_require__(/*! ./TerrainWaterRenderer */ "./src/terrain/TerrainWaterRenderer.ts"));
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
        this.offset.left = this.mouseEvents.offset.left + 100;
        this.offset.top = this.mouseEvents.offset.top;
        const context = this.element.getContext("2d");
        const terrainWaterRenderer = new TerrainWaterRenderer_1.default(context);
        terrainWaterRenderer.drawWater();
        const terrainGridRenderer = new TerrainGridRenderer_1.default(context, this.size, this.offset);
        terrainGridRenderer.drawGrid();
        const terrainRenderer = new TerrainRenderer_1.default(context, this.size, this.offset);
        for (let direction = 0; direction < 4; direction++) {
            terrainRenderer.drawFlatTile(1 + (direction * 2), 0, direction * 90);
            terrainRenderer.drawFlatTileWithFlatEdge(1 + (direction * 2), 2, direction * 90);
            terrainRenderer.drawFlatTileWithRightInsideCornerEdge(1 + (direction * 2), 4, direction * 90);
            terrainRenderer.drawFlatTileWithLeftOutsideCornerEdge(1 + (direction * 2), 6, direction * 90);
            terrainRenderer.drawFlatTileWithRightOutsideCornerEdge(1 + (direction * 2), 8, direction * 90);
            terrainRenderer.drawFlatTileWithOutsideCornerEdge(1 + (direction * 2), 10, direction * 90);
            terrainRenderer.drawSlopedTileWithFlatEdge(1 + (direction * 2), 12, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithOutsideCornerEdge(1 + (direction * 2), 14, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithLeftOutsideCornerEdge(1 + (direction * 2), 16, (direction * 90) + 45);
            terrainRenderer.drawSlopedTileWithRightOutsideCornerEdge(1 + (direction * 2), 18, (direction * 90) + 45);
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
    constructor(pattern) {
        this.pattern = pattern;
        this.rows = this.pattern.length;
        this.columns = Math.max(...this.pattern.map((row) => row.length));
    }
    isNorthTileWater(row, column) {
        return (!this.pattern[row - 1] || !this.pattern[row - 1][column]);
    }
    isEastTileWater(row, column) {
        return (!this.pattern[row] || !this.pattern[row][column + 1]);
    }
    isWestTileWater(row, column) {
        return (!this.pattern[row] || !this.pattern[row][column - 1]);
    }
    isSouthTileWater(row, column) {
        return (!this.pattern[row + 1] || !this.pattern[row + 1][column]);
    }
    getTiles() {
        const items = [];
        for (let row = 0; row < this.rows; row++)
            for (let column = 0; column < this.pattern[row].length; column++) {
                if (!this.pattern[row][column])
                    continue;
                items.push({
                    row,
                    column,
                    direction: Direction_1.Direction.North
                });
            }
        return items;
    }
    getInnerEdgeCorners() {
        const items = [];
        for (let row = 0; row < this.rows; row++)
            for (let column = 0; column < this.pattern[row].length; column++) {
                if (this.pattern[row][column])
                    continue;
                if (!this.isSouthTileWater(row, column) && !this.isEastTileWater(row, column)) {
                    items.push({
                        row: row + 1,
                        column: column + 1,
                        direction: Direction_1.Direction.NorthWest
                    });
                }
                if (!this.isSouthTileWater(row, column) && !this.isWestTileWater(row, column)) {
                    items.push({
                        row: row + 1,
                        column: column - 1,
                        direction: Direction_1.Direction.NorthEast
                    });
                }
                if (!this.isNorthTileWater(row, column) && !this.isEastTileWater(row, column)) {
                    items.push({
                        row: row - 1,
                        column: column + 1,
                        direction: Direction_1.Direction.SouthWest
                    });
                }
                if (!this.isNorthTileWater(row, column) && !this.isWestTileWater(row, column)) {
                    items.push({
                        row: row - 1,
                        column: column - 1,
                        direction: Direction_1.Direction.SouthEast
                    });
                }
            }
        return items;
    }
    getOuterEdges() {
        const items = [];
        const connectors = [];
        for (let row = 0; row < this.rows; row++)
            for (let column = 0; column < this.pattern[row].length; column++) {
                if (!this.pattern[row][column])
                    continue;
                if (this.isNorthTileWater(row, column)) {
                    if (this.isWestTileWater(row - 1, column) || !this.isEastTileWater(row - 1, column)) {
                        items.push({
                            row: row - 1,
                            column,
                            direction: Direction_1.Direction.North
                        });
                        if (!this.isEastTileWater(row, column) && this.isEastTileWater(row - 1, column)) {
                            connectors.push({
                                row: row - 1,
                                column,
                                direction: Direction_1.Direction.North
                            });
                        }
                    }
                }
                if (this.isSouthTileWater(row, column)) {
                    items.push({
                        row: row + 1,
                        column,
                        direction: Direction_1.Direction.South
                    });
                    if (!this.isWestTileWater(row, column) && this.isWestTileWater(row + 1, column)) {
                        connectors.push({
                            row: row + 1,
                            column,
                            direction: Direction_1.Direction.South
                        });
                    }
                }
                if (this.isEastTileWater(row, column)) {
                    if (this.isEastTileWater(row + 1, column) || !this.isEastTileWater(row, column + 1)) {
                        items.push({
                            row,
                            column: column + 1,
                            direction: Direction_1.Direction.East
                        });
                        if (!this.isSouthTileWater(row, column) && this.isEastTileWater(row + 1, column)) {
                            connectors.push({
                                row,
                                column: column + 1,
                                direction: Direction_1.Direction.East
                            });
                        }
                    }
                    else {
                        items.push({
                            row,
                            column: column + 1,
                            direction: Direction_1.Direction.NorthEast
                        });
                    }
                }
                if (this.isWestTileWater(row, column)) {
                    items.push({
                        row,
                        column: column - 1,
                        direction: Direction_1.Direction.West
                    });
                    if (!this.isNorthTileWater(row, column) && this.isNorthTileWater(row, column - 1)) {
                        connectors.push({
                            row,
                            column: column - 1,
                            direction: Direction_1.Direction.West
                        });
                    }
                }
            }
        return {
            items,
            connectors
        };
    }
    ;
    getOuterEdgeCorners() {
        const items = [];
        for (let row = 0; row < this.rows; row++)
            for (let column = 0; column < this.pattern[row].length; column++) {
                if (!this.pattern[row][column])
                    continue;
                if ((this.isNorthTileWater(row, column)) && (this.isEastTileWater(row, column))) {
                    if (this.isEastTileWater(row - 1, column)) {
                        if (!this.isSouthTileWater(row, column + 1) && this.isEastTileWater(row, column + 1)) {
                            items.push({
                                row: row - 1,
                                column: column + 1,
                                direction: Direction_1.Direction.NorthEast,
                                angle: 45
                            });
                        }
                        else {
                            items.push({
                                row: row - 1,
                                column: column + 1,
                                direction: Direction_1.Direction.NorthEast,
                                angle: 90
                            });
                        }
                    }
                }
                if ((this.isNorthTileWater(row, column)) && (this.isWestTileWater(row, column))) {
                    if (this.isWestTileWater(row - 1, column)) {
                        items.push({
                            row: row - 1,
                            column: column - 1,
                            direction: Direction_1.Direction.NorthWest,
                            angle: 90
                        });
                    }
                }
                if ((this.isSouthTileWater(row, column)) && (this.isEastTileWater(row, column))) {
                    if (this.isEastTileWater(row + 1, column)) {
                        items.push({
                            row: row + 1,
                            column: column + 1,
                            direction: Direction_1.Direction.SouthEast,
                            angle: 90
                        });
                    }
                }
                if ((this.isSouthTileWater(row, column)) && (this.isWestTileWater(row, column))) {
                    if (this.isWestTileWater(row + 1, column)) {
                        items.push({
                            row: row + 1,
                            column: column - 1,
                            direction: Direction_1.Direction.SouthWest,
                            angle: 90
                        });
                    }
                }
            }
        return items;
    }
}
exports["default"] = TerrainGrid;
;


/***/ }),

/***/ "./src/terrain/TerrainGridRenderer.ts":
/*!********************************************!*\
  !*** ./src/terrain/TerrainGridRenderer.ts ***!
  \********************************************/
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

/***/ "./src/terrain/TerrainRenderer.ts":
/*!****************************************!*\
  !*** ./src/terrain/TerrainRenderer.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../types/Direction */ "./src/types/Direction.ts");
class TerrainRenderer {
    constructor(context, size, offset) {
        this.context = context;
        this.size = size;
        this.offset = offset;
        this.terrainColor = "#C3ECB2";
        this.edgeColor = "#FFF2AF";
        this.debug = true;
        this.debugColor = "black";
        this.halfSize = this.size / 2;
        this.edgeSize = this.size * 0.2;
        this.halfEdgeSize = this.edgeSize / 2;
        this.debugArrowSize = this.size * 0.05;
    }
    ;
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
    drawFlatTile(row, column, direction) {
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.terrainColor;
        this.context.fillRect(-this.halfSize, -this.halfSize, this.size, this.size);
        this.context.restore();
        this.drawDebugTile(row, column, direction);
    }
    drawFlatTileWithFlatEdge(row, column, direction) {
        this.drawFlatTile(row, column, direction);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize, this.halfSize, this.size, this.edgeSize);
        this.context.restore();
    }
    drawFlatTileWithRightInsideCornerEdge(row, column, direction) {
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
        this.drawFlatTile(row, column, direction);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.drawLeftOutsideCornerEdge();
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize, this.halfSize, this.size - (this.edgeSize * 2), this.edgeSize);
        this.context.restore();
    }
    drawFlatTileWithRightOutsideCornerEdge(row, column, direction) {
        this.drawFlatTile(row, column, direction);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.drawRightOutsideCornerEdge();
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize + (this.edgeSize * 2), this.halfSize, this.size - (this.edgeSize * 2), this.edgeSize);
        this.context.restore();
    }
    drawFlatTileWithOutsideCornerEdge(row, column, direction) {
        this.drawFlatTile(row, column, direction);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.drawLeftOutsideCornerEdge();
        this.drawRightOutsideCornerEdge();
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize + (this.edgeSize * 2), this.halfSize, this.size - (this.edgeSize * 4), this.edgeSize);
        this.context.restore();
    }
    drawSlopedTile(row, column, direction) {
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
    drawSlopedTileWithFlatEdge(row, column, direction) {
        this.drawSlopedTile(row, column, direction - 45);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-this.halfSize * 1.5, -this.halfEdgeSize + 1.5, this.size * 1.5, this.edgeSize);
        this.context.restore();
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
    drawSlopedTileWithOutsideCornerEdge(row, column, direction) {
        this.drawSlopedTile(row, column, direction - 45);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-(this.halfSize * 1.5) + this.edgeSize, -this.halfEdgeSize + (this.halfEdgeSize * .2), (this.size * 1.5) - (this.edgeSize * 2) - 4, this.edgeSize);
        this.context.restore();
        this.drawSlopedLeftOutsideCorner(row, column, direction);
        this.drawSlopedRightOutsideCorner(row, column, direction);
    }
    drawSlopedTileWithRightOutsideCornerEdge(row, column, direction) {
        this.drawSlopedTile(row, column, direction - 45);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-(this.halfSize * 1.5) + this.edgeSize, -this.halfEdgeSize + (this.halfEdgeSize * .2), (this.size * 1.5) - this.edgeSize - 4, this.edgeSize);
        this.context.restore();
        this.drawSlopedRightOutsideCorner(row, column, direction);
    }
    drawSlopedTileWithLeftOutsideCornerEdge(row, column, direction) {
        this.drawSlopedTile(row, column, direction - 45);
        this.context.save();
        this.setTransformation(row, column, direction);
        this.context.fillStyle = this.edgeColor;
        this.context.fillRect(-(this.halfSize * 1.5), -this.halfEdgeSize + (this.halfEdgeSize * .2), (this.size * 1.5) - this.edgeSize - 4, this.edgeSize);
        this.context.restore();
        this.drawSlopedLeftOutsideCorner(row, column, direction);
    }
}
exports["default"] = TerrainRenderer;


/***/ }),

/***/ "./src/terrain/TerrainWaterRenderer.ts":
/*!*********************************************!*\
  !*** ./src/terrain/TerrainWaterRenderer.ts ***!
  \*********************************************/
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUVqRixlQUFlLENBQUMscUNBQXFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFOUYsZUFBZSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzlGLGVBQWUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMvRixlQUFlLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFM0YsZUFBZSxDQUFDLDBCQUEwQixDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFM0YsZUFBZSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDcEcsZUFBZSxDQUFDLHVDQUF1QyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEcsZUFBZSxDQUFDLHdDQUF3QyxDQUFDLENBQUMsR0FBRyxDQUFDLFNB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TyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO1FBRTlDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFMUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFMUMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFFMUMsS0FBSSxJQUFJLEdBQUcsR0FBRyxRQUFRLEVBQUUsR0FBRyxHQUFHLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDNUU7UUFFRCxLQUFJLElBQUksSUFBSSxHQUFHLFNBQVMsRUFBRSxJQUFJLEdBQUcsT0FBTyxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3pELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3RTtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUFBLENBQUM7Q0FDTDtBQTVCRCx5Q0E0QkM7Ozs7Ozs7Ozs7Ozs7QUM5QkQsOEZBQStDO0FBRy9DLE1BQXFCLGVBQWU7SUFjaEMsWUFBNkIsT0FBaUMsRUFBbUIsSUFBWSxFQUFtQixNQUFhO1FBQWhHLFlBQU8sR0FBUCxPQUFPLENBQTBCO1FBQW1CLFNBQUksR0FBSixJQUFJLENBQVE7UUFBbUIsV0FBTSxHQUFOLE1BQU0sQ0FBTztRQVA1RyxpQkFBWSxHQUFHLFNBQVMsQ0FBQztRQUN6QixjQUFTLEdBQUcsU0FBUyxDQUFDO1FBRXRCLFVBQUssR0FBRyxJQUFJLENBQUM7UUFFYixlQUFVLEdBQUcsT0FBTyxDQUFDO1FBR2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFFOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDM0MsQ0FBQztJQUFBLENBQUM7SUFFTSxRQUFRLENBQUMsT0FBZTtRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUVPLGlCQUFpQixDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBaUI7UUFDcEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRU8sYUFBYSxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBb0I7UUFDbkUsSUFBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBRTNDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXpELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUV0QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUV6QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxxQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXJELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUVsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7WUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWhELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVLLFlBQVksQ0FBQyxHQUFXLEVBQUUsTUFBYyxFQUFFLFNBQW9CO1FBQ2pFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSx3QkFBd0IsQ0FBQyxHQUFXLEVBQUUsTUFBYyxFQUFFLFNBQW9CO1FBQzdFLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUxQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU0scUNBQXFDLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxTQUFvQjtRQUMxRixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU8seUJBQXlCO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4SixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTywwQkFBMEI7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLHFDQUFxQyxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBb0I7UUFDMUYsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFFakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU0sc0NBQXNDLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxTQUFvQjtRQUMzRixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUVsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU0saUNBQWlDLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxTQUFvQjtRQUN0RixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUVsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU8sY0FBYyxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBb0I7UUFDcEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBRTNDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sMEJBQTBCLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxTQUFvQjtRQUMvRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRWpELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUV4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVPLDJCQUEyQixDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBb0I7UUFDakYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQztRQUV0RSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBQUEsQ0FBQztJQUVNLDRCQUE0QixDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBb0I7UUFDbEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBQUEsQ0FBQztJQUVLLG1DQUFtQyxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBb0I7UUFDeEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV6SyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFTSx3Q0FBd0MsQ0FBQyxHQUFXLEVBQUUsTUFBYyxFQUFFLFNBQW9CO1FBQzdGLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRXhDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRW5LLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVNLHVDQUF1QyxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsU0FBb0I7UUFDNUYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRW5KLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNKO0FBcFRELHFDQW9UQzs7Ozs7Ozs7Ozs7OztBQ3JURCxNQUFxQixvQkFBb0I7SUFDckMsWUFBNkIsT0FBaUM7UUFBakMsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7SUFFOUQsQ0FBQztJQUVNLFNBQVM7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFBQSxDQUFDO0NBQ0w7QUFiRCwwQ0FhQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxJQUFZLFNBWVg7QUFaRCxXQUFZLFNBQVM7SUFDakIsMkNBQVM7SUFDVCxvREFBc0I7SUFFdEIsMENBQVM7SUFDVCxxREFBcUI7SUFFckIsNkNBQVc7SUFDWCxxREFBc0I7SUFFdEIsMkNBQVU7SUFDVixxREFBcUI7QUFDekIsQ0FBQyxFQVpXLFNBQVMseUJBQVQsU0FBUyxRQVlwQjs7Ozs7OztVQ1pEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdGVycmFpbi9UZXJyYWluQ2FudmFzLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdGVycmFpbi9UZXJyYWluQ2FudmFzTW91c2VFdmVudHMudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL1RlcnJhaW5EZWJ1Z0NhbnZhcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vVGVycmFpbkdyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL1RlcnJhaW5HcmlkUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90ZXJyYWluL1RlcnJhaW5SZW5kZXJlci50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL3RlcnJhaW4vVGVycmFpbldhdGVyUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy90eXBlcy9EaXJlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlcnJhaW5DYW52YXMgZnJvbSBcIi4vdGVycmFpbi9UZXJyYWluQ2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkRlYnVnQ2FudmFzIGZyb20gXCIuL3RlcnJhaW4vVGVycmFpbkRlYnVnQ2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkdyaWQgZnJvbSBcIi4vdGVycmFpbi9UZXJyYWluR3JpZFwiO1xuXG5mZXRjaChcImFzc2V0cy9zd2VkZW4uanNvblwiKS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgY29uc3QgdGVycmFpbkdyaWQgPSBuZXcgVGVycmFpbkdyaWQoW1xuICAgIFsgMSwgMCwgMSwgMSwgMSwgMCwgMSwgMCwgMCBdLFxuICAgIFsgMCwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMCBdLFxuICAgIFsgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMSwgMSBdLFxuICAgIFsgMCwgMCwgMCwgMSwgMCwgMSwgMSwgMSwgMSBdLFxuICAgIFsgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMCwgMCBdXG4gIF0pO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG5ldyBUZXJyYWluQ2FudmFzKHRlcnJhaW5HcmlkLCAxMDApLmVsZW1lbnQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChuZXcgVGVycmFpbkRlYnVnQ2FudmFzKDEwMCkuZWxlbWVudCk7XG59KTtcbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi90eXBlcy9EaXJlY3Rpb25cIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3R5cGVzL1BvaW50XCI7XG5pbXBvcnQgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzIGZyb20gXCIuL1RlcnJhaW5DYW52YXNNb3VzZUV2ZW50c1wiO1xuaW1wb3J0IFRlcnJhaW5HcmlkIGZyb20gXCIuL1RlcnJhaW5HcmlkXCI7XG5pbXBvcnQgVGVycmFpbkdyaWRSZW5kZXJlciBmcm9tIFwiLi9UZXJyYWluR3JpZFJlbmRlcmVyXCI7XG5pbXBvcnQgVGVycmFpblJlbmRlcmVyIGZyb20gXCIuL1RlcnJhaW5SZW5kZXJlclwiO1xuaW1wb3J0IFRlcnJhaW5XYXRlclJlbmRlcmVyIGZyb20gXCIuL1RlcnJhaW5XYXRlclJlbmRlcmVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5DYW52YXMge1xuICAgIHB1YmxpYyByZWFkb25seSBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblxuICAgIHByaXZhdGUgb2Zmc2V0OiBQb2ludCA9IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgfTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgbW91c2VFdmVudHMgPSBuZXcgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzKHRoaXMuZWxlbWVudCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGdyaWQ6IFRlcnJhaW5HcmlkLCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJlcXVlc3RSZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXF1ZXN0UmVuZGVyKCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IGJvdW5kcy53aWR0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IGJvdW5kcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5vZmZzZXQubGVmdCA9IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LmxlZnQgKyBNYXRoLmZsb29yKHRoaXMuZWxlbWVudC53aWR0aCAvIDIpIC0gTWF0aC5mbG9vcigodGhpcy5ncmlkLmNvbHVtbnMgKiB0aGlzLnNpemUpIC8gMik7XG4gICAgICAgIHRoaXMub2Zmc2V0LnRvcCA9IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LnRvcCArIE1hdGguZmxvb3IodGhpcy5lbGVtZW50LmhlaWdodCAvIDIpIC0gTWF0aC5mbG9vcigodGhpcy5ncmlkLnJvd3MgKiB0aGlzLnNpemUpIC8gMik7XG5cbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuZWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIikhO1xuXG5cbiAgICAgICAgY29uc3QgdGVycmFpbldhdGVyUmVuZGVyZXIgPSBuZXcgVGVycmFpbldhdGVyUmVuZGVyZXIoY29udGV4dCk7XG4gICAgICAgIHRlcnJhaW5XYXRlclJlbmRlcmVyLmRyYXdXYXRlcigpO1xuXG4gICAgICAgIGNvbnN0IHRlcnJhaW5HcmlkUmVuZGVyZXIgPSBuZXcgVGVycmFpbkdyaWRSZW5kZXJlcihjb250ZXh0LCB0aGlzLnNpemUsIHRoaXMub2Zmc2V0KTtcbiAgICAgICAgdGVycmFpbkdyaWRSZW5kZXJlci5kcmF3R3JpZCgpO1xuXG4gICAgICAgIGNvbnN0IHRlcnJhaW5SZW5kZXJlciA9IG5ldyBUZXJyYWluUmVuZGVyZXIoY29udGV4dCwgdGhpcy5zaXplLCB0aGlzLm9mZnNldCk7XG5cbiAgICAgICAgZm9yKGxldCBkaXJlY3Rpb24gPSAwOyBkaXJlY3Rpb24gPCA0OyBkaXJlY3Rpb24rKykge1xuICAgICAgICAgICAgdGVycmFpblJlbmRlcmVyLmRyYXdGbGF0VGlsZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAwLCBkaXJlY3Rpb24gKiA5MCk7XG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aEZsYXRFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDIsIGRpcmVjdGlvbiAqIDkwKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGVycmFpblJlbmRlcmVyLmRyYXdGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgNCwgZGlyZWN0aW9uICogOTApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCA2LCBkaXJlY3Rpb24gKiA5MCk7XG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgOCwgZGlyZWN0aW9uICogOTApO1xuICAgICAgICAgICAgdGVycmFpblJlbmRlcmVyLmRyYXdGbGF0VGlsZVdpdGhPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAxMCwgZGlyZWN0aW9uICogOTApO1xuXG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd1Nsb3BlZFRpbGVXaXRoRmxhdEVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgMTIsIChkaXJlY3Rpb24gKiA5MCkgKyA0NSk7XG5cbiAgICAgICAgICAgIHRlcnJhaW5SZW5kZXJlci5kcmF3U2xvcGVkVGlsZVdpdGhPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAxNCwgKGRpcmVjdGlvbiAqIDkwKSArIDQ1KTtcbiAgICAgICAgICAgIHRlcnJhaW5SZW5kZXJlci5kcmF3U2xvcGVkVGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgMTYsIChkaXJlY3Rpb24gKiA5MCkgKyA0NSk7XG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAxOCwgKGRpcmVjdGlvbiAqIDkwKSArIDQ1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVxdWVzdFJlbmRlcigpO1xuICAgIH07XG59O1xuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vdHlwZXMvUG9pbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMubW91c2Vkb3duLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvZmZzZXQ6IFBvaW50ID0ge1xuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0b3A6IDBcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBsYXN0TW91c2VQYWdlT2Zmc2V0OiBQb2ludCA9IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgfTtcblxuICAgIHByaXZhdGUgbW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMubGFzdE1vdXNlUGFnZU9mZnNldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYLFxuICAgICAgICAgICAgdG9wOiBldmVudC5wYWdlWVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2Vtb3ZlRXZlbnQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMubW91c2V1cEV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMubW91c2V1cEV2ZW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdXNlbW92ZUV2ZW50ID0gdGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKTtcbiAgICBwcml2YXRlIG1vdXNlbW92ZShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBjb25zdCBkaWZmZXJlbmNlID0ge1xuICAgICAgICAgICAgbGVmdDogZXZlbnQucGFnZVggLSB0aGlzLmxhc3RNb3VzZVBhZ2VPZmZzZXQubGVmdCxcbiAgICAgICAgICAgIHRvcDogZXZlbnQucGFnZVkgLSB0aGlzLmxhc3RNb3VzZVBhZ2VPZmZzZXQudG9wXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sYXN0TW91c2VQYWdlT2Zmc2V0ID0ge1xuICAgICAgICAgICAgbGVmdDogZXZlbnQucGFnZVgsXG4gICAgICAgICAgICB0b3A6IGV2ZW50LnBhZ2VZXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5vZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiB0aGlzLm9mZnNldC5sZWZ0ICsgZGlmZmVyZW5jZS5sZWZ0LFxuICAgICAgICAgICAgdG9wOiB0aGlzLm9mZnNldC50b3AgKyBkaWZmZXJlbmNlLnRvcFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBwcml2YXRlIG1vdXNldXBFdmVudCA9IHRoaXMubW91c2V1cC5iaW5kKHRoaXMpO1xuICAgIHByaXZhdGUgbW91c2V1cCgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZW1vdmVFdmVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgdGhpcy5tb3VzZXVwRXZlbnQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZXVwRXZlbnQpO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tIFwiLi4vdHlwZXMvRGlyZWN0aW9uXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi90eXBlcy9Qb2ludFwiO1xuaW1wb3J0IFRlcnJhaW5DYW52YXNNb3VzZUV2ZW50cyBmcm9tIFwiLi9UZXJyYWluQ2FudmFzTW91c2VFdmVudHNcIjtcbmltcG9ydCBUZXJyYWluR3JpZCBmcm9tIFwiLi9UZXJyYWluR3JpZFwiO1xuaW1wb3J0IFRlcnJhaW5HcmlkUmVuZGVyZXIgZnJvbSBcIi4vVGVycmFpbkdyaWRSZW5kZXJlclwiO1xuaW1wb3J0IFRlcnJhaW5SZW5kZXJlciBmcm9tIFwiLi9UZXJyYWluUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluV2F0ZXJSZW5kZXJlciBmcm9tIFwiLi9UZXJyYWluV2F0ZXJSZW5kZXJlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJyYWluRGVidWdDYW52YXMge1xuICAgIHB1YmxpYyByZWFkb25seSBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblxuICAgIHByaXZhdGUgb2Zmc2V0OiBQb2ludCA9IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgfTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgbW91c2VFdmVudHMgPSBuZXcgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzKHRoaXMuZWxlbWVudCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJlcXVlc3RSZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXF1ZXN0UmVuZGVyKCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IGJvdW5kcy53aWR0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IGJvdW5kcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5vZmZzZXQubGVmdCA9IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LmxlZnQgKyAxMDA7XG4gICAgICAgIHRoaXMub2Zmc2V0LnRvcCA9IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LnRvcDtcblxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5lbGVtZW50LmdldENvbnRleHQoXCIyZFwiKSE7XG5cblxuICAgICAgICBjb25zdCB0ZXJyYWluV2F0ZXJSZW5kZXJlciA9IG5ldyBUZXJyYWluV2F0ZXJSZW5kZXJlcihjb250ZXh0KTtcbiAgICAgICAgdGVycmFpbldhdGVyUmVuZGVyZXIuZHJhd1dhdGVyKCk7XG5cbiAgICAgICAgY29uc3QgdGVycmFpbkdyaWRSZW5kZXJlciA9IG5ldyBUZXJyYWluR3JpZFJlbmRlcmVyKGNvbnRleHQsIHRoaXMuc2l6ZSwgdGhpcy5vZmZzZXQpO1xuICAgICAgICB0ZXJyYWluR3JpZFJlbmRlcmVyLmRyYXdHcmlkKCk7XG5cbiAgICAgICAgY29uc3QgdGVycmFpblJlbmRlcmVyID0gbmV3IFRlcnJhaW5SZW5kZXJlcihjb250ZXh0LCB0aGlzLnNpemUsIHRoaXMub2Zmc2V0KTtcblxuICAgICAgICBmb3IobGV0IGRpcmVjdGlvbiA9IDA7IGRpcmVjdGlvbiA8IDQ7IGRpcmVjdGlvbisrKSB7XG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd0ZsYXRUaWxlKDEgKyAoZGlyZWN0aW9uICogMiksIDAsIGRpcmVjdGlvbiAqIDkwKTtcbiAgICAgICAgICAgIHRlcnJhaW5SZW5kZXJlci5kcmF3RmxhdFRpbGVXaXRoRmxhdEVkZ2UoMSArIChkaXJlY3Rpb24gKiAyKSwgMiwgZGlyZWN0aW9uICogOTApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCA0LCBkaXJlY3Rpb24gKiA5MCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRlcnJhaW5SZW5kZXJlci5kcmF3RmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDYsIGRpcmVjdGlvbiAqIDkwKTtcbiAgICAgICAgICAgIHRlcnJhaW5SZW5kZXJlci5kcmF3RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCA4LCBkaXJlY3Rpb24gKiA5MCk7XG4gICAgICAgICAgICB0ZXJyYWluUmVuZGVyZXIuZHJhd0ZsYXRUaWxlV2l0aE91dHNpZGVDb3JuZXJFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDEwLCBkaXJlY3Rpb24gKiA5MCk7XG5cbiAgICAgICAgICAgIHRlcnJhaW5SZW5kZXJlci5kcmF3U2xvcGVkVGlsZVdpdGhGbGF0RWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAxMiwgKGRpcmVjdGlvbiAqIDkwKSArIDQ1KTtcblxuICAgICAgICAgICAgdGVycmFpblJlbmRlcmVyLmRyYXdTbG9wZWRUaWxlV2l0aE91dHNpZGVDb3JuZXJFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDE0LCAoZGlyZWN0aW9uICogOTApICsgNDUpO1xuICAgICAgICAgICAgdGVycmFpblJlbmRlcmVyLmRyYXdTbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZSgxICsgKGRpcmVjdGlvbiAqIDIpLCAxNiwgKGRpcmVjdGlvbiAqIDkwKSArIDQ1KTtcbiAgICAgICAgICAgIHRlcnJhaW5SZW5kZXJlci5kcmF3U2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKDEgKyAoZGlyZWN0aW9uICogMiksIDE4LCAoZGlyZWN0aW9uICogOTApICsgNDUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0UmVuZGVyKCk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tIFwiLi4vdHlwZXMvRGlyZWN0aW9uXCI7XG5pbXBvcnQgeyBUZXJyYWluR3JpZEl0ZW0gfSBmcm9tIFwiLi4vdHlwZXMvVGVycmFpbkdyaWRJdGVtXCI7XG5pbXBvcnQgeyBUZXJyYWluR3JpZEl0ZW1XaXRoQW5nbGUgfSBmcm9tIFwiLi4vdHlwZXMvVGVycmFpbkdyaWRJdGVtV2l0aEFuZ2xlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5HcmlkIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGF0dGVybjogbnVtYmVyW11bXTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm93czogbnVtYmVyO1xuICAgIHB1YmxpYyByZWFkb25seSBjb2x1bW5zOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXR0ZXJuOiBudW1iZXJbXVtdKSB7XG4gICAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gICAgICAgIHRoaXMucm93cyA9IHRoaXMucGF0dGVybi5sZW5ndGg7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IE1hdGgubWF4KC4uLnRoaXMucGF0dGVybi5tYXAoKHJvdykgPT4gcm93Lmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc05vcnRoVGlsZVdhdGVyKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKCF0aGlzLnBhdHRlcm5bcm93IC0gMV0gfHwgIXRoaXMucGF0dGVybltyb3cgLSAxXVtjb2x1bW5dKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNFYXN0VGlsZVdhdGVyKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKCF0aGlzLnBhdHRlcm5bcm93XSB8fCAhdGhpcy5wYXR0ZXJuW3Jvd11bY29sdW1uICsgMV0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1dlc3RUaWxlV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAoIXRoaXMucGF0dGVybltyb3ddIHx8ICF0aGlzLnBhdHRlcm5bcm93XVtjb2x1bW4gLSAxXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzU291dGhUaWxlV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAoIXRoaXMucGF0dGVybltyb3cgKyAxXSB8fCAhdGhpcy5wYXR0ZXJuW3JvdyArIDFdW2NvbHVtbl0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRUaWxlcygpIHtcbiAgICAgICAgY29uc3QgaXRlbXM6IFRlcnJhaW5HcmlkSXRlbVtdID0gW107XG5cbiAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKVxuICAgICAgICBmb3IobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMucGF0dGVybltyb3ddLmxlbmd0aDsgY29sdW1uKyspIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhdHRlcm5bcm93XVtjb2x1bW5dKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3csXG4gICAgICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uLk5vcnRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SW5uZXJFZGdlQ29ybmVycygpIHtcbiAgICAgICAgY29uc3QgaXRlbXM6IFRlcnJhaW5HcmlkSXRlbVtdID0gW107XG5cbiAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKVxuICAgICAgICBmb3IobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMucGF0dGVybltyb3ddLmxlbmd0aDsgY29sdW1uKyspIHtcbiAgICAgICAgICAgIGlmKHRoaXMucGF0dGVybltyb3ddW2NvbHVtbl0pXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLmlzU291dGhUaWxlV2F0ZXIocm93LCBjb2x1bW4pICYmICF0aGlzLmlzRWFzdFRpbGVXYXRlcihyb3csIGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93OiByb3cgKyAxLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIDEsXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uLk5vcnRoV2VzdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZighdGhpcy5pc1NvdXRoVGlsZVdhdGVyKHJvdywgY29sdW1uKSAmJiAhdGhpcy5pc1dlc3RUaWxlV2F0ZXIocm93LCBjb2x1bW4pKSB7XG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvdzogcm93ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBjb2x1bW4gLSAxLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5Ob3J0aEVhc3RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIXRoaXMuaXNOb3J0aFRpbGVXYXRlcihyb3csIGNvbHVtbikgJiYgIXRoaXMuaXNFYXN0VGlsZVdhdGVyKHJvdywgY29sdW1uKSkge1xuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3c6IHJvdyAtIDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbjogY29sdW1uICsgMSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBEaXJlY3Rpb24uU291dGhXZXN0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLmlzTm9ydGhUaWxlV2F0ZXIocm93LCBjb2x1bW4pICYmICF0aGlzLmlzV2VzdFRpbGVXYXRlcihyb3csIGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93OiByb3cgLSAxLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGNvbHVtbiAtIDEsXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uLlNvdXRoRWFzdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRPdXRlckVkZ2VzKCkge1xuICAgICAgICBjb25zdCBpdGVtczogVGVycmFpbkdyaWRJdGVtW10gPSBbXTtcbiAgICAgICAgY29uc3QgY29ubmVjdG9yczogVGVycmFpbkdyaWRJdGVtW10gPSBbXTtcblxuICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspXG4gICAgICAgIGZvcihsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgdGhpcy5wYXR0ZXJuW3Jvd10ubGVuZ3RoOyBjb2x1bW4rKykge1xuICAgICAgICAgICAgaWYoIXRoaXMucGF0dGVybltyb3ddW2NvbHVtbl0pXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaXNOb3J0aFRpbGVXYXRlcihyb3csIGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzV2VzdFRpbGVXYXRlcihyb3cgLSAxLCBjb2x1bW4pIHx8ICF0aGlzLmlzRWFzdFRpbGVXYXRlcihyb3cgLSAxLCBjb2x1bW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93OiByb3cgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBEaXJlY3Rpb24uTm9ydGhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNFYXN0VGlsZVdhdGVyKHJvdywgY29sdW1uKSAmJiB0aGlzLmlzRWFzdFRpbGVXYXRlcihyb3cgLSAxLCBjb2x1bW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogcm93IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBEaXJlY3Rpb24uTm9ydGhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmlzU291dGhUaWxlV2F0ZXIocm93LCBjb2x1bW4pKSB7XG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvdzogcm93ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5Tb3V0aFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNXZXN0VGlsZVdhdGVyKHJvdywgY29sdW1uKSAmJiB0aGlzLmlzV2VzdFRpbGVXYXRlcihyb3cgKyAxLCBjb2x1bW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IHJvdyArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5Tb3V0aFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaXNFYXN0VGlsZVdhdGVyKHJvdywgY29sdW1uKSkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNFYXN0VGlsZVdhdGVyKHJvdyArIDEsIGNvbHVtbikgfHwgIXRoaXMuaXNFYXN0VGlsZVdhdGVyKHJvdywgY29sdW1uICsgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3csXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5FYXN0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzU291dGhUaWxlV2F0ZXIocm93LCBjb2x1bW4pICYmIHRoaXMuaXNFYXN0VGlsZVdhdGVyKHJvdyArIDEsIGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogY29sdW1uICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5FYXN0XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3csXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5Ob3J0aEVhc3RcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih0aGlzLmlzV2VzdFRpbGVXYXRlcihyb3csIGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGNvbHVtbiAtIDEsXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uLldlc3RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc05vcnRoVGlsZVdhdGVyKHJvdywgY29sdW1uKSAmJiB0aGlzLmlzTm9ydGhUaWxlV2F0ZXIocm93LCBjb2x1bW4gLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBjb2x1bW4gLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBEaXJlY3Rpb24uV2VzdFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXRlbXMsXG4gICAgICAgICAgICBjb25uZWN0b3JzXG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgcHVibGljIGdldE91dGVyRWRnZUNvcm5lcnMoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zOiBUZXJyYWluR3JpZEl0ZW1XaXRoQW5nbGVbXSA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5yb3dzOyByb3crKylcbiAgICAgICAgZm9yKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPCB0aGlzLnBhdHRlcm5bcm93XS5sZW5ndGg7IGNvbHVtbisrKSB7XG4gICAgICAgICAgICBpZighdGhpcy5wYXR0ZXJuW3Jvd11bY29sdW1uXSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYoKHRoaXMuaXNOb3J0aFRpbGVXYXRlcihyb3csIGNvbHVtbikpICYmICh0aGlzLmlzRWFzdFRpbGVXYXRlcihyb3csIGNvbHVtbikpKSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5pc0Vhc3RUaWxlV2F0ZXIocm93IC0gMSwgY29sdW1uKSkge1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5pc1NvdXRoVGlsZVdhdGVyKHJvdywgY29sdW1uICsgMSkgJiYgdGhpcy5pc0Vhc3RUaWxlV2F0ZXIocm93LCBjb2x1bW4gKyAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiByb3cgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogY29sdW1uICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5Ob3J0aEVhc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDQ1XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogcm93IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBEaXJlY3Rpb24uTm9ydGhFYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiA5MFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCh0aGlzLmlzTm9ydGhUaWxlV2F0ZXIocm93LCBjb2x1bW4pKSAmJiAodGhpcy5pc1dlc3RUaWxlV2F0ZXIocm93LCBjb2x1bW4pKSkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNXZXN0VGlsZVdhdGVyKHJvdyAtIDEsIGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IHJvdyAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGNvbHVtbiAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IERpcmVjdGlvbi5Ob3J0aFdlc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogOTBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZigodGhpcy5pc1NvdXRoVGlsZVdhdGVyKHJvdywgY29sdW1uKSkgJiYgKHRoaXMuaXNFYXN0VGlsZVdhdGVyKHJvdywgY29sdW1uKSkpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzRWFzdFRpbGVXYXRlcihyb3cgKyAxLCBjb2x1bW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93OiByb3cgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBjb2x1bW4gKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBEaXJlY3Rpb24uU291dGhFYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDkwXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoKHRoaXMuaXNTb3V0aFRpbGVXYXRlcihyb3csIGNvbHVtbikpICYmICh0aGlzLmlzV2VzdFRpbGVXYXRlcihyb3csIGNvbHVtbikpKSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5pc1dlc3RUaWxlV2F0ZXIocm93ICsgMSwgY29sdW1uKSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogcm93ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogY29sdW1uIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uLlNvdXRoV2VzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiA5MFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxufTtcbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5HcmlkUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSBvZmZzZXQ6IFBvaW50KSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0dyaWQoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAuMDUpXCI7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLm9mZnNldC5sZWZ0LCB0aGlzLm9mZnNldC50b3ApO1xuXG4gICAgICAgIGNvbnN0IHRvcFN0YXJ0ID0gLXRoaXMub2Zmc2V0LnRvcCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LnRvcCAlIHRoaXMuc2l6ZSkgLSB0aGlzLnNpemUpO1xuICAgICAgICBjb25zdCB0b3BFbmQgPSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDtcblxuICAgICAgICBjb25zdCBsZWZ0U3RhcnQgPSAtdGhpcy5vZmZzZXQubGVmdCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LmxlZnQgJSB0aGlzLnNpemUpIC0gdGhpcy5zaXplKTtcbiAgICAgICAgY29uc3QgbGVmdEVuZCA9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7XG5cbiAgICAgICAgZm9yKGxldCB0b3AgPSB0b3BTdGFydDsgdG9wIDwgdG9wRW5kOyB0b3AgKz0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QobGVmdFN0YXJ0LCB0b3AgLSAuNSwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGxlZnQgPSBsZWZ0U3RhcnQ7IGxlZnQgPCBsZWZ0RW5kOyBsZWZ0ICs9IHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KGxlZnQgLSAuNSwgdG9wU3RhcnQsIDEsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi90eXBlcy9EaXJlY3Rpb25cIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5SZW5kZXJlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBoYWxmU2l6ZTogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBlZGdlU2l6ZTogbnVtYmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFsZkVkZ2VTaXplOiBudW1iZXI7XG4gICAgXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlcnJhaW5Db2xvciA9IFwiI0MzRUNCMlwiO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZWRnZUNvbG9yID0gXCIjRkZGMkFGXCI7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlYnVnID0gdHJ1ZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlYnVnQXJyb3dTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWJ1Z0NvbG9yID0gXCJibGFja1wiO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHByaXZhdGUgcmVhZG9ubHkgc2l6ZTogbnVtYmVyLCBwcml2YXRlIHJlYWRvbmx5IG9mZnNldDogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5oYWxmU2l6ZSA9IHRoaXMuc2l6ZSAvIDI7XG5cbiAgICAgICAgdGhpcy5lZGdlU2l6ZSA9IHRoaXMuc2l6ZSAqIDAuMjtcbiAgICAgICAgdGhpcy5oYWxmRWRnZVNpemUgPSB0aGlzLmVkZ2VTaXplIC8gMjtcblxuICAgICAgICB0aGlzLmRlYnVnQXJyb3dTaXplID0gdGhpcy5zaXplICogMC4wNTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBnZXRBbmdsZShkZWdyZWVzOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUcmFuc2Zvcm1hdGlvbihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxlZnQgPSBjb2x1bW4gKiB0aGlzLnNpemU7XG4gICAgICAgIGNvbnN0IHRvcCA9IHJvdyAqIHRoaXMuc2l6ZTtcblxuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMub2Zmc2V0LmxlZnQsIHRoaXMub2Zmc2V0LnRvcCk7XG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUobGVmdCwgdG9wKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucm90YXRlKChNYXRoLlBJIC8gMTgwKSAqIChEaXJlY3Rpb24uU291dGggKyBkaXJlY3Rpb24pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdEZWJ1Z1RpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZih0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5kZWJ1Z0NvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoMCwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKC10aGlzLmRlYnVnQXJyb3dTaXplLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oMCwgdGhpcy5kZWJ1Z0Fycm93U2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuZGVidWdBcnJvd1NpemUsIDApO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5kZWJ1Z0NvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBEaXJlY3Rpb24uU291dGgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoYFJvdyAke3Jvd31gLCAwLCAwKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9IFwiaGFuZ2luZ1wiO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KGBDb2x1bW4gJHtjb2x1bW59YCwgMCwgMCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSwgLXRoaXMuaGFsZlNpemUsIHRoaXMuc2l6ZSwgdGhpcy5zaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd0RlYnVnVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KC10aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplLCB0aGlzLnNpemUsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoLXRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplLCB0aGlzLnNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYygtdGhpcy5oYWxmU2l6ZSArIHRoaXMuZWRnZVNpemUsIHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDkwKSwgdGhpcy5nZXRBbmdsZSg5MCArIDQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xlZnRPdXRzaWRlQ29ybmVyRWRnZSgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8odGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSAtICh0aGlzLmhhbGZFZGdlU2l6ZSAqIDEuNSksIHRoaXMuaGFsZlNpemUgKyAodGhpcy5oYWxmRWRnZVNpemUgKiAxLjUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmhhbGZTaXplIC0gKHRoaXMuaGFsZkVkZ2VTaXplICogNCksIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKHRoaXMuaGFsZlNpemUgLSAodGhpcy5lZGdlU2l6ZSAqIDIpLCB0aGlzLmhhbGZTaXplICsgKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSgtOTApLCB0aGlzLmdldEFuZ2xlKC00NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3UmlnaHRPdXRzaWRlQ29ybmVyRWRnZSgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oLXRoaXMuaGFsZlNpemUgKyAodGhpcy5oYWxmRWRnZVNpemUgKiA0KSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oLXRoaXMuaGFsZlNpemUgKyAodGhpcy5oYWxmRWRnZVNpemUgKiAyKSwgdGhpcy5oYWxmU2l6ZSArIHRoaXMuZWRnZVNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKC10aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYygtdGhpcy5oYWxmU2l6ZSArICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuaGFsZlNpemUgKyAodGhpcy5lZGdlU2l6ZSAqIDIpLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDE4MCArIDQ1KSwgdGhpcy5nZXRBbmdsZSgyNzApKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgICAgICB0aGlzLmRyYXdMZWZ0T3V0c2lkZUNvcm5lckVkZ2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSwgdGhpcy5zaXplIC0gKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5lZGdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMuZHJhd1JpZ2h0T3V0c2lkZUNvcm5lckVkZ2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSArICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuaGFsZlNpemUsIHRoaXMuc2l6ZSAtICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICAgICAgdGhpcy5kcmF3TGVmdE91dHNpZGVDb3JuZXJFZGdlKCk7XG4gICAgICAgIHRoaXMuZHJhd1JpZ2h0T3V0c2lkZUNvcm5lckVkZ2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSArICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuaGFsZlNpemUsIHRoaXMuc2l6ZSAtICh0aGlzLmVkZ2VTaXplICogNCksIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3U2xvcGVkVGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnRlcnJhaW5Db2xvcjtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oLXRoaXMuaGFsZlNpemUsIC10aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmhhbGZTaXplLCAtdGhpcy5oYWxmU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd0RlYnVnVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoRmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdTbG9wZWRUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoLXRoaXMuaGFsZlNpemUgKiAxLjUsIC10aGlzLmhhbGZFZGdlU2l6ZSArIDEuNSwgdGhpcy5zaXplICogMS41LCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1Nsb3BlZExlZnRPdXRzaWRlQ29ybmVyKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yb3RhdGUodGhpcy5nZXRBbmdsZSgxODApKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKC10aGlzLmVkZ2VTaXplICogMSArIDQsIC10aGlzLmVkZ2VTaXplICogMyAtMik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSg0NSArIDQ1KSwgdGhpcy5nZXRBbmdsZSgoNDUgKyA0NSkgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3U2xvcGVkUmlnaHRPdXRzaWRlQ29ybmVyKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoLXRoaXMuZWRnZVNpemUgKyAxLCAzKVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKC10aGlzLmhhbGZTaXplICsgdGhpcy5lZGdlU2l6ZSwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUsIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoMTgwICsgNDUpLCB0aGlzLmdldEFuZ2xlKCgxODAgKyA0NSkgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlV2l0aE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KC0odGhpcy5oYWxmU2l6ZSAqIDEuNSkgKyB0aGlzLmVkZ2VTaXplLCAtdGhpcy5oYWxmRWRnZVNpemUgKyAodGhpcy5oYWxmRWRnZVNpemUgKiAuMiksICh0aGlzLnNpemUgKiAxLjUpIC0gKHRoaXMuZWRnZVNpemUgKiAyKSAtIDQsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkTGVmdE91dHNpZGVDb3JuZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZFJpZ2h0T3V0c2lkZUNvcm5lcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtKHRoaXMuaGFsZlNpemUgKiAxLjUpICsgdGhpcy5lZGdlU2l6ZSwgLXRoaXMuaGFsZkVkZ2VTaXplICsgKHRoaXMuaGFsZkVkZ2VTaXplICogLjIpLCAodGhpcy5zaXplICogMS41KSAtIHRoaXMuZWRnZVNpemUgLSA0LCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZFJpZ2h0T3V0c2lkZUNvcm5lcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KC0odGhpcy5oYWxmU2l6ZSAqIDEuNSksIC10aGlzLmhhbGZFZGdlU2l6ZSArICh0aGlzLmhhbGZFZGdlU2l6ZSAqIC4yKSwgKHRoaXMuc2l6ZSAqIDEuNSkgLSB0aGlzLmVkZ2VTaXplIC0gNCwgdGhpcy5lZGdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdTbG9wZWRMZWZ0T3V0c2lkZUNvcm5lcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vdHlwZXMvUG9pbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbldhdGVyUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1dhdGVyKCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBcIiNBQURBRkZcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH07XG59XG4iLCJleHBvcnQgZW51bSBEaXJlY3Rpb24ge1xuICAgIE5vcnRoID0gMCxcbiAgICBOb3J0aEVhc3QgPSBOb3J0aCArIDQ1LFxuICAgIFxuICAgIEVhc3QgPSA5MCxcbiAgICBTb3V0aEVhc3QgPSBFYXN0ICsgNDUsXG5cbiAgICBTb3V0aCA9IDE4MCxcbiAgICBTb3V0aFdlc3QgPSBTb3V0aCArIDQ1LFxuXG4gICAgV2VzdCA9IDI3MCxcbiAgICBOb3J0aFdlc3QgPSBXZXN0ICsgNDVcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==