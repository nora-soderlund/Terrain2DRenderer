/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/canvas/browser.js":
/*!****************************************!*\
  !*** ./node_modules/canvas/browser.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* globals document, ImageData */

const parseFont = __webpack_require__(/*! ./lib/parse-font */ "./node_modules/canvas/lib/parse-font.js")

exports.parseFont = parseFont

exports.createCanvas = function (width, height) {
  return Object.assign(document.createElement('canvas'), { width: width, height: height })
}

exports.createImageData = function (array, width, height) {
  // Browser implementation of ImageData looks at the number of arguments passed
  switch (arguments.length) {
    case 0: return new ImageData()
    case 1: return new ImageData(array)
    case 2: return new ImageData(array, width)
    default: return new ImageData(array, width, height)
  }
}

exports.loadImage = function (src, options) {
  return new Promise(function (resolve, reject) {
    const image = Object.assign(document.createElement('img'), options)

    function cleanup () {
      image.onload = null
      image.onerror = null
    }

    image.onload = function () { cleanup(); resolve(image) }
    image.onerror = function () { cleanup(); reject(new Error('Failed to load the image "' + src + '"')) }

    image.src = src
  })
}


/***/ }),

/***/ "./node_modules/canvas/lib/parse-font.js":
/*!***********************************************!*\
  !*** ./node_modules/canvas/lib/parse-font.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";


/**
 * Font RegExp helpers.
 */

const weights = 'bold|bolder|lighter|[1-9]00'
const styles = 'italic|oblique'
const variants = 'small-caps'
const stretches = 'ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded'
const units = 'px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q'
const string = '\'([^\']+)\'|"([^"]+)"|[\\w\\s-]+'

// [ [ <‘font-style’> || <font-variant-css21> || <‘font-weight’> || <‘font-stretch’> ]?
//    <‘font-size’> [ / <‘line-height’> ]? <‘font-family’> ]
// https://drafts.csswg.org/css-fonts-3/#font-prop
const weightRe = new RegExp(`(${weights}) +`, 'i')
const styleRe = new RegExp(`(${styles}) +`, 'i')
const variantRe = new RegExp(`(${variants}) +`, 'i')
const stretchRe = new RegExp(`(${stretches}) +`, 'i')
const sizeFamilyRe = new RegExp(
  `([\\d\\.]+)(${units}) *((?:${string})( *, *(?:${string}))*)`)

/**
 * Cache font parsing.
 */

const cache = {}

const defaultHeight = 16 // pt, common browser default

/**
 * Parse font `str`.
 *
 * @param {String} str
 * @return {Object} Parsed font. `size` is in device units. `unit` is the unit
 *   appearing in the input string.
 * @api private
 */

module.exports = str => {
  // Cached
  if (cache[str]) return cache[str]

  // Try for required properties first.
  const sizeFamily = sizeFamilyRe.exec(str)
  if (!sizeFamily) return // invalid

  // Default values and required properties
  const font = {
    weight: 'normal',
    style: 'normal',
    stretch: 'normal',
    variant: 'normal',
    size: parseFloat(sizeFamily[1]),
    unit: sizeFamily[2],
    family: sizeFamily[3].replace(/["']/g, '').replace(/ *, */g, ',')
  }

  // Optional, unordered properties.
  let weight, style, variant, stretch
  // Stop search at `sizeFamily.index`
  const substr = str.substring(0, sizeFamily.index)
  if ((weight = weightRe.exec(substr))) font.weight = weight[1]
  if ((style = styleRe.exec(substr))) font.style = style[1]
  if ((variant = variantRe.exec(substr))) font.variant = variant[1]
  if ((stretch = stretchRe.exec(substr))) font.stretch = stretch[1]

  // Convert to device units. (`font.unit` is the original unit)
  // TODO: ch, ex
  switch (font.unit) {
    case 'pt':
      font.size /= 0.75
      break
    case 'pc':
      font.size *= 16
      break
    case 'in':
      font.size *= 96
      break
    case 'cm':
      font.size *= 96.0 / 2.54
      break
    case 'mm':
      font.size *= 96.0 / 25.4
      break
    case '%':
      // TODO disabled because existing unit tests assume 100
      // font.size *= defaultHeight / 100 / 0.75
      break
    case 'em':
    case 'rem':
      font.size *= defaultHeight / 0.75
      break
    case 'q':
      font.size *= 96 / 25.4 / 4
      break
  }

  return (cache[str] = font)
}


/***/ }),

/***/ "./src/browser/game/GameCanvas.ts":
/*!****************************************!*\
  !*** ./src/browser/game/GameCanvas.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const GameCanvasMouseEvents_1 = __importDefault(__webpack_require__(/*! ./events/GameCanvasMouseEvents */ "./src/browser/game/events/GameCanvasMouseEvents.ts"));
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

/***/ "./src/browser/game/entities/GameTerrainEntity.ts":
/*!********************************************************!*\
  !*** ./src/browser/game/entities/GameTerrainEntity.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class GameTerrainEntity {
    constructor(terrainCanvas) {
        this.terrainCanvas = terrainCanvas;
    }
    draw(context, offset) {
        context.drawImage(this.terrainCanvas.canvas, 0, 0, this.terrainCanvas.canvas.width, this.terrainCanvas.canvas.height, offset.left, offset.top, this.terrainCanvas.canvas.width, this.terrainCanvas.canvas.height);
    }
    ;
}
exports["default"] = GameTerrainEntity;


/***/ }),

/***/ "./src/browser/game/events/GameCanvasMouseEvents.ts":
/*!**********************************************************!*\
  !*** ./src/browser/game/events/GameCanvasMouseEvents.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ "./src/browser/terrain/BrowserTerrainGrid.ts":
/*!***************************************************!*\
  !*** ./src/browser/terrain/BrowserTerrainGrid.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
const TerrainGrid_1 = __importDefault(__webpack_require__(/*! ../../core/terrain/TerrainGrid */ "./src/core/terrain/TerrainGrid.ts"));
class BrowserTerrainGrid {
    static fromAsset(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(path);
            const result = yield response.json();
            return new TerrainGrid_1.default(result);
        });
    }
}
exports["default"] = BrowserTerrainGrid;


/***/ }),

/***/ "./src/core/terrain/TerrainCanvas.ts":
/*!*******************************************!*\
  !*** ./src/core/terrain/TerrainCanvas.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const TerrainGridRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainGridRenderer */ "./src/core/terrain/renderers/TerrainGridRenderer.ts"));
const TerrainTileRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainTileRenderer */ "./src/core/terrain/renderers/TerrainTileRenderer.ts"));
const TerrainWaterRenderer_1 = __importDefault(__webpack_require__(/*! ./renderers/TerrainWaterRenderer */ "./src/core/terrain/renderers/TerrainWaterRenderer.ts"));
const canvas_1 = __webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js");
class TerrainCanvas {
    constructor(tiles, size) {
        this.tiles = tiles;
        this.size = size;
        this.canvas = (0, canvas_1.createCanvas)(0, 0);
        this.rows = Math.max(...tiles.map((tiles) => tiles.grid.rows));
        this.columns = Math.max(...tiles.map((tiles) => tiles.grid.columns));
        this.render();
    }
    ;
    requestRender() {
        window.requestAnimationFrame(this.render.bind(this));
    }
    ;
    render() {
        this.canvas.width = this.columns * this.size;
        this.canvas.height = this.rows * this.size;
        //this.offset.left =  - Math.floor((this.tiles.grid.columns * this.size) / 2);
        //this.offset.top =  - Math.floor((this.tiles.grid.rows * this.size) / 2);
        const context = this.canvas.getContext("2d");
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

/***/ "./src/core/terrain/TerrainGrid.ts":
/*!*****************************************!*\
  !*** ./src/core/terrain/TerrainGrid.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../../types/Direction */ "./src/types/Direction.ts");
class TerrainGrid {
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

/***/ "./src/core/terrain/TerrainTiles.ts":
/*!******************************************!*\
  !*** ./src/core/terrain/TerrainTiles.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../../types/Direction */ "./src/types/Direction.ts");
const TerrainTileType_1 = __webpack_require__(/*! ./types/TerrainTileType */ "./src/core/terrain/types/TerrainTileType.ts");
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

/***/ "./src/core/terrain/renderers/TerrainGridRenderer.ts":
/*!***********************************************************!*\
  !*** ./src/core/terrain/renderers/TerrainGridRenderer.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ "./src/core/terrain/renderers/TerrainTileRenderer.ts":
/*!***********************************************************!*\
  !*** ./src/core/terrain/renderers/TerrainTileRenderer.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Direction_1 = __webpack_require__(/*! ../../../types/Direction */ "./src/types/Direction.ts");
const Side_1 = __webpack_require__(/*! ../../../types/Side */ "./src/types/Side.ts");
const TerrainTileType_1 = __webpack_require__(/*! ../types/TerrainTileType */ "./src/core/terrain/types/TerrainTileType.ts");
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

/***/ "./src/core/terrain/renderers/TerrainWaterRenderer.ts":
/*!************************************************************!*\
  !*** ./src/core/terrain/renderers/TerrainWaterRenderer.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ "./src/core/terrain/types/TerrainTileType.ts":
/*!***************************************************!*\
  !*** ./src/core/terrain/types/TerrainTileType.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
const TerrainCanvas_1 = __importDefault(__webpack_require__(/*! ./core/terrain/TerrainCanvas */ "./src/core/terrain/TerrainCanvas.ts"));
const TerrainGrid_1 = __importDefault(__webpack_require__(/*! ./core/terrain/TerrainGrid */ "./src/core/terrain/TerrainGrid.ts"));
const TerrainTiles_1 = __importDefault(__webpack_require__(/*! ./core/terrain/TerrainTiles */ "./src/core/terrain/TerrainTiles.ts"));
const BrowserTerrainGrid_1 = __importDefault(__webpack_require__(/*! ./browser/terrain/BrowserTerrainGrid */ "./src/browser/terrain/BrowserTerrainGrid.ts"));
const GameCanvas_1 = __importDefault(__webpack_require__(/*! ./browser/game/GameCanvas */ "./src/browser/game/GameCanvas.ts"));
const GameTerrainEntity_1 = __importDefault(__webpack_require__(/*! ./browser/game/entities/GameTerrainEntity */ "./src/browser/game/entities/GameTerrainEntity.ts"));
const testTerrainGrid = new TerrainGrid_1.default([
    [1, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 1, 0, 0]
]);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const swedenAssets = [
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
    const terrainGrids = (yield Promise.all(swedenAssets.map((asset) => {
        return BrowserTerrainGrid_1.default.fromAsset("../assets/sweden/" + asset);
    })));
    const terrainTilesCollection = terrainGrids.map((terrainGrid) => {
        const terrainTiles = new TerrainTiles_1.default(terrainGrid);
        return terrainTiles;
    });
    const testTerrainTiles = new TerrainTiles_1.default(testTerrainGrid);
    const terrainCanvas = new TerrainCanvas_1.default(terrainTilesCollection, 10);
    console.log(terrainCanvas.canvas);
    const gameTerrainEntity = new GameTerrainEntity_1.default(terrainCanvas);
    const gameCanvas = new GameCanvas_1.default([gameTerrainEntity]);
    document.body.append(gameCanvas.element);
}))();


/***/ }),

/***/ "./src/types/Direction.ts":
/*!********************************!*\
  !*** ./src/types/Direction.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

"use strict";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSx1QkFBYSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXBFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWxDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSwyQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUUvRCxNQUFNLFVBQVUsR0FBRyxJQUFJLG9CQUFVLENBQUMsQ0FBRSxpQkFBaUIsQ0FBRSxDQUFDLENBQUM7SUFFekQsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLENBQUMsRUFBQyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzlETCxJQUFZLFNBWVg7QUFaRCxXQUFZLFNBQVM7SUFDakIsMkNBQVM7SUFDVCxvREFBc0I7SUFFdEIsMENBQVM7SUFDVCxxREFBcUI7SUFFckIsNkNBQVc7SUFDWCxxREFBc0I7SUFFdEIsMkNBQVU7SUFDVixxREFBcUI7QUFDekIsQ0FBQyxFQVpXLFNBQVMseUJBQVQsU0FBUyxRQVlwQjs7Ozs7Ozs7Ozs7Ozs7O0FDWkQsSUFBWSxJQUdYO0FBSEQsV0FBWSxJQUFJO0lBQ1osK0JBQUk7SUFDSixpQ0FBSztBQUNULENBQUMsRUFIVyxJQUFJLG9CQUFKLElBQUksUUFHZjs7Ozs7OztVQ0hEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLy4vbm9kZV9tb2R1bGVzL2NhbnZhcy9icm93c2VyLmpzIiwid2VicGFjazovL3RlcnJhaW4vLi9ub2RlX21vZHVsZXMvY2FudmFzL2xpYi9wYXJzZS1mb250LmpzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvYnJvd3Nlci9nYW1lL0dhbWVDYW52YXMudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy9icm93c2VyL2dhbWUvZW50aXRpZXMvR2FtZVRlcnJhaW5FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy9icm93c2VyL2dhbWUvZXZlbnRzL0dhbWVDYW52YXNNb3VzZUV2ZW50cy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2Jyb3dzZXIvdGVycmFpbi9Ccm93c2VyVGVycmFpbkdyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy9jb3JlL3RlcnJhaW4vVGVycmFpbkNhbnZhcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2NvcmUvdGVycmFpbi9UZXJyYWluR3JpZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2NvcmUvdGVycmFpbi9UZXJyYWluVGlsZXMudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy9jb3JlL3RlcnJhaW4vcmVuZGVyZXJzL1RlcnJhaW5HcmlkUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy9jb3JlL3RlcnJhaW4vcmVuZGVyZXJzL1RlcnJhaW5UaWxlUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi8uL3NyYy9jb3JlL3RlcnJhaW4vcmVuZGVyZXJzL1RlcnJhaW5XYXRlclJlbmRlcmVyLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvY29yZS90ZXJyYWluL3R5cGVzL1RlcnJhaW5UaWxlVHlwZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdHlwZXMvRGlyZWN0aW9uLnRzIiwid2VicGFjazovL3RlcnJhaW4vLi9zcmMvdHlwZXMvU2lkZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RlcnJhaW4vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWxzIGRvY3VtZW50LCBJbWFnZURhdGEgKi9cblxuY29uc3QgcGFyc2VGb250ID0gcmVxdWlyZSgnLi9saWIvcGFyc2UtZm9udCcpXG5cbmV4cG9ydHMucGFyc2VGb250ID0gcGFyc2VGb250XG5cbmV4cG9ydHMuY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyksIHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9KVxufVxuXG5leHBvcnRzLmNyZWF0ZUltYWdlRGF0YSA9IGZ1bmN0aW9uIChhcnJheSwgd2lkdGgsIGhlaWdodCkge1xuICAvLyBCcm93c2VyIGltcGxlbWVudGF0aW9uIG9mIEltYWdlRGF0YSBsb29rcyBhdCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBwYXNzZWRcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gbmV3IEltYWdlRGF0YSgpXG4gICAgY2FzZSAxOiByZXR1cm4gbmV3IEltYWdlRGF0YShhcnJheSlcbiAgICBjYXNlIDI6IHJldHVybiBuZXcgSW1hZ2VEYXRhKGFycmF5LCB3aWR0aClcbiAgICBkZWZhdWx0OiByZXR1cm4gbmV3IEltYWdlRGF0YShhcnJheSwgd2lkdGgsIGhlaWdodClcbiAgfVxufVxuXG5leHBvcnRzLmxvYWRJbWFnZSA9IGZ1bmN0aW9uIChzcmMsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBjb25zdCBpbWFnZSA9IE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyksIG9wdGlvbnMpXG5cbiAgICBmdW5jdGlvbiBjbGVhbnVwICgpIHtcbiAgICAgIGltYWdlLm9ubG9hZCA9IG51bGxcbiAgICAgIGltYWdlLm9uZXJyb3IgPSBudWxsXG4gICAgfVxuXG4gICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkgeyBjbGVhbnVwKCk7IHJlc29sdmUoaW1hZ2UpIH1cbiAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24gKCkgeyBjbGVhbnVwKCk7IHJlamVjdChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBsb2FkIHRoZSBpbWFnZSBcIicgKyBzcmMgKyAnXCInKSkgfVxuXG4gICAgaW1hZ2Uuc3JjID0gc3JjXG4gIH0pXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBGb250IFJlZ0V4cCBoZWxwZXJzLlxuICovXG5cbmNvbnN0IHdlaWdodHMgPSAnYm9sZHxib2xkZXJ8bGlnaHRlcnxbMS05XTAwJ1xuY29uc3Qgc3R5bGVzID0gJ2l0YWxpY3xvYmxpcXVlJ1xuY29uc3QgdmFyaWFudHMgPSAnc21hbGwtY2FwcydcbmNvbnN0IHN0cmV0Y2hlcyA9ICd1bHRyYS1jb25kZW5zZWR8ZXh0cmEtY29uZGVuc2VkfGNvbmRlbnNlZHxzZW1pLWNvbmRlbnNlZHxzZW1pLWV4cGFuZGVkfGV4cGFuZGVkfGV4dHJhLWV4cGFuZGVkfHVsdHJhLWV4cGFuZGVkJ1xuY29uc3QgdW5pdHMgPSAncHh8cHR8cGN8aW58Y218bW18JXxlbXxleHxjaHxyZW18cSdcbmNvbnN0IHN0cmluZyA9ICdcXCcoW15cXCddKylcXCd8XCIoW15cIl0rKVwifFtcXFxcd1xcXFxzLV0rJ1xuXG4vLyBbIFsgPOKAmGZvbnQtc3R5bGXigJk+IHx8IDxmb250LXZhcmlhbnQtY3NzMjE+IHx8IDzigJhmb250LXdlaWdodOKAmT4gfHwgPOKAmGZvbnQtc3RyZXRjaOKAmT4gXT9cbi8vICAgIDzigJhmb250LXNpemXigJk+IFsgLyA84oCYbGluZS1oZWlnaHTigJk+IF0/IDzigJhmb250LWZhbWlseeKAmT4gXVxuLy8gaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy1mb250cy0zLyNmb250LXByb3BcbmNvbnN0IHdlaWdodFJlID0gbmV3IFJlZ0V4cChgKCR7d2VpZ2h0c30pICtgLCAnaScpXG5jb25zdCBzdHlsZVJlID0gbmV3IFJlZ0V4cChgKCR7c3R5bGVzfSkgK2AsICdpJylcbmNvbnN0IHZhcmlhbnRSZSA9IG5ldyBSZWdFeHAoYCgke3ZhcmlhbnRzfSkgK2AsICdpJylcbmNvbnN0IHN0cmV0Y2hSZSA9IG5ldyBSZWdFeHAoYCgke3N0cmV0Y2hlc30pICtgLCAnaScpXG5jb25zdCBzaXplRmFtaWx5UmUgPSBuZXcgUmVnRXhwKFxuICBgKFtcXFxcZFxcXFwuXSspKCR7dW5pdHN9KSAqKCg/OiR7c3RyaW5nfSkoICosICooPzoke3N0cmluZ30pKSopYClcblxuLyoqXG4gKiBDYWNoZSBmb250IHBhcnNpbmcuXG4gKi9cblxuY29uc3QgY2FjaGUgPSB7fVxuXG5jb25zdCBkZWZhdWx0SGVpZ2h0ID0gMTYgLy8gcHQsIGNvbW1vbiBicm93c2VyIGRlZmF1bHRcblxuLyoqXG4gKiBQYXJzZSBmb250IGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH0gUGFyc2VkIGZvbnQuIGBzaXplYCBpcyBpbiBkZXZpY2UgdW5pdHMuIGB1bml0YCBpcyB0aGUgdW5pdFxuICogICBhcHBlYXJpbmcgaW4gdGhlIGlucHV0IHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gc3RyID0+IHtcbiAgLy8gQ2FjaGVkXG4gIGlmIChjYWNoZVtzdHJdKSByZXR1cm4gY2FjaGVbc3RyXVxuXG4gIC8vIFRyeSBmb3IgcmVxdWlyZWQgcHJvcGVydGllcyBmaXJzdC5cbiAgY29uc3Qgc2l6ZUZhbWlseSA9IHNpemVGYW1pbHlSZS5leGVjKHN0cilcbiAgaWYgKCFzaXplRmFtaWx5KSByZXR1cm4gLy8gaW52YWxpZFxuXG4gIC8vIERlZmF1bHQgdmFsdWVzIGFuZCByZXF1aXJlZCBwcm9wZXJ0aWVzXG4gIGNvbnN0IGZvbnQgPSB7XG4gICAgd2VpZ2h0OiAnbm9ybWFsJyxcbiAgICBzdHlsZTogJ25vcm1hbCcsXG4gICAgc3RyZXRjaDogJ25vcm1hbCcsXG4gICAgdmFyaWFudDogJ25vcm1hbCcsXG4gICAgc2l6ZTogcGFyc2VGbG9hdChzaXplRmFtaWx5WzFdKSxcbiAgICB1bml0OiBzaXplRmFtaWx5WzJdLFxuICAgIGZhbWlseTogc2l6ZUZhbWlseVszXS5yZXBsYWNlKC9bXCInXS9nLCAnJykucmVwbGFjZSgvICosICovZywgJywnKVxuICB9XG5cbiAgLy8gT3B0aW9uYWwsIHVub3JkZXJlZCBwcm9wZXJ0aWVzLlxuICBsZXQgd2VpZ2h0LCBzdHlsZSwgdmFyaWFudCwgc3RyZXRjaFxuICAvLyBTdG9wIHNlYXJjaCBhdCBgc2l6ZUZhbWlseS5pbmRleGBcbiAgY29uc3Qgc3Vic3RyID0gc3RyLnN1YnN0cmluZygwLCBzaXplRmFtaWx5LmluZGV4KVxuICBpZiAoKHdlaWdodCA9IHdlaWdodFJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQud2VpZ2h0ID0gd2VpZ2h0WzFdXG4gIGlmICgoc3R5bGUgPSBzdHlsZVJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQuc3R5bGUgPSBzdHlsZVsxXVxuICBpZiAoKHZhcmlhbnQgPSB2YXJpYW50UmUuZXhlYyhzdWJzdHIpKSkgZm9udC52YXJpYW50ID0gdmFyaWFudFsxXVxuICBpZiAoKHN0cmV0Y2ggPSBzdHJldGNoUmUuZXhlYyhzdWJzdHIpKSkgZm9udC5zdHJldGNoID0gc3RyZXRjaFsxXVxuXG4gIC8vIENvbnZlcnQgdG8gZGV2aWNlIHVuaXRzLiAoYGZvbnQudW5pdGAgaXMgdGhlIG9yaWdpbmFsIHVuaXQpXG4gIC8vIFRPRE86IGNoLCBleFxuICBzd2l0Y2ggKGZvbnQudW5pdCkge1xuICAgIGNhc2UgJ3B0JzpcbiAgICAgIGZvbnQuc2l6ZSAvPSAwLjc1XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3BjJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSAxNlxuICAgICAgYnJlYWtcbiAgICBjYXNlICdpbic6XG4gICAgICBmb250LnNpemUgKj0gOTZcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnY20nOlxuICAgICAgZm9udC5zaXplICo9IDk2LjAgLyAyLjU0XG4gICAgICBicmVha1xuICAgIGNhc2UgJ21tJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSA5Ni4wIC8gMjUuNFxuICAgICAgYnJlYWtcbiAgICBjYXNlICclJzpcbiAgICAgIC8vIFRPRE8gZGlzYWJsZWQgYmVjYXVzZSBleGlzdGluZyB1bml0IHRlc3RzIGFzc3VtZSAxMDBcbiAgICAgIC8vIGZvbnQuc2l6ZSAqPSBkZWZhdWx0SGVpZ2h0IC8gMTAwIC8gMC43NVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdlbSc6XG4gICAgY2FzZSAncmVtJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSBkZWZhdWx0SGVpZ2h0IC8gMC43NVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdxJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSA5NiAvIDI1LjQgLyA0XG4gICAgICBicmVha1xuICB9XG5cbiAgcmV0dXJuIChjYWNoZVtzdHJdID0gZm9udClcbn1cbiIsImltcG9ydCB7IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9IGZyb20gXCJjYW52YXNcIjtcbmltcG9ydCBUZXJyYWluQ2FudmFzTW91c2VFdmVudHMgZnJvbSBcIi4vZXZlbnRzL0dhbWVDYW52YXNNb3VzZUV2ZW50c1wiO1xuaW1wb3J0IEdhbWVDYW52YXNFbnRpdHkgZnJvbSBcIi4vdHlwZXMvR2FtZUNhbnZhc0VudGl0eVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ2FudmFzIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtb3VzZUV2ZW50cyA9IG5ldyBUZXJyYWluQ2FudmFzTW91c2VFdmVudHModGhpcy5lbGVtZW50KTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY2FudmFzRW50aXRpZXM6IEdhbWVDYW52YXNFbnRpdHlbXSA9IFtdKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdFJlbmRlcigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgcmVxdWVzdFJlbmRlcigpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IGJvdW5kcy53aWR0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IGJvdW5kcy5oZWlnaHQ7XG5cbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5tb3VzZUV2ZW50cy5vZmZzZXQubGVmdCxcbiAgICAgICAgICAgIHRvcDogdGhpcy5tb3VzZUV2ZW50cy5vZmZzZXQudG9wXG4gICAgICAgIH07XG5cbiAgICAgICAgLy90aGlzLm9mZnNldC5sZWZ0ID0gIC0gTWF0aC5mbG9vcigodGhpcy50aWxlcy5ncmlkLmNvbHVtbnMgKiB0aGlzLnNpemUpIC8gMik7XG4gICAgICAgIC8vdGhpcy5vZmZzZXQudG9wID0gIC0gTWF0aC5mbG9vcigodGhpcy50aWxlcy5ncmlkLnJvd3MgKiB0aGlzLnNpemUpIC8gMik7XG5cbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuZWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIikgYXMgdW5rbm93biBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAgICAgZm9yKGxldCBjYW52YXNFbnRpdHkgb2YgdGhpcy5jYW52YXNFbnRpdGllcykge1xuICAgICAgICAgICAgY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgICAgIGNhbnZhc0VudGl0eS5kcmF3KGNvbnRleHQsIG9mZnNldCk7XG5cbiAgICAgICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0UmVuZGVyKCk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgeyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSBmcm9tIFwiY2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkNhbnZhcyBmcm9tIFwiLi4vLi4vLi4vY29yZS90ZXJyYWluL1RlcnJhaW5DYW52YXNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1BvaW50XCI7XG5pbXBvcnQgR2FtZUNhbnZhc0VudGl0eSBmcm9tIFwiLi4vdHlwZXMvR2FtZUNhbnZhc0VudGl0eVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lVGVycmFpbkVudGl0eSBpbXBsZW1lbnRzIEdhbWVDYW52YXNFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdGVycmFpbkNhbnZhczogVGVycmFpbkNhbnZhcykge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG9mZnNldDogUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy50ZXJyYWluQ2FudmFzLmNhbnZhcyxcbiAgICAgICAgICAgIDAsIDAsIHRoaXMudGVycmFpbkNhbnZhcy5jYW52YXMud2lkdGgsIHRoaXMudGVycmFpbkNhbnZhcy5jYW52YXMuaGVpZ2h0LFxuICAgICAgICAgICAgb2Zmc2V0LmxlZnQsIG9mZnNldC50b3AsIHRoaXMudGVycmFpbkNhbnZhcy5jYW52YXMud2lkdGgsIHRoaXMudGVycmFpbkNhbnZhcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xufSIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDYW52YXNNb3VzZUV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBlbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm1vdXNlZG93bi5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb2Zmc2V0OiBQb2ludCA9IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgfTtcblxuICAgIHByaXZhdGUgbGFzdE1vdXNlUGFnZU9mZnNldDogUG9pbnQgPSB7XG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMFxuICAgIH07XG5cbiAgICBwcml2YXRlIG1vdXNlZG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmxhc3RNb3VzZVBhZ2VPZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiBldmVudC5wYWdlWCxcbiAgICAgICAgICAgIHRvcDogZXZlbnQucGFnZVlcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlbW92ZUV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3VzZW1vdmVFdmVudCA9IHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcyk7XG4gICAgcHJpdmF0ZSBtb3VzZW1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYIC0gdGhpcy5sYXN0TW91c2VQYWdlT2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICB0b3A6IGV2ZW50LnBhZ2VZIC0gdGhpcy5sYXN0TW91c2VQYWdlT2Zmc2V0LnRvcFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGFzdE1vdXNlUGFnZU9mZnNldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYLFxuICAgICAgICAgICAgdG9wOiBldmVudC5wYWdlWVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMub2Zmc2V0ID0ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5vZmZzZXQubGVmdCArIGRpZmZlcmVuY2UubGVmdCxcbiAgICAgICAgICAgIHRvcDogdGhpcy5vZmZzZXQudG9wICsgZGlmZmVyZW5jZS50b3BcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBtb3VzZXVwRXZlbnQgPSB0aGlzLm1vdXNldXAuYmluZCh0aGlzKTtcbiAgICBwcml2YXRlIG1vdXNldXAoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2Vtb3ZlRXZlbnQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMubW91c2V1cEV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMubW91c2V1cEV2ZW50KTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IFRlcnJhaW5HcmlkIGZyb20gXCIuLi8uLi9jb3JlL3RlcnJhaW4vVGVycmFpbkdyaWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJvd3NlclRlcnJhaW5HcmlkIHtcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGZyb21Bc3NldChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChwYXRoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgVGVycmFpbkdyaWQocmVzdWx0KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVGVycmFpbkdyaWRSZW5kZXJlciBmcm9tIFwiLi9yZW5kZXJlcnMvVGVycmFpbkdyaWRSZW5kZXJlclwiO1xuaW1wb3J0IFRlcnJhaW5UaWxlUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5UaWxlUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluV2F0ZXJSZW5kZXJlciBmcm9tIFwiLi9yZW5kZXJlcnMvVGVycmFpbldhdGVyUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluVGlsZXMgZnJvbSBcIi4vVGVycmFpblRpbGVzXCI7XG5pbXBvcnQgeyBjcmVhdGVDYW52YXMgfSBmcm9tIFwiY2FudmFzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5DYW52YXMge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcm93czogbnVtYmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY29sdW1uczogbnVtYmVyO1xuXG4gICAgcHVibGljIHJlYWRvbmx5IGNhbnZhcyA9IGNyZWF0ZUNhbnZhcygwLCAwKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdGlsZXM6IFRlcnJhaW5UaWxlc1tdLCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJvd3MgPSBNYXRoLm1heCguLi50aWxlcy5tYXAoKHRpbGVzKSA9PiB0aWxlcy5ncmlkLnJvd3MpKTtcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gTWF0aC5tYXgoLi4udGlsZXMubWFwKCh0aWxlcykgPT4gdGlsZXMuZ3JpZC5jb2x1bW5zKSk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXF1ZXN0UmVuZGVyKCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNvbHVtbnMgKiB0aGlzLnNpemU7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMucm93cyAqIHRoaXMuc2l6ZTtcblxuICAgICAgICAvL3RoaXMub2Zmc2V0LmxlZnQgPSAgLSBNYXRoLmZsb29yKCh0aGlzLnRpbGVzLmdyaWQuY29sdW1ucyAqIHRoaXMuc2l6ZSkgLyAyKTtcbiAgICAgICAgLy90aGlzLm9mZnNldC50b3AgPSAgLSBNYXRoLmZsb29yKCh0aGlzLnRpbGVzLmdyaWQucm93cyAqIHRoaXMuc2l6ZSkgLyAyKTtcblxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpITtcblxuICAgICAgICBjb25zdCBvZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGVycmFpbldhdGVyUmVuZGVyZXIgPSBuZXcgVGVycmFpbldhdGVyUmVuZGVyZXIoY29udGV4dCk7XG4gICAgICAgIHRlcnJhaW5XYXRlclJlbmRlcmVyLmRyYXdXYXRlcigpO1xuXG4gICAgICAgIGNvbnN0IHRlcnJhaW5HcmlkUmVuZGVyZXIgPSBuZXcgVGVycmFpbkdyaWRSZW5kZXJlcihjb250ZXh0LCB0aGlzLnNpemUsIG9mZnNldCk7XG4gICAgICAgIHRlcnJhaW5HcmlkUmVuZGVyZXIuZHJhd0dyaWQoKTtcblxuICAgICAgICBjb25zdCB0ZXJyYWluVGlsZVJlbmRlcmVyID0gbmV3IFRlcnJhaW5UaWxlUmVuZGVyZXIoY29udGV4dCwgdGhpcy5zaXplLCBvZmZzZXQpO1xuXG4gICAgICAgIGZvcihsZXQgdGlsZXMgb2YgdGhpcy50aWxlcykge1xuICAgICAgICAgICAgZm9yKGxldCB0aWxlRGVmaW5pdGlvbiBvZiB0aWxlcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhdyh0aWxlRGVmaW5pdGlvbi50eXBlLCB0aWxlRGVmaW5pdGlvbi5yb3csIHRpbGVEZWZpbml0aW9uLmNvbHVtbiwgdGlsZURlZmluaXRpb24uZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGxldCB0aWxlRGVmaW5pdGlvbiBvZiB0aWxlcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd0RlYnVnQXJyb3codGlsZURlZmluaXRpb24ucm93LCB0aWxlRGVmaW5pdGlvbi5jb2x1bW4sIHRpbGVEZWZpbml0aW9uLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi8uLi90eXBlcy9EaXJlY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbkdyaWQge1xuICAgIHB1YmxpYyByZWFkb25seSByb3dzOiBudW1iZXI7XG4gICAgcHVibGljIHJlYWRvbmx5IGNvbHVtbnM6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWFwOiBudW1iZXJbXVtdKSB7XG4gICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgbWFwLmxlbmd0aDsgcm93KyspXG4gICAgICAgICAgICB0aGlzLm1hcFtyb3ddID0gWyAwLCAuLi5tYXBbcm93XSwgMCBdO1xuXG4gICAgICAgIHRoaXMubWFwLnVuc2hpZnQoW10pO1xuICAgICAgICB0aGlzLm1hcC5wdXNoKFtdKTtcblxuICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMubWFwLmxlbmd0aDsgcm93KyspXG4gICAgICAgIGZvcihsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgdGhpcy5tYXBbcm93XS5sZW5ndGg7IGNvbHVtbisrKSB7XG4gICAgICAgICAgICBpZighdGhpcy5pc1RpbGVXYXRlcihyb3csIGNvbHVtbikpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGZvcihsZXQgZGlyZWN0aW9uID0gMDsgZGlyZWN0aW9uIDwgMzYwOyBkaXJlY3Rpb24gKz0gOTApIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLkVhc3QpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5XZXN0KSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBbcm93XVtjb2x1bW5dID0gMjU1O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBzbG9wZSBhdCBcIiArIHJvdyArIFwiIHggXCIgKyBjb2x1bW4gKyBcIiBhdCBkaXJlY3Rpb24gXCIgKyBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3dzID0gdGhpcy5tYXAubGVuZ3RoO1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBNYXRoLm1heCguLi50aGlzLm1hcC5tYXAoKHJvdykgPT4gcm93Lmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T2Zmc2V0QnlEaXJlY3Rpb24oZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgd2hpbGUoZGlyZWN0aW9uID49IDM2MClcbiAgICAgICAgICAgIGRpcmVjdGlvbiAtPSAzNjA7XG5cbiAgICAgICAgd2hpbGUoZGlyZWN0aW9uIDwgMClcbiAgICAgICAgICAgIGRpcmVjdGlvbiArPSAzNjA7XG5cbiAgICAgICAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uTm9ydGg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAtMSwgY29sdW1uOiAwIH07XG5cbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLk5vcnRoRWFzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IC0xLCBjb2x1bW46IDEgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uRWFzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IDAsIGNvbHVtbjogMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Tb3V0aEVhc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAxLCBjb2x1bW46IDEgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uU291dGg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAxLCBjb2x1bW46IDAgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uU291dGhXZXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogMSwgY29sdW1uOiAtMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5XZXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogMCwgY29sdW1uOiAtMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Ob3J0aFdlc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAtMSwgY29sdW1uOiAtMSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRpbGVCeURpcmVjdGlvbihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldHMgPSB0aGlzLmdldE9mZnNldEJ5RGlyZWN0aW9uKGRpcmVjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdzogcm93ICsgb2Zmc2V0cy5yb3csXG4gICAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIG9mZnNldHMuY29sdW1uXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRUaWxlQnlEaXJlY3Rpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUaWxlV2F0ZXIoY29vcmRpbmF0ZS5yb3csIGNvb3JkaW5hdGUuY29sdW1uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAoIXRoaXMubWFwW3Jvd10gfHwgIXRoaXMubWFwW3Jvd11bY29sdW1uXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzVGlsZUZsYXQocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuaXNUaWxlV2F0ZXIocm93LCBjb2x1bW4pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1hcFtyb3ddW2NvbHVtbl0gIT09IDI1NTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IHRoaXMuZ2V0VGlsZUJ5RGlyZWN0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlzVGlsZUZsYXQoY29vcmRpbmF0ZS5yb3csIGNvb3JkaW5hdGUuY29sdW1uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlU2xvcGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuaXNUaWxlV2F0ZXIocm93LCBjb2x1bW4pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1hcFtyb3ddW2NvbHVtbl0gPT09IDI1NTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldFRpbGVCeURpcmVjdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pc1RpbGVTbG9wZShjb29yZGluYXRlLnJvdywgY29vcmRpbmF0ZS5jb2x1bW4pO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tIFwiLi4vLi4vdHlwZXMvRGlyZWN0aW9uXCI7XG5pbXBvcnQgVGVycmFpbkdyaWQgZnJvbSBcIi4vVGVycmFpbkdyaWRcIjtcbmltcG9ydCB7IFRlcnJhaW5UaWxlRGVmaW5pdGlvbiB9IGZyb20gXCIuL3R5cGVzL1RlcnJhaW5UaWxlRGVmaW5pdGlvblwiO1xuaW1wb3J0IHsgVGVycmFpblRpbGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvVGVycmFpblRpbGVUeXBlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5UaWxlcyB7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmluaXRpb25zOiBUZXJyYWluVGlsZURlZmluaXRpb25bXTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBncmlkOiBUZXJyYWluR3JpZCkge1xuICAgICAgICB0aGlzLmRlZmluaXRpb25zID0gdGhpcy5nZXRUaWxlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGlsZXMoKSB7XG4gICAgICAgIGNvbnN0IHRpbGVzOiBUZXJyYWluVGlsZURlZmluaXRpb25bXSA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5ncmlkLnJvd3M7IHJvdysrKVxuICAgICAgICBmb3IobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMuZ3JpZC5jb2x1bW5zOyBjb2x1bW4rKykge1xuICAgICAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZVdhdGVyKHJvdywgY29sdW1uKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZVNsb3BlKHJvdywgY29sdW1uKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2xvcGUgYXQgXCIgKyByb3cgKyBcIiB4IFwiICsgY29sdW1uKTtcblxuICAgICAgICAgICAgICAgIGZvcihsZXQgZGlyZWN0aW9uID0gNDU7IGRpcmVjdGlvbiA8IDM2MDsgZGlyZWN0aW9uICs9IDkwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoRWFzdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoRWFzdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0U2xvcGVkVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRTbG9wZWRUaWxlSGF2ZUxlZnRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGVMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRTbG9wZWRUaWxlSGF2ZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRTbG9wZWRUaWxlSGF2ZVJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRTbG9wZWRUaWxlUmlnaHRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcblxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFNsb3BlZFRpbGVIYXZlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlKHJvdywgY29sdW1uLCBEaXJlY3Rpb24uTm9ydGgpKTtcblxuICAgICAgICAgICAgZm9yKGxldCBkaXJlY3Rpb24gPSAwOyBkaXJlY3Rpb24gPCAzNjA7IGRpcmVjdGlvbiArPSA5MCkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aWxlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvblNsb3BlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uV2VzdCkpPyhUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2UpOihUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6ICh0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLkVhc3QpKT8oVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZSk6KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gRGlyZWN0aW9uLk5vcnRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIERpcmVjdGlvbi5FYXN0KSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aEVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uRWFzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoV2VzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvblNsb3BlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhXZXN0KSk/KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2UpOihUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aEVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiAodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uU2xvcGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aEVhc3QpKT8oVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2UpOihUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNsb3BlZFRpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFNsb3BlZFRpbGVIYXZlTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoV2VzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aExlZnRGbGF0RWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkU2xvcGVkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoV2VzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkU2xvcGVkVGlsZUhhdmVSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRTbG9wZWRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlXG4gICAgICAgIH07XG4gICAgfVxufTtcbiIsImltcG9ydCB7IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9IGZyb20gXCJjYW52YXNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5HcmlkUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSBvZmZzZXQ6IFBvaW50KSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0dyaWQoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAuMDUpXCI7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLm9mZnNldC5sZWZ0LCB0aGlzLm9mZnNldC50b3ApO1xuXG4gICAgICAgIGNvbnN0IHRvcFN0YXJ0ID0gLXRoaXMub2Zmc2V0LnRvcCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LnRvcCAlIHRoaXMuc2l6ZSkgLSB0aGlzLnNpemUpO1xuICAgICAgICBjb25zdCB0b3BFbmQgPSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDtcblxuICAgICAgICBjb25zdCBsZWZ0U3RhcnQgPSAtdGhpcy5vZmZzZXQubGVmdCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LmxlZnQgJSB0aGlzLnNpemUpIC0gdGhpcy5zaXplKTtcbiAgICAgICAgY29uc3QgbGVmdEVuZCA9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7XG5cbiAgICAgICAgZm9yKGxldCB0b3AgPSB0b3BTdGFydDsgdG9wIDwgdG9wRW5kOyB0b3AgKz0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QobGVmdFN0YXJ0LCB0b3AgLSAuNSwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGxlZnQgPSBsZWZ0U3RhcnQ7IGxlZnQgPCBsZWZ0RW5kOyBsZWZ0ICs9IHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KGxlZnQgLSAuNSwgdG9wU3RhcnQsIDEsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9IGZyb20gXCJjYW52YXNcIjtcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi90eXBlcy9EaXJlY3Rpb25cIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1BvaW50XCI7XG5pbXBvcnQgeyBTaWRlIH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1NpZGVcIjtcbmltcG9ydCB7IFRlcnJhaW5UaWxlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9UZXJyYWluVGlsZVR5cGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpblRpbGVSZW5kZXJlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBoYWxmU2l6ZTogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBlZGdlU2l6ZTogbnVtYmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFsZkVkZ2VTaXplOiBudW1iZXI7XG4gICAgXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlcnJhaW5Db2xvciA9IFwiI0MzRUNCMlwiO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZWRnZUNvbG9yID0gXCIjRkZGMkFGXCI7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlYnVnID0gZmFsc2U7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWJ1Z0Fycm93U2l6ZTogbnVtYmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZGVidWdDb2xvciA9IFwiYmxhY2tcIjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSBvZmZzZXQ6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuaGFsZlNpemUgPSB0aGlzLnNpemUgLyAyO1xuXG4gICAgICAgIHRoaXMuZWRnZVNpemUgPSB0aGlzLnNpemUgKiAwLjI7XG4gICAgICAgIHRoaXMuaGFsZkVkZ2VTaXplID0gdGhpcy5lZGdlU2l6ZSAvIDI7XG5cbiAgICAgICAgdGhpcy5kZWJ1Z0Fycm93U2l6ZSA9IHRoaXMuc2l6ZSAqIDAuMDU7XG4gICAgfTtcblxuICAgIHB1YmxpYyBkcmF3KHR5cGU6IFRlcnJhaW5UaWxlVHlwZSwgcm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGU6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGU6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTbG9wZWRUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoTGVmdEZsYXRFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEFuZ2xlKGRlZ3JlZXM6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKE1hdGguUEkgLyAxODApICogZGVncmVlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRyYW5zZm9ybWF0aW9uKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGVmdCA9IGNvbHVtbiAqIHRoaXMuc2l6ZTtcbiAgICAgICAgY29uc3QgdG9wID0gcm93ICogdGhpcy5zaXplO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUodGhpcy5vZmZzZXQubGVmdCwgdGhpcy5vZmZzZXQudG9wKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZShsZWZ0LCB0b3ApO1xuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yb3RhdGUoKE1hdGguUEkgLyAxODApICogKERpcmVjdGlvbi5Tb3V0aCArIGRpcmVjdGlvbikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0RlYnVnVGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKHRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmRlYnVnQ29sb3I7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIERpcmVjdGlvbi5Tb3V0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChgUm93ICR7cm93fWAsIDAsIDApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJoYW5naW5nXCI7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoYENvbHVtbiAke2NvbHVtbn1gLCAwLCAwKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgZHJhd0RlYnVnQXJyb3cocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZih0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5kZWJ1Z0NvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoMCwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKC10aGlzLmRlYnVnQXJyb3dTaXplLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oMCwgdGhpcy5kZWJ1Z0Fycm93U2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuZGVidWdBcnJvd1NpemUsIDApO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMudGVycmFpbkNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoLXRoaXMuaGFsZlNpemUsIC10aGlzLmhhbGZTaXplLCB0aGlzLnNpemUsIHRoaXMuc2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdEZWJ1Z1RpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbiwgc2lkZTogU2lkZSwgZ2FwOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG5cbiAgICAgICAgaWYoc2lkZSA9PT0gU2lkZS5MZWZ0KVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUgLSBnYXAsIHRoaXMuZWRnZVNpemUpO1xuICAgICAgICBlbHNlIGlmKHNpZGUgPT09IFNpZGUuUmlnaHQpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoLXRoaXMuaGFsZlNpemUgKyBnYXAsIHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUgLSBnYXAsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLkxlZnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuUmlnaHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0xlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSg0NSksIHRoaXMuZ2V0QW5nbGUoNDUgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSg5MCksIHRoaXMuZ2V0QW5nbGUoOTAgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5MZWZ0LCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmRyYXdMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuUmlnaHQsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuZHJhd1JpZ2h0SW5zaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMZWZ0T3V0c2lkZUNvcm5lckVkZ2UoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMudGVycmFpbkNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuaGFsZlNpemUgLSAodGhpcy5oYWxmRWRnZVNpemUgKiAxLjUpLCB0aGlzLmhhbGZTaXplICsgKHRoaXMuaGFsZkVkZ2VTaXplICogMS41KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSAtICh0aGlzLmhhbGZFZGdlU2l6ZSAqIDQpLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYyh0aGlzLmhhbGZTaXplIC0gKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5oYWxmU2l6ZSArICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoLTkwKSwgdGhpcy5nZXRBbmdsZSgtNDUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1JpZ2h0T3V0c2lkZUNvcm5lckVkZ2UoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMudGVycmFpbkNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKC10aGlzLmhhbGZTaXplICsgKHRoaXMuaGFsZkVkZ2VTaXplICogNCksIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKC10aGlzLmhhbGZTaXplICsgKHRoaXMuaGFsZkVkZ2VTaXplICogMiksIHRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbygtdGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyAodGhpcy5lZGdlU2l6ZSAqIDIpLCB0aGlzLmhhbGZTaXplICsgKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSgxODAgKyA0NSksIHRoaXMuZ2V0QW5nbGUoMjcwKSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMuZHJhd0xlZnRPdXRzaWRlQ29ybmVyRWRnZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuTGVmdCwgdGhpcy5lZGdlU2l6ZSAqIDIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMuZHJhd1JpZ2h0T3V0c2lkZUNvcm5lckVkZ2UoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLlJpZ2h0LCB0aGlzLmVkZ2VTaXplICogMik7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy50ZXJyYWluQ29sb3I7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKC10aGlzLmhhbGZTaXplLCAtdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5oYWxmU2l6ZSwgLXRoaXMuaGFsZlNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdEZWJ1Z1RpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTbG9wZWRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24sIHNpZGU6IFNpZGUsIGdhcDogbnVtYmVyID0gMCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuXG4gICAgICAgIGlmKHNpZGUgPT09IFNpZGUuTGVmdClcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAtdGhpcy5oYWxmRWRnZVNpemUgKyAxLjUsIHRoaXMuc2l6ZSAqIC43NSAtIGdhcCwgdGhpcy5lZGdlU2l6ZSk7XG4gICAgICAgIGVsc2UgaWYoc2lkZSA9PT0gU2lkZS5SaWdodClcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgtdGhpcy5oYWxmU2l6ZSAqIDEuNSArIChnYXAgKiAxKSwgLXRoaXMuaGFsZkVkZ2VTaXplICsgMS41LCB0aGlzLnNpemUgKiAuNzUgLSBnYXAsIHRoaXMuZWRnZVNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlV2l0aExlZnRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5MZWZ0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5SaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3U2xvcGVkTGVmdE91dHNpZGVDb3JuZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJvdGF0ZSh0aGlzLmdldEFuZ2xlKDE4MCkpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoLXRoaXMuZWRnZVNpemUgKiAxICsgNCwgLXRoaXMuZWRnZVNpemUgKiAzIC0yKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYygtdGhpcy5oYWxmU2l6ZSArIHRoaXMuZWRnZVNpemUsIHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKDQ1ICsgNDUpLCB0aGlzLmdldEFuZ2xlKCg0NSArIDQ1KSArIDQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGRyYXdTbG9wZWRSaWdodE91dHNpZGVDb3JuZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5lZGdlU2l6ZSArIDEsIDMpXG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSgxODAgKyA0NSksIHRoaXMuZ2V0QW5nbGUoKDE4MCArIDQ1KSArIDQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5SaWdodCwgdGhpcy5lZGdlU2l6ZSk7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZFJpZ2h0T3V0c2lkZUNvcm5lcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3U2xvcGVkRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLkxlZnQsIHRoaXMuZWRnZVNpemUpXG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZExlZnRPdXRzaWRlQ29ybmVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSBmcm9tIFwiY2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi8uLi8uLi90eXBlcy9Qb2ludFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJyYWluV2F0ZXJSZW5kZXJlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3V2F0ZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwiI0FBREFGRlwiO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcbn1cbiIsImV4cG9ydCBlbnVtIFRlcnJhaW5UaWxlVHlwZSB7XG4gICAgRmxhdFRpbGUsXG4gICAgXG4gICAgRmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlLFxuICAgIEZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2UsXG4gICAgXG4gICAgRmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2UsXG4gICAgRmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlLFxuICAgIFxuICAgIEZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZSxcbiAgICBGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlLFxuICAgIFxuICAgIFNsb3BlZFRpbGUsXG4gICAgXG4gICAgU2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2UsXG4gICAgU2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlLFxuXG4gICAgU2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlLFxuICAgIFNsb3BlZFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlXG59O1xuIiwiaW1wb3J0IFRlcnJhaW5DYW52YXMgZnJvbSBcIi4vY29yZS90ZXJyYWluL1RlcnJhaW5DYW52YXNcIjtcbmltcG9ydCBUZXJyYWluRGVidWdDYW52YXMgZnJvbSBcIi4vYnJvd3Nlci9nYW1lL0dhbWVEZWJ1Z0NhbnZhc1wiO1xuaW1wb3J0IFRlcnJhaW5HcmlkIGZyb20gXCIuL2NvcmUvdGVycmFpbi9UZXJyYWluR3JpZFwiO1xuaW1wb3J0IFRlcnJhaW5UaWxlcyBmcm9tIFwiLi9jb3JlL3RlcnJhaW4vVGVycmFpblRpbGVzXCI7XG5pbXBvcnQgQnJvd3NlclRlcnJhaW5HcmlkIGZyb20gXCIuL2Jyb3dzZXIvdGVycmFpbi9Ccm93c2VyVGVycmFpbkdyaWRcIjtcbmltcG9ydCBHYW1lQ2FudmFzIGZyb20gXCIuL2Jyb3dzZXIvZ2FtZS9HYW1lQ2FudmFzXCI7XG5pbXBvcnQgR2FtZVRlcnJhaW5FbnRpdHkgZnJvbSBcIi4vYnJvd3Nlci9nYW1lL2VudGl0aWVzL0dhbWVUZXJyYWluRW50aXR5XCI7XG5cbmNvbnN0IHRlc3RUZXJyYWluR3JpZCA9IG5ldyBUZXJyYWluR3JpZChbXG4gIFsgMSwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCBdLFxuICBbIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDAgXSxcbiAgWyAwLCAwLCAxLCAxLCAxLCAwLCAxLCAxLCAxIF0sXG4gIFsgMCwgMCwgMCwgMSwgMCwgMSwgMSwgMSwgMSBdLFxuICBbIDAsIDAsIDEsIDEsIDEsIDAsIDEsIDAsIDAgXVxuXSk7XG5cblxuKGFzeW5jICgpID0+IHtcbiAgY29uc3Qgc3dlZGVuQXNzZXRzID0gW1xuICAgIFwiU3dlZGVuX0JsZWtpbmdlLmpzb25cIixcbiAgICBcIlN3ZWRlbl9EYWxhcm5hLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Hw6R2bGVib3JnLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Hb3RsYW5kLmpzb25cIixcbiAgICBcIlN3ZWRlbl9IYWxsYW5kLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Kw6RtdGxhbmQuanNvblwiLFxuICAgIFwiU3dlZGVuX0rDtm5rw7ZwaW5nLmpzb25cIixcbiAgICBcIlN3ZWRlbl9LYWxtYXIuanNvblwiLFxuICAgIFwiU3dlZGVuX0tyb25vYmVyZy5qc29uXCIsXG4gICAgXCJTd2VkZW5fTm9ycmJvdHRlbi5qc29uXCIsXG4gICAgXCJTd2VkZW5fT3JlYnJvLmpzb25cIixcbiAgICBcIlN3ZWRlbl/DlnN0ZXJnw7Z0bGFuZC5qc29uXCIsXG4gICAgXCJTd2VkZW5fU2vDpW5lLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Tw7ZkZXJtYW5sYW5kLmpzb25cIixcbiAgICBcIlN3ZWRlbl9TdG9ja2hvbG0uanNvblwiLFxuICAgIFwiU3dlZGVuX1VwcHNhbGEuanNvblwiLFxuICAgIFwiU3dlZGVuX1bDpHJtbGFuZC5qc29uXCIsXG4gICAgXCJTd2VkZW5fVsOkc3RlcmJvdHRlbi5qc29uXCIsXG4gICAgXCJTd2VkZW5fVsOkc3Rlcm5vcnJsYW5kLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Ww6RzdG1hbmxhbmQuanNvblwiLFxuICAgIFwiU3dlZGVuX1bDpHN0cmFfR8O2dGFsYW5kLmpzb25cIlxuICBdO1xuXG4gIGNvbnN0IHRlcnJhaW5HcmlkcyA9IChhd2FpdCBQcm9taXNlLmFsbChzd2VkZW5Bc3NldHMubWFwKChhc3NldCkgPT4ge1xuICAgIHJldHVybiBCcm93c2VyVGVycmFpbkdyaWQuZnJvbUFzc2V0KFwiLi4vYXNzZXRzL3N3ZWRlbi9cIiArIGFzc2V0KTtcbiAgfSkpKTtcbiAgXG4gIGNvbnN0IHRlcnJhaW5UaWxlc0NvbGxlY3Rpb24gPSB0ZXJyYWluR3JpZHMubWFwKCh0ZXJyYWluR3JpZCkgPT4ge1xuICAgIGNvbnN0IHRlcnJhaW5UaWxlcyA9IG5ldyBUZXJyYWluVGlsZXModGVycmFpbkdyaWQpO1xuICAgXG4gICAgcmV0dXJuIHRlcnJhaW5UaWxlcztcbiAgfSk7XG5cbiAgY29uc3QgdGVzdFRlcnJhaW5UaWxlcyA9IG5ldyBUZXJyYWluVGlsZXModGVzdFRlcnJhaW5HcmlkKTtcbiAgY29uc3QgdGVycmFpbkNhbnZhcyA9IG5ldyBUZXJyYWluQ2FudmFzKHRlcnJhaW5UaWxlc0NvbGxlY3Rpb24sIDEwKTtcblxuICBjb25zb2xlLmxvZyh0ZXJyYWluQ2FudmFzLmNhbnZhcyk7XG5cbiAgY29uc3QgZ2FtZVRlcnJhaW5FbnRpdHkgPSBuZXcgR2FtZVRlcnJhaW5FbnRpdHkodGVycmFpbkNhbnZhcyk7XG4gIFxuICBjb25zdCBnYW1lQ2FudmFzID0gbmV3IEdhbWVDYW52YXMoWyBnYW1lVGVycmFpbkVudGl0eSBdKTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChnYW1lQ2FudmFzLmVsZW1lbnQpO1xufSkoKTtcbiIsImV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XG4gICAgTm9ydGggPSAwLFxuICAgIE5vcnRoRWFzdCA9IE5vcnRoICsgNDUsXG4gICAgXG4gICAgRWFzdCA9IDkwLFxuICAgIFNvdXRoRWFzdCA9IEVhc3QgKyA0NSxcblxuICAgIFNvdXRoID0gMTgwLFxuICAgIFNvdXRoV2VzdCA9IFNvdXRoICsgNDUsXG5cbiAgICBXZXN0ID0gMjcwLFxuICAgIE5vcnRoV2VzdCA9IFdlc3QgKyA0NVxufVxuIiwiZXhwb3J0IGVudW0gU2lkZSB7XG4gICAgTGVmdCxcbiAgICBSaWdodFxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9