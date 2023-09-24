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
    constructor(tiles, size, debug = false) {
        this.tiles = tiles;
        this.size = size;
        this.debug = debug;
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
        const terrainTileRenderer = new TerrainTileRenderer_1.default(context, this.size, offset, this.debug);
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
    constructor(context, size, offset, debug = false) {
        this.context = context;
        this.size = size;
        this.offset = offset;
        this.debug = debug;
        this.terrainColor = "#C3ECB2";
        this.edgeColor = "#FFF2AF";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUM7SUFFSCxNQUFNLGdCQUFnQixHQUFHLElBQUksc0JBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMzRCxNQUFNLGFBQWEsR0FBRyxJQUFJLHVCQUFhLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFbEMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLDJCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRS9ELE1BQU0sVUFBVSxHQUFHLElBQUksb0JBQVUsQ0FBQyxDQUFFLGlCQUFpQixDQUFFLENBQUMsQ0FBQztJQUV6RCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsQ0FBQyxFQUFDLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDOURMLElBQVksU0FZWDtBQVpELFdBQVksU0FBUztJQUNqQiwyQ0FBUztJQUNULG9EQUFzQjtJQUV0QiwwQ0FBUztJQUNULHFEQUFxQjtJQUVyQiw2Q0FBVztJQUNYLHFEQUFzQjtJQUV0QiwyQ0FBVTtJQUNWLHFEQUFxQjtBQUN6QixDQUFDLEVBWlcsU0FBUyx5QkFBVCxTQUFTLFFBWXBCOzs7Ozs7Ozs7Ozs7Ozs7QUNaRCxJQUFZLElBR1g7QUFIRCxXQUFZLElBQUk7SUFDWiwrQkFBSTtJQUNKLGlDQUFLO0FBQ1QsQ0FBQyxFQUhXLElBQUksb0JBQUosSUFBSSxRQUdmOzs7Ozs7O1VDSEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RlcnJhaW4yZHJlbmRlcmVyLy4vbm9kZV9tb2R1bGVzL2NhbnZhcy9icm93c2VyLmpzIiwid2VicGFjazovL3RlcnJhaW4yZHJlbmRlcmVyLy4vbm9kZV9tb2R1bGVzL2NhbnZhcy9saWIvcGFyc2UtZm9udC5qcyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci8uL3NyYy9icm93c2VyL2dhbWUvR2FtZUNhbnZhcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci8uL3NyYy9icm93c2VyL2dhbWUvZW50aXRpZXMvR2FtZVRlcnJhaW5FbnRpdHkudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbjJkcmVuZGVyZXIvLi9zcmMvYnJvd3Nlci9nYW1lL2V2ZW50cy9HYW1lQ2FudmFzTW91c2VFdmVudHMudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbjJkcmVuZGVyZXIvLi9zcmMvYnJvd3Nlci90ZXJyYWluL0Jyb3dzZXJUZXJyYWluR3JpZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci8uL3NyYy9jb3JlL3RlcnJhaW4vVGVycmFpbkNhbnZhcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci8uL3NyYy9jb3JlL3RlcnJhaW4vVGVycmFpbkdyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbjJkcmVuZGVyZXIvLi9zcmMvY29yZS90ZXJyYWluL1RlcnJhaW5UaWxlcy50cyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci8uL3NyYy9jb3JlL3RlcnJhaW4vcmVuZGVyZXJzL1RlcnJhaW5HcmlkUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbjJkcmVuZGVyZXIvLi9zcmMvY29yZS90ZXJyYWluL3JlbmRlcmVycy9UZXJyYWluVGlsZVJlbmRlcmVyLnRzIiwid2VicGFjazovL3RlcnJhaW4yZHJlbmRlcmVyLy4vc3JjL2NvcmUvdGVycmFpbi9yZW5kZXJlcnMvVGVycmFpbldhdGVyUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbjJkcmVuZGVyZXIvLi9zcmMvY29yZS90ZXJyYWluL3R5cGVzL1RlcnJhaW5UaWxlVHlwZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci8uL3NyYy90eXBlcy9EaXJlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vdGVycmFpbjJkcmVuZGVyZXIvLi9zcmMvdHlwZXMvU2lkZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4yZHJlbmRlcmVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluMmRyZW5kZXJlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFscyBkb2N1bWVudCwgSW1hZ2VEYXRhICovXG5cbmNvbnN0IHBhcnNlRm9udCA9IHJlcXVpcmUoJy4vbGliL3BhcnNlLWZvbnQnKVxuXG5leHBvcnRzLnBhcnNlRm9udCA9IHBhcnNlRm9udFxuXG5leHBvcnRzLmNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLCB7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfSlcbn1cblxuZXhwb3J0cy5jcmVhdGVJbWFnZURhdGEgPSBmdW5jdGlvbiAoYXJyYXksIHdpZHRoLCBoZWlnaHQpIHtcbiAgLy8gQnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBJbWFnZURhdGEgbG9va3MgYXQgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgcGFzc2VkXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIG5ldyBJbWFnZURhdGEoKVxuICAgIGNhc2UgMTogcmV0dXJuIG5ldyBJbWFnZURhdGEoYXJyYXkpXG4gICAgY2FzZSAyOiByZXR1cm4gbmV3IEltYWdlRGF0YShhcnJheSwgd2lkdGgpXG4gICAgZGVmYXVsdDogcmV0dXJuIG5ldyBJbWFnZURhdGEoYXJyYXksIHdpZHRoLCBoZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0cy5sb2FkSW1hZ2UgPSBmdW5jdGlvbiAoc3JjLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgY29uc3QgaW1hZ2UgPSBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpLCBvcHRpb25zKVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cCAoKSB7XG4gICAgICBpbWFnZS5vbmxvYWQgPSBudWxsXG4gICAgICBpbWFnZS5vbmVycm9yID0gbnVsbFxuICAgIH1cblxuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHsgY2xlYW51cCgpOyByZXNvbHZlKGltYWdlKSB9XG4gICAgaW1hZ2Uub25lcnJvciA9IGZ1bmN0aW9uICgpIHsgY2xlYW51cCgpOyByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCB0aGUgaW1hZ2UgXCInICsgc3JjICsgJ1wiJykpIH1cblxuICAgIGltYWdlLnNyYyA9IHNyY1xuICB9KVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogRm9udCBSZWdFeHAgaGVscGVycy5cbiAqL1xuXG5jb25zdCB3ZWlnaHRzID0gJ2JvbGR8Ym9sZGVyfGxpZ2h0ZXJ8WzEtOV0wMCdcbmNvbnN0IHN0eWxlcyA9ICdpdGFsaWN8b2JsaXF1ZSdcbmNvbnN0IHZhcmlhbnRzID0gJ3NtYWxsLWNhcHMnXG5jb25zdCBzdHJldGNoZXMgPSAndWx0cmEtY29uZGVuc2VkfGV4dHJhLWNvbmRlbnNlZHxjb25kZW5zZWR8c2VtaS1jb25kZW5zZWR8c2VtaS1leHBhbmRlZHxleHBhbmRlZHxleHRyYS1leHBhbmRlZHx1bHRyYS1leHBhbmRlZCdcbmNvbnN0IHVuaXRzID0gJ3B4fHB0fHBjfGlufGNtfG1tfCV8ZW18ZXh8Y2h8cmVtfHEnXG5jb25zdCBzdHJpbmcgPSAnXFwnKFteXFwnXSspXFwnfFwiKFteXCJdKylcInxbXFxcXHdcXFxccy1dKydcblxuLy8gWyBbIDzigJhmb250LXN0eWxl4oCZPiB8fCA8Zm9udC12YXJpYW50LWNzczIxPiB8fCA84oCYZm9udC13ZWlnaHTigJk+IHx8IDzigJhmb250LXN0cmV0Y2jigJk+IF0/XG4vLyAgICA84oCYZm9udC1zaXpl4oCZPiBbIC8gPOKAmGxpbmUtaGVpZ2h04oCZPiBdPyA84oCYZm9udC1mYW1pbHnigJk+IF1cbi8vIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtZm9udHMtMy8jZm9udC1wcm9wXG5jb25zdCB3ZWlnaHRSZSA9IG5ldyBSZWdFeHAoYCgke3dlaWdodHN9KSArYCwgJ2knKVxuY29uc3Qgc3R5bGVSZSA9IG5ldyBSZWdFeHAoYCgke3N0eWxlc30pICtgLCAnaScpXG5jb25zdCB2YXJpYW50UmUgPSBuZXcgUmVnRXhwKGAoJHt2YXJpYW50c30pICtgLCAnaScpXG5jb25zdCBzdHJldGNoUmUgPSBuZXcgUmVnRXhwKGAoJHtzdHJldGNoZXN9KSArYCwgJ2knKVxuY29uc3Qgc2l6ZUZhbWlseVJlID0gbmV3IFJlZ0V4cChcbiAgYChbXFxcXGRcXFxcLl0rKSgke3VuaXRzfSkgKigoPzoke3N0cmluZ30pKCAqLCAqKD86JHtzdHJpbmd9KSkqKWApXG5cbi8qKlxuICogQ2FjaGUgZm9udCBwYXJzaW5nLlxuICovXG5cbmNvbnN0IGNhY2hlID0ge31cblxuY29uc3QgZGVmYXVsdEhlaWdodCA9IDE2IC8vIHB0LCBjb21tb24gYnJvd3NlciBkZWZhdWx0XG5cbi8qKlxuICogUGFyc2UgZm9udCBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9IFBhcnNlZCBmb250LiBgc2l6ZWAgaXMgaW4gZGV2aWNlIHVuaXRzLiBgdW5pdGAgaXMgdGhlIHVuaXRcbiAqICAgYXBwZWFyaW5nIGluIHRoZSBpbnB1dCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0ciA9PiB7XG4gIC8vIENhY2hlZFxuICBpZiAoY2FjaGVbc3RyXSkgcmV0dXJuIGNhY2hlW3N0cl1cblxuICAvLyBUcnkgZm9yIHJlcXVpcmVkIHByb3BlcnRpZXMgZmlyc3QuXG4gIGNvbnN0IHNpemVGYW1pbHkgPSBzaXplRmFtaWx5UmUuZXhlYyhzdHIpXG4gIGlmICghc2l6ZUZhbWlseSkgcmV0dXJuIC8vIGludmFsaWRcblxuICAvLyBEZWZhdWx0IHZhbHVlcyBhbmQgcmVxdWlyZWQgcHJvcGVydGllc1xuICBjb25zdCBmb250ID0ge1xuICAgIHdlaWdodDogJ25vcm1hbCcsXG4gICAgc3R5bGU6ICdub3JtYWwnLFxuICAgIHN0cmV0Y2g6ICdub3JtYWwnLFxuICAgIHZhcmlhbnQ6ICdub3JtYWwnLFxuICAgIHNpemU6IHBhcnNlRmxvYXQoc2l6ZUZhbWlseVsxXSksXG4gICAgdW5pdDogc2l6ZUZhbWlseVsyXSxcbiAgICBmYW1pbHk6IHNpemVGYW1pbHlbM10ucmVwbGFjZSgvW1wiJ10vZywgJycpLnJlcGxhY2UoLyAqLCAqL2csICcsJylcbiAgfVxuXG4gIC8vIE9wdGlvbmFsLCB1bm9yZGVyZWQgcHJvcGVydGllcy5cbiAgbGV0IHdlaWdodCwgc3R5bGUsIHZhcmlhbnQsIHN0cmV0Y2hcbiAgLy8gU3RvcCBzZWFyY2ggYXQgYHNpemVGYW1pbHkuaW5kZXhgXG4gIGNvbnN0IHN1YnN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgc2l6ZUZhbWlseS5pbmRleClcbiAgaWYgKCh3ZWlnaHQgPSB3ZWlnaHRSZS5leGVjKHN1YnN0cikpKSBmb250LndlaWdodCA9IHdlaWdodFsxXVxuICBpZiAoKHN0eWxlID0gc3R5bGVSZS5leGVjKHN1YnN0cikpKSBmb250LnN0eWxlID0gc3R5bGVbMV1cbiAgaWYgKCh2YXJpYW50ID0gdmFyaWFudFJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQudmFyaWFudCA9IHZhcmlhbnRbMV1cbiAgaWYgKChzdHJldGNoID0gc3RyZXRjaFJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQuc3RyZXRjaCA9IHN0cmV0Y2hbMV1cblxuICAvLyBDb252ZXJ0IHRvIGRldmljZSB1bml0cy4gKGBmb250LnVuaXRgIGlzIHRoZSBvcmlnaW5hbCB1bml0KVxuICAvLyBUT0RPOiBjaCwgZXhcbiAgc3dpdGNoIChmb250LnVuaXQpIHtcbiAgICBjYXNlICdwdCc6XG4gICAgICBmb250LnNpemUgLz0gMC43NVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdwYyc6XG4gICAgICBmb250LnNpemUgKj0gMTZcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnaW4nOlxuICAgICAgZm9udC5zaXplICo9IDk2XG4gICAgICBicmVha1xuICAgIGNhc2UgJ2NtJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSA5Ni4wIC8gMi41NFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdtbSc6XG4gICAgICBmb250LnNpemUgKj0gOTYuMCAvIDI1LjRcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnJSc6XG4gICAgICAvLyBUT0RPIGRpc2FibGVkIGJlY2F1c2UgZXhpc3RpbmcgdW5pdCB0ZXN0cyBhc3N1bWUgMTAwXG4gICAgICAvLyBmb250LnNpemUgKj0gZGVmYXVsdEhlaWdodCAvIDEwMCAvIDAuNzVcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnZW0nOlxuICAgIGNhc2UgJ3JlbSc6XG4gICAgICBmb250LnNpemUgKj0gZGVmYXVsdEhlaWdodCAvIDAuNzVcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAncSc6XG4gICAgICBmb250LnNpemUgKj0gOTYgLyAyNS40IC8gNFxuICAgICAgYnJlYWtcbiAgfVxuXG4gIHJldHVybiAoY2FjaGVbc3RyXSA9IGZvbnQpXG59XG4iLCJpbXBvcnQgeyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSBmcm9tIFwiY2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzIGZyb20gXCIuL2V2ZW50cy9HYW1lQ2FudmFzTW91c2VFdmVudHNcIjtcbmltcG9ydCBHYW1lQ2FudmFzRW50aXR5IGZyb20gXCIuL3R5cGVzL0dhbWVDYW52YXNFbnRpdHlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNhbnZhcyB7XG4gICAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbW91c2VFdmVudHMgPSBuZXcgVGVycmFpbkNhbnZhc01vdXNlRXZlbnRzKHRoaXMuZWxlbWVudCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNhbnZhc0VudGl0aWVzOiBHYW1lQ2FudmFzRW50aXR5W10gPSBbXSkge1xuICAgICAgICB0aGlzLnJlcXVlc3RSZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHJlcXVlc3RSZW5kZXIoKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBib3VuZHMud2lkdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBib3VuZHMuaGVpZ2h0O1xuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICB0b3A6IHRoaXMubW91c2VFdmVudHMub2Zmc2V0LnRvcFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vdGhpcy5vZmZzZXQubGVmdCA9ICAtIE1hdGguZmxvb3IoKHRoaXMudGlsZXMuZ3JpZC5jb2x1bW5zICogdGhpcy5zaXplKSAvIDIpO1xuICAgICAgICAvL3RoaXMub2Zmc2V0LnRvcCA9ICAtIE1hdGguZmxvb3IoKHRoaXMudGlsZXMuZ3JpZC5yb3dzICogdGhpcy5zaXplKSAvIDIpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpIGFzIHVua25vd24gYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgICAgIGZvcihsZXQgY2FudmFzRW50aXR5IG9mIHRoaXMuY2FudmFzRW50aXRpZXMpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgICAgICBjYW52YXNFbnRpdHkuZHJhdyhjb250ZXh0LCBvZmZzZXQpO1xuXG4gICAgICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVxdWVzdFJlbmRlcigpO1xuICAgIH07XG59O1xuIiwiaW1wb3J0IHsgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0gZnJvbSBcImNhbnZhc1wiO1xuaW1wb3J0IFRlcnJhaW5DYW52YXMgZnJvbSBcIi4uLy4uLy4uL2NvcmUvdGVycmFpbi9UZXJyYWluQ2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi8uLi8uLi90eXBlcy9Qb2ludFwiO1xuaW1wb3J0IEdhbWVDYW52YXNFbnRpdHkgZnJvbSBcIi4uL3R5cGVzL0dhbWVDYW52YXNFbnRpdHlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVRlcnJhaW5FbnRpdHkgaW1wbGVtZW50cyBHYW1lQ2FudmFzRW50aXR5IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRlcnJhaW5DYW52YXM6IFRlcnJhaW5DYW52YXMpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHVibGljIGRyYXcoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBvZmZzZXQ6IFBvaW50KTogdm9pZCB7XG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMudGVycmFpbkNhbnZhcy5jYW52YXMsXG4gICAgICAgICAgICAwLCAwLCB0aGlzLnRlcnJhaW5DYW52YXMuY2FudmFzLndpZHRoLCB0aGlzLnRlcnJhaW5DYW52YXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgIG9mZnNldC5sZWZ0LCBvZmZzZXQudG9wLCB0aGlzLnRlcnJhaW5DYW52YXMuY2FudmFzLndpZHRoLCB0aGlzLnRlcnJhaW5DYW52YXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbn0iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi8uLi8uLi90eXBlcy9Qb2ludFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ2FudmFzTW91c2VFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5tb3VzZWRvd24uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9mZnNldDogUG9pbnQgPSB7XG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMFxuICAgIH07XG5cbiAgICBwcml2YXRlIGxhc3RNb3VzZVBhZ2VPZmZzZXQ6IFBvaW50ID0ge1xuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0b3A6IDBcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBtb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5sYXN0TW91c2VQYWdlT2Zmc2V0ID0ge1xuICAgICAgICAgICAgbGVmdDogZXZlbnQucGFnZVgsXG4gICAgICAgICAgICB0b3A6IGV2ZW50LnBhZ2VZXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZW1vdmVFdmVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgdGhpcy5tb3VzZXVwRXZlbnQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZXVwRXZlbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbW91c2Vtb3ZlRXZlbnQgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xuICAgIHByaXZhdGUgbW91c2Vtb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSB7XG4gICAgICAgICAgICBsZWZ0OiBldmVudC5wYWdlWCAtIHRoaXMubGFzdE1vdXNlUGFnZU9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgdG9wOiBldmVudC5wYWdlWSAtIHRoaXMubGFzdE1vdXNlUGFnZU9mZnNldC50b3BcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxhc3RNb3VzZVBhZ2VPZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiBldmVudC5wYWdlWCxcbiAgICAgICAgICAgIHRvcDogZXZlbnQucGFnZVlcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm9mZnNldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMub2Zmc2V0LmxlZnQgKyBkaWZmZXJlbmNlLmxlZnQsXG4gICAgICAgICAgICB0b3A6IHRoaXMub2Zmc2V0LnRvcCArIGRpZmZlcmVuY2UudG9wXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHByaXZhdGUgbW91c2V1cEV2ZW50ID0gdGhpcy5tb3VzZXVwLmJpbmQodGhpcyk7XG4gICAgcHJpdmF0ZSBtb3VzZXVwKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlbW92ZUV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm1vdXNldXBFdmVudCk7XG4gICAgfVxufTtcbiIsImltcG9ydCBUZXJyYWluR3JpZCBmcm9tIFwiLi4vLi4vY29yZS90ZXJyYWluL1RlcnJhaW5HcmlkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyb3dzZXJUZXJyYWluR3JpZCB7XG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBmcm9tQXNzZXQocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocGF0aCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFRlcnJhaW5HcmlkKHJlc3VsdCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFRlcnJhaW5HcmlkUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5HcmlkUmVuZGVyZXJcIjtcbmltcG9ydCBUZXJyYWluVGlsZVJlbmRlcmVyIGZyb20gXCIuL3JlbmRlcmVycy9UZXJyYWluVGlsZVJlbmRlcmVyXCI7XG5pbXBvcnQgVGVycmFpbldhdGVyUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL1RlcnJhaW5XYXRlclJlbmRlcmVyXCI7XG5pbXBvcnQgVGVycmFpblRpbGVzIGZyb20gXCIuL1RlcnJhaW5UaWxlc1wiO1xuaW1wb3J0IHsgY3JlYXRlQ2FudmFzIH0gZnJvbSBcImNhbnZhc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJyYWluQ2FudmFzIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvd3M6IG51bWJlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbHVtbnM6IG51bWJlcjtcblxuICAgIHB1YmxpYyByZWFkb25seSBjYW52YXMgPSBjcmVhdGVDYW52YXMoMCwgMCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRpbGVzOiBUZXJyYWluVGlsZXNbXSwgcHJpdmF0ZSByZWFkb25seSBzaXplOiBudW1iZXIsIHByaXZhdGUgcmVhZG9ubHkgZGVidWc6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICB0aGlzLnJvd3MgPSBNYXRoLm1heCguLi50aWxlcy5tYXAoKHRpbGVzKSA9PiB0aWxlcy5ncmlkLnJvd3MpKTtcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gTWF0aC5tYXgoLi4udGlsZXMubWFwKCh0aWxlcykgPT4gdGlsZXMuZ3JpZC5jb2x1bW5zKSk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXF1ZXN0UmVuZGVyKCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNvbHVtbnMgKiB0aGlzLnNpemU7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMucm93cyAqIHRoaXMuc2l6ZTtcblxuICAgICAgICAvL3RoaXMub2Zmc2V0LmxlZnQgPSAgLSBNYXRoLmZsb29yKCh0aGlzLnRpbGVzLmdyaWQuY29sdW1ucyAqIHRoaXMuc2l6ZSkgLyAyKTtcbiAgICAgICAgLy90aGlzLm9mZnNldC50b3AgPSAgLSBNYXRoLmZsb29yKCh0aGlzLnRpbGVzLmdyaWQucm93cyAqIHRoaXMuc2l6ZSkgLyAyKTtcblxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpITtcblxuICAgICAgICBjb25zdCBvZmZzZXQgPSB7XG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGVycmFpbldhdGVyUmVuZGVyZXIgPSBuZXcgVGVycmFpbldhdGVyUmVuZGVyZXIoY29udGV4dCk7XG4gICAgICAgIHRlcnJhaW5XYXRlclJlbmRlcmVyLmRyYXdXYXRlcigpO1xuXG4gICAgICAgIGNvbnN0IHRlcnJhaW5HcmlkUmVuZGVyZXIgPSBuZXcgVGVycmFpbkdyaWRSZW5kZXJlcihjb250ZXh0LCB0aGlzLnNpemUsIG9mZnNldCk7XG4gICAgICAgIHRlcnJhaW5HcmlkUmVuZGVyZXIuZHJhd0dyaWQoKTtcblxuICAgICAgICBjb25zdCB0ZXJyYWluVGlsZVJlbmRlcmVyID0gbmV3IFRlcnJhaW5UaWxlUmVuZGVyZXIoY29udGV4dCwgdGhpcy5zaXplLCBvZmZzZXQsIHRoaXMuZGVidWcpO1xuXG4gICAgICAgIGZvcihsZXQgdGlsZXMgb2YgdGhpcy50aWxlcykge1xuICAgICAgICAgICAgZm9yKGxldCB0aWxlRGVmaW5pdGlvbiBvZiB0aWxlcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhdyh0aWxlRGVmaW5pdGlvbi50eXBlLCB0aWxlRGVmaW5pdGlvbi5yb3csIHRpbGVEZWZpbml0aW9uLmNvbHVtbiwgdGlsZURlZmluaXRpb24uZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGxldCB0aWxlRGVmaW5pdGlvbiBvZiB0aWxlcy5kZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgIHRlcnJhaW5UaWxlUmVuZGVyZXIuZHJhd0RlYnVnQXJyb3codGlsZURlZmluaXRpb24ucm93LCB0aWxlRGVmaW5pdGlvbi5jb2x1bW4sIHRpbGVEZWZpbml0aW9uLmRpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsImltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi8uLi90eXBlcy9EaXJlY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbkdyaWQge1xuICAgIHB1YmxpYyByZWFkb25seSByb3dzOiBudW1iZXI7XG4gICAgcHVibGljIHJlYWRvbmx5IGNvbHVtbnM6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWFwOiBudW1iZXJbXVtdKSB7XG4gICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgbWFwLmxlbmd0aDsgcm93KyspXG4gICAgICAgICAgICB0aGlzLm1hcFtyb3ddID0gWyAwLCAuLi5tYXBbcm93XSwgMCBdO1xuXG4gICAgICAgIHRoaXMubWFwLnVuc2hpZnQoW10pO1xuICAgICAgICB0aGlzLm1hcC5wdXNoKFtdKTtcblxuICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMubWFwLmxlbmd0aDsgcm93KyspXG4gICAgICAgIGZvcihsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgdGhpcy5tYXBbcm93XS5sZW5ndGg7IGNvbHVtbisrKSB7XG4gICAgICAgICAgICBpZighdGhpcy5pc1RpbGVXYXRlcihyb3csIGNvbHVtbikpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGZvcihsZXQgZGlyZWN0aW9uID0gMDsgZGlyZWN0aW9uIDwgMzYwOyBkaXJlY3Rpb24gKz0gOTApIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLkVhc3QpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc1RpbGVCeURpcmVjdGlvbkZsYXQocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5XZXN0KSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBbcm93XVtjb2x1bW5dID0gMjU1O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBzbG9wZSBhdCBcIiArIHJvdyArIFwiIHggXCIgKyBjb2x1bW4gKyBcIiBhdCBkaXJlY3Rpb24gXCIgKyBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3dzID0gdGhpcy5tYXAubGVuZ3RoO1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBNYXRoLm1heCguLi50aGlzLm1hcC5tYXAoKHJvdykgPT4gcm93Lmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T2Zmc2V0QnlEaXJlY3Rpb24oZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgd2hpbGUoZGlyZWN0aW9uID49IDM2MClcbiAgICAgICAgICAgIGRpcmVjdGlvbiAtPSAzNjA7XG5cbiAgICAgICAgd2hpbGUoZGlyZWN0aW9uIDwgMClcbiAgICAgICAgICAgIGRpcmVjdGlvbiArPSAzNjA7XG5cbiAgICAgICAgc3dpdGNoKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uTm9ydGg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAtMSwgY29sdW1uOiAwIH07XG5cbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLk5vcnRoRWFzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IC0xLCBjb2x1bW46IDEgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uRWFzdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3c6IDAsIGNvbHVtbjogMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Tb3V0aEVhc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAxLCBjb2x1bW46IDEgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uU291dGg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAxLCBjb2x1bW46IDAgfTtcblxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uU291dGhXZXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogMSwgY29sdW1uOiAtMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5XZXN0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogMCwgY29sdW1uOiAtMSB9O1xuXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5Ob3J0aFdlc3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiAtMSwgY29sdW1uOiAtMSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRpbGVCeURpcmVjdGlvbihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldHMgPSB0aGlzLmdldE9mZnNldEJ5RGlyZWN0aW9uKGRpcmVjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdzogcm93ICsgb2Zmc2V0cy5yb3csXG4gICAgICAgICAgICBjb2x1bW46IGNvbHVtbiArIG9mZnNldHMuY29sdW1uXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRUaWxlQnlEaXJlY3Rpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUaWxlV2F0ZXIoY29vcmRpbmF0ZS5yb3csIGNvb3JkaW5hdGUuY29sdW1uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlV2F0ZXIocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAoIXRoaXMubWFwW3Jvd10gfHwgIXRoaXMubWFwW3Jvd11bY29sdW1uXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzVGlsZUZsYXQocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuaXNUaWxlV2F0ZXIocm93LCBjb2x1bW4pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1hcFtyb3ddW2NvbHVtbl0gIT09IDI1NTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlQnlEaXJlY3Rpb25GbGF0KHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IHRoaXMuZ2V0VGlsZUJ5RGlyZWN0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlzVGlsZUZsYXQoY29vcmRpbmF0ZS5yb3csIGNvb3JkaW5hdGUuY29sdW1uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlU2xvcGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuaXNUaWxlV2F0ZXIocm93LCBjb2x1bW4pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1hcFtyb3ddW2NvbHVtbl0gPT09IDI1NTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldFRpbGVCeURpcmVjdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pc1RpbGVTbG9wZShjb29yZGluYXRlLnJvdywgY29vcmRpbmF0ZS5jb2x1bW4pO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tIFwiLi4vLi4vdHlwZXMvRGlyZWN0aW9uXCI7XG5pbXBvcnQgVGVycmFpbkdyaWQgZnJvbSBcIi4vVGVycmFpbkdyaWRcIjtcbmltcG9ydCB7IFRlcnJhaW5UaWxlRGVmaW5pdGlvbiB9IGZyb20gXCIuL3R5cGVzL1RlcnJhaW5UaWxlRGVmaW5pdGlvblwiO1xuaW1wb3J0IHsgVGVycmFpblRpbGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvVGVycmFpblRpbGVUeXBlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5UaWxlcyB7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmluaXRpb25zOiBUZXJyYWluVGlsZURlZmluaXRpb25bXTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBncmlkOiBUZXJyYWluR3JpZCkge1xuICAgICAgICB0aGlzLmRlZmluaXRpb25zID0gdGhpcy5nZXRUaWxlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGlsZXMoKSB7XG4gICAgICAgIGNvbnN0IHRpbGVzOiBUZXJyYWluVGlsZURlZmluaXRpb25bXSA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5ncmlkLnJvd3M7IHJvdysrKVxuICAgICAgICBmb3IobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMuZ3JpZC5jb2x1bW5zOyBjb2x1bW4rKykge1xuICAgICAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZVdhdGVyKHJvdywgY29sdW1uKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZVNsb3BlKHJvdywgY29sdW1uKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2xvcGUgYXQgXCIgKyByb3cgKyBcIiB4IFwiICsgY29sdW1uKTtcblxuICAgICAgICAgICAgICAgIGZvcihsZXQgZGlyZWN0aW9uID0gNDU7IGRpcmVjdGlvbiA8IDM2MDsgZGlyZWN0aW9uICs9IDkwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoRWFzdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoRWFzdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0U2xvcGVkVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRTbG9wZWRUaWxlSGF2ZUxlZnRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGVMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRTbG9wZWRUaWxlSGF2ZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRTbG9wZWRUaWxlSGF2ZVJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIDQ1KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRTbG9wZWRUaWxlUmlnaHRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcblxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFNsb3BlZFRpbGVIYXZlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldFNsb3BlZFRpbGVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlKHJvdywgY29sdW1uLCBEaXJlY3Rpb24uTm9ydGgpKTtcblxuICAgICAgICAgICAgZm9yKGxldCBkaXJlY3Rpb24gPSAwOyBkaXJlY3Rpb24gPCAzNjA7IGRpcmVjdGlvbiArPSA5MCkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgICAgICAgICB0aWxlcy5wdXNoKHRoaXMuZ2V0RmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaCh0aGlzLmdldEZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICAgICAgICAgIHRpbGVzLnB1c2godGhpcy5nZXRGbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aWxlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZUxlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvblNsb3BlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uV2VzdCkpPyhUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2UpOihUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdWxkVGlsZUhhdmVSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6ICh0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25TbG9wZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLkVhc3QpKT8oVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZSk6KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gRGlyZWN0aW9uLk5vcnRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiAtIERpcmVjdGlvbi5FYXN0KSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aEVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uRWFzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYodGhpcy5zaG91bGRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmdyaWQuaXNUaWxlQnlEaXJlY3Rpb25XYXRlcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoV2VzdCkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogKHRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvblNsb3BlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gKyBEaXJlY3Rpb24uTm9ydGhXZXN0KSk/KFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhMZWZ0RmxhdEVkZ2UpOihUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdE91dHNpZGVDb3JuZXJFZGdlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkVGlsZUhhdmVSaWdodE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JpZC5pc1RpbGVCeURpcmVjdGlvbldhdGVyKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uV2F0ZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aEVhc3QpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiAodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uU2xvcGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbiArIERpcmVjdGlvbi5Ob3J0aEVhc3QpKT8oVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2UpOihUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNsb3BlZFRpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFNsb3BlZFRpbGVIYXZlTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoV2VzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aExlZnRGbGF0RWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkU2xvcGVkVGlsZUhhdmVMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLk5vcnRoV2VzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlTGVmdE91dHNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdWxkU2xvcGVkVGlsZUhhdmVSaWdodEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYodGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlUmlnaHRGbGF0RWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhSaWdodEZsYXRFZGdlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGRTbG9wZWRUaWxlSGF2ZVJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZighdGhpcy5ncmlkLmlzVGlsZUJ5RGlyZWN0aW9uRmxhdChyb3csIGNvbHVtbiwgZGlyZWN0aW9uICsgRGlyZWN0aW9uLlNvdXRoRWFzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTbG9wZWRUaWxlUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3csXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlXG4gICAgICAgIH07XG4gICAgfVxufTtcbiIsImltcG9ydCB7IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9IGZyb20gXCJjYW52YXNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1BvaW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlcnJhaW5HcmlkUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcml2YXRlIHJlYWRvbmx5IHNpemU6IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSBvZmZzZXQ6IFBvaW50KSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0dyaWQoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAuMDUpXCI7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLm9mZnNldC5sZWZ0LCB0aGlzLm9mZnNldC50b3ApO1xuXG4gICAgICAgIGNvbnN0IHRvcFN0YXJ0ID0gLXRoaXMub2Zmc2V0LnRvcCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LnRvcCAlIHRoaXMuc2l6ZSkgLSB0aGlzLnNpemUpO1xuICAgICAgICBjb25zdCB0b3BFbmQgPSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDtcblxuICAgICAgICBjb25zdCBsZWZ0U3RhcnQgPSAtdGhpcy5vZmZzZXQubGVmdCArIE1hdGguZmxvb3IoKHRoaXMub2Zmc2V0LmxlZnQgJSB0aGlzLnNpemUpIC0gdGhpcy5zaXplKTtcbiAgICAgICAgY29uc3QgbGVmdEVuZCA9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7XG5cbiAgICAgICAgZm9yKGxldCB0b3AgPSB0b3BTdGFydDsgdG9wIDwgdG9wRW5kOyB0b3AgKz0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QobGVmdFN0YXJ0LCB0b3AgLSAuNSwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGxlZnQgPSBsZWZ0U3RhcnQ7IGxlZnQgPCBsZWZ0RW5kOyBsZWZ0ICs9IHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KGxlZnQgLSAuNSwgdG9wU3RhcnQsIDEsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9IGZyb20gXCJjYW52YXNcIjtcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi90eXBlcy9EaXJlY3Rpb25cIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1BvaW50XCI7XG5pbXBvcnQgeyBTaWRlIH0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzL1NpZGVcIjtcbmltcG9ydCB7IFRlcnJhaW5UaWxlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9UZXJyYWluVGlsZVR5cGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpblRpbGVSZW5kZXJlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBoYWxmU2l6ZTogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBlZGdlU2l6ZTogbnVtYmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFsZkVkZ2VTaXplOiBudW1iZXI7XG4gICAgXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlcnJhaW5Db2xvciA9IFwiI0MzRUNCMlwiO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZWRnZUNvbG9yID0gXCIjRkZGMkFGXCI7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlYnVnQXJyb3dTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWJ1Z0NvbG9yID0gXCJibGFja1wiO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHByaXZhdGUgcmVhZG9ubHkgc2l6ZTogbnVtYmVyLCBwcml2YXRlIHJlYWRvbmx5IG9mZnNldDogUG9pbnQsIHByaXZhdGUgcmVhZG9ubHkgZGVidWc6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmhhbGZTaXplID0gdGhpcy5zaXplIC8gMjtcblxuICAgICAgICB0aGlzLmVkZ2VTaXplID0gdGhpcy5zaXplICogMC4yO1xuICAgICAgICB0aGlzLmhhbGZFZGdlU2l6ZSA9IHRoaXMuZWRnZVNpemUgLyAyO1xuXG4gICAgICAgIHRoaXMuZGVidWdBcnJvd1NpemUgPSB0aGlzLnNpemUgKiAwLjA1O1xuICAgIH07XG5cbiAgICBwdWJsaWMgZHJhdyh0eXBlOiBUZXJyYWluVGlsZVR5cGUsIHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGUocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGVXaXRoTGVmdEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuRmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGVXaXRoUmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLkZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0ZsYXRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5GbGF0VGlsZVdpdGhSaWdodE91dHNpZGVDb3JuZXJFZGdlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3RmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3U2xvcGVkVGlsZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aExlZnRGbGF0RWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGVXaXRoTGVmdEZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhc2UgVGVycmFpblRpbGVUeXBlLlNsb3BlZFRpbGVXaXRoUmlnaHRGbGF0RWRnZToge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1Nsb3BlZFRpbGVXaXRoUmlnaHRGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlIFRlcnJhaW5UaWxlVHlwZS5TbG9wZWRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTbG9wZWRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBUZXJyYWluVGlsZVR5cGUuU2xvcGVkVGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2U6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBbmdsZShkZWdyZWVzOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUcmFuc2Zvcm1hdGlvbihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxlZnQgPSBjb2x1bW4gKiB0aGlzLnNpemU7XG4gICAgICAgIGNvbnN0IHRvcCA9IHJvdyAqIHRoaXMuc2l6ZTtcblxuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKHRoaXMub2Zmc2V0LmxlZnQsIHRoaXMub2Zmc2V0LnRvcCk7XG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUobGVmdCwgdG9wKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRyYW5zbGF0ZSh0aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucm90YXRlKChNYXRoLlBJIC8gMTgwKSAqIChEaXJlY3Rpb24uU291dGggKyBkaXJlY3Rpb24pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdEZWJ1Z1RpbGUocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICBpZih0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5kZWJ1Z0NvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBEaXJlY3Rpb24uU291dGgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoYFJvdyAke3Jvd31gLCAwLCAwKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9IFwiaGFuZ2luZ1wiO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KGBDb2x1bW4gJHtjb2x1bW59YCwgMCwgMCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIGRyYXdEZWJ1Z0Fycm93KHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgaWYodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZGVidWdDb2xvcjtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKDAsIHRoaXMuaGFsZlNpemUgLSB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbygtdGhpcy5kZWJ1Z0Fycm93U2l6ZSwgMCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKDAsIHRoaXMuZGVidWdBcnJvd1NpemUpO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmRlYnVnQXJyb3dTaXplLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnRlcnJhaW5Db2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KC10aGlzLmhhbGZTaXplLCAtdGhpcy5oYWxmU2l6ZSwgdGhpcy5zaXplLCB0aGlzLnNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICAgICAgdGhpcy5kcmF3RGVidWdUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd0ZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24sIHNpZGU6IFNpZGUsIGdhcDogbnVtYmVyID0gMCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtYXRpb24ocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuXG4gICAgICAgIGlmKHNpZGUgPT09IFNpZGUuTGVmdClcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCB0aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplIC0gZ2FwLCB0aGlzLmVkZ2VTaXplKTtcbiAgICAgICAgZWxzZSBpZihzaWRlID09PSBTaWRlLlJpZ2h0KVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KC10aGlzLmhhbGZTaXplICsgZ2FwLCB0aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplIC0gZ2FwLCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3RmxhdFRpbGVXaXRoTGVmdEZsYXRFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcmF3RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5MZWZ0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLlJpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZWRnZUNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5lZGdlU2l6ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmFyYyh0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUsIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoNDUpLCB0aGlzLmdldEFuZ2xlKDQ1ICsgNDUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3UmlnaHRJbnNpZGVDb3JuZXJFZGdlKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKC10aGlzLmhhbGZTaXplICsgdGhpcy5lZGdlU2l6ZSwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUsIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoOTApLCB0aGlzLmdldEFuZ2xlKDkwICsgNDUpKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhMZWZ0SW5zaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd0ZsYXRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuTGVmdCwgdGhpcy5lZGdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy5kcmF3TGVmdEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLlJpZ2h0LCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmRyYXdSaWdodEluc2lkZUNvcm5lckVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3TGVmdE91dHNpZGVDb3JuZXJFZGdlKCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnRlcnJhaW5Db2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLmhhbGZTaXplLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmhhbGZTaXplIC0gKHRoaXMuaGFsZkVkZ2VTaXplICogMS41KSwgdGhpcy5oYWxmU2l6ZSArICh0aGlzLmhhbGZFZGdlU2l6ZSAqIDEuNSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuaGFsZlNpemUgLSAodGhpcy5oYWxmRWRnZVNpemUgKiA0KSwgdGhpcy5oYWxmU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmModGhpcy5oYWxmU2l6ZSAtICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuaGFsZlNpemUgKyAodGhpcy5lZGdlU2l6ZSAqIDIpLCB0aGlzLmVkZ2VTaXplICogMS41LCB0aGlzLmdldEFuZ2xlKC05MCksIHRoaXMuZ2V0QW5nbGUoLTQ1KSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdSaWdodE91dHNpZGVDb3JuZXJFZGdlKCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnRlcnJhaW5Db2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbygtdGhpcy5oYWxmU2l6ZSArICh0aGlzLmhhbGZFZGdlU2l6ZSAqIDQpLCB0aGlzLmhhbGZTaXplKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbygtdGhpcy5oYWxmU2l6ZSArICh0aGlzLmhhbGZFZGdlU2l6ZSAqIDIpLCB0aGlzLmhhbGZTaXplICsgdGhpcy5lZGdlU2l6ZSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oLXRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKC10aGlzLmhhbGZTaXplICsgKHRoaXMuZWRnZVNpemUgKiAyKSwgdGhpcy5oYWxmU2l6ZSArICh0aGlzLmVkZ2VTaXplICogMiksIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoMTgwICsgNDUpLCB0aGlzLmdldEFuZ2xlKDI3MCkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdGbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgICAgICB0aGlzLmRyYXdMZWZ0T3V0c2lkZUNvcm5lckVkZ2UoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgICB0aGlzLmRyYXdGbGF0RWRnZShyb3csIGNvbHVtbiwgZGlyZWN0aW9uLCBTaWRlLkxlZnQsIHRoaXMuZWRnZVNpemUgKiAyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd0ZsYXRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuICAgICAgICB0aGlzLmRyYXdSaWdodE91dHNpZGVDb3JuZXJFZGdlKCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICAgICAgdGhpcy5kcmF3RmxhdEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5SaWdodCwgdGhpcy5lZGdlU2l6ZSAqIDIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3U2xvcGVkVGlsZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1hdGlvbihyb3csIGNvbHVtbiwgZGlyZWN0aW9uIC0gNDUpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMudGVycmFpbkNvbG9yO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbygtdGhpcy5oYWxmU2l6ZSwgLXRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuaGFsZlNpemUsIHRoaXMuaGFsZlNpemUpO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuaGFsZlNpemUsIC10aGlzLmhhbGZTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbCgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICAgICAgdGhpcy5kcmF3RGVidWdUaWxlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24gLSA0NSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcmF3U2xvcGVkRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uLCBzaWRlOiBTaWRlLCBnYXA6IG51bWJlciA9IDApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcblxuICAgICAgICBpZihzaWRlID09PSBTaWRlLkxlZnQpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgLXRoaXMuaGFsZkVkZ2VTaXplICsgMS41LCB0aGlzLnNpemUgKiAuNzUgLSBnYXAsIHRoaXMuZWRnZVNpemUpO1xuICAgICAgICBlbHNlIGlmKHNpZGUgPT09IFNpZGUuUmlnaHQpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoLXRoaXMuaGFsZlNpemUgKiAxLjUgKyAoZ2FwICogMSksIC10aGlzLmhhbGZFZGdlU2l6ZSArIDEuNSwgdGhpcy5zaXplICogLjc1IC0gZ2FwLCB0aGlzLmVkZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3U2xvcGVkVGlsZVdpdGhMZWZ0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdTbG9wZWRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuTGVmdCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlV2l0aFJpZ2h0RmxhdEVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdTbG9wZWRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuUmlnaHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1Nsb3BlZExlZnRPdXRzaWRlQ29ybmVyKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5yb3RhdGUodGhpcy5nZXRBbmdsZSgxODApKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQudHJhbnNsYXRlKC10aGlzLmVkZ2VTaXplICogMSArIDQsIC10aGlzLmVkZ2VTaXplICogMyAtMik7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmVkZ2VDb2xvcjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuZWRnZVNpemU7XG4gICAgICAgIHRoaXMuY29udGV4dC5hcmMoLXRoaXMuaGFsZlNpemUgKyB0aGlzLmVkZ2VTaXplLCB0aGlzLmhhbGZTaXplIC0gdGhpcy5lZGdlU2l6ZSwgdGhpcy5lZGdlU2l6ZSAqIDEuNSwgdGhpcy5nZXRBbmdsZSg0NSArIDQ1KSwgdGhpcy5nZXRBbmdsZSgoNDUgKyA0NSkgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBkcmF3U2xvcGVkUmlnaHRPdXRzaWRlQ29ybmVyKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybWF0aW9uKHJvdywgY29sdW1uLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC50cmFuc2xhdGUoLXRoaXMuZWRnZVNpemUgKyAxLCAzKVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5lZGdlQ29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmVkZ2VTaXplO1xuICAgICAgICB0aGlzLmNvbnRleHQuYXJjKC10aGlzLmhhbGZTaXplICsgdGhpcy5lZGdlU2l6ZSwgdGhpcy5oYWxmU2l6ZSAtIHRoaXMuZWRnZVNpemUsIHRoaXMuZWRnZVNpemUgKiAxLjUsIHRoaXMuZ2V0QW5nbGUoMTgwICsgNDUpLCB0aGlzLmdldEFuZ2xlKCgxODAgKyA0NSkgKyA0NSkpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlV2l0aFJpZ2h0T3V0c2lkZUNvcm5lckVkZ2Uocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBkaXJlY3Rpb246IERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRyYXdTbG9wZWRFZGdlKHJvdywgY29sdW1uLCBkaXJlY3Rpb24sIFNpZGUuUmlnaHQsIHRoaXMuZWRnZVNpemUpO1xuICAgICAgICB0aGlzLmRyYXdTbG9wZWRSaWdodE91dHNpZGVDb3JuZXIocm93LCBjb2x1bW4sIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXdTbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZShyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGRpcmVjdGlvbjogRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZHJhd1Nsb3BlZEVkZ2Uocm93LCBjb2x1bW4sIGRpcmVjdGlvbiwgU2lkZS5MZWZ0LCB0aGlzLmVkZ2VTaXplKVxuICAgICAgICB0aGlzLmRyYXdTbG9wZWRMZWZ0T3V0c2lkZUNvcm5lcihyb3csIGNvbHVtbiwgZGlyZWN0aW9uKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0gZnJvbSBcImNhbnZhc1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vLi4vLi4vdHlwZXMvUG9pbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVycmFpbldhdGVyUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhd1dhdGVyKCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBcIiNBQURBRkZcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH07XG59XG4iLCJleHBvcnQgZW51bSBUZXJyYWluVGlsZVR5cGUge1xuICAgIEZsYXRUaWxlLFxuICAgIFxuICAgIEZsYXRUaWxlV2l0aExlZnRGbGF0RWRnZSxcbiAgICBGbGF0VGlsZVdpdGhSaWdodEZsYXRFZGdlLFxuICAgIFxuICAgIEZsYXRUaWxlV2l0aExlZnRJbnNpZGVDb3JuZXJFZGdlLFxuICAgIEZsYXRUaWxlV2l0aFJpZ2h0SW5zaWRlQ29ybmVyRWRnZSxcbiAgICBcbiAgICBGbGF0VGlsZVdpdGhMZWZ0T3V0c2lkZUNvcm5lckVkZ2UsXG4gICAgRmxhdFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZSxcbiAgICBcbiAgICBTbG9wZWRUaWxlLFxuICAgIFxuICAgIFNsb3BlZFRpbGVXaXRoTGVmdEZsYXRFZGdlLFxuICAgIFNsb3BlZFRpbGVXaXRoUmlnaHRGbGF0RWRnZSxcblxuICAgIFNsb3BlZFRpbGVXaXRoUmlnaHRPdXRzaWRlQ29ybmVyRWRnZSxcbiAgICBTbG9wZWRUaWxlV2l0aExlZnRPdXRzaWRlQ29ybmVyRWRnZVxufTtcbiIsImltcG9ydCBUZXJyYWluQ2FudmFzIGZyb20gXCIuL2NvcmUvdGVycmFpbi9UZXJyYWluQ2FudmFzXCI7XG5pbXBvcnQgVGVycmFpbkRlYnVnQ2FudmFzIGZyb20gXCIuL2Jyb3dzZXIvZ2FtZS9HYW1lRGVidWdDYW52YXNcIjtcbmltcG9ydCBUZXJyYWluR3JpZCBmcm9tIFwiLi9jb3JlL3RlcnJhaW4vVGVycmFpbkdyaWRcIjtcbmltcG9ydCBUZXJyYWluVGlsZXMgZnJvbSBcIi4vY29yZS90ZXJyYWluL1RlcnJhaW5UaWxlc1wiO1xuaW1wb3J0IEJyb3dzZXJUZXJyYWluR3JpZCBmcm9tIFwiLi9icm93c2VyL3RlcnJhaW4vQnJvd3NlclRlcnJhaW5HcmlkXCI7XG5pbXBvcnQgR2FtZUNhbnZhcyBmcm9tIFwiLi9icm93c2VyL2dhbWUvR2FtZUNhbnZhc1wiO1xuaW1wb3J0IEdhbWVUZXJyYWluRW50aXR5IGZyb20gXCIuL2Jyb3dzZXIvZ2FtZS9lbnRpdGllcy9HYW1lVGVycmFpbkVudGl0eVwiO1xuXG5jb25zdCB0ZXN0VGVycmFpbkdyaWQgPSBuZXcgVGVycmFpbkdyaWQoW1xuICBbIDEsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAgXSxcbiAgWyAwLCAxLCAxLCAxLCAxLCAwLCAxLCAxLCAwIF0sXG4gIFsgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMSwgMSBdLFxuICBbIDAsIDAsIDAsIDEsIDAsIDEsIDEsIDEsIDEgXSxcbiAgWyAwLCAwLCAxLCAxLCAxLCAwLCAxLCAwLCAwIF1cbl0pO1xuXG5cbihhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHN3ZWRlbkFzc2V0cyA9IFtcbiAgICBcIlN3ZWRlbl9CbGVraW5nZS5qc29uXCIsXG4gICAgXCJTd2VkZW5fRGFsYXJuYS5qc29uXCIsXG4gICAgXCJTd2VkZW5fR8OkdmxlYm9yZy5qc29uXCIsXG4gICAgXCJTd2VkZW5fR290bGFuZC5qc29uXCIsXG4gICAgXCJTd2VkZW5fSGFsbGFuZC5qc29uXCIsXG4gICAgXCJTd2VkZW5fSsOkbXRsYW5kLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Kw7Zua8O2cGluZy5qc29uXCIsXG4gICAgXCJTd2VkZW5fS2FsbWFyLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Lcm9ub2JlcmcuanNvblwiLFxuICAgIFwiU3dlZGVuX05vcnJib3R0ZW4uanNvblwiLFxuICAgIFwiU3dlZGVuX09yZWJyby5qc29uXCIsXG4gICAgXCJTd2VkZW5fw5ZzdGVyZ8O2dGxhbmQuanNvblwiLFxuICAgIFwiU3dlZGVuX1Nrw6VuZS5qc29uXCIsXG4gICAgXCJTd2VkZW5fU8O2ZGVybWFubGFuZC5qc29uXCIsXG4gICAgXCJTd2VkZW5fU3RvY2tob2xtLmpzb25cIixcbiAgICBcIlN3ZWRlbl9VcHBzYWxhLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Ww6RybWxhbmQuanNvblwiLFxuICAgIFwiU3dlZGVuX1bDpHN0ZXJib3R0ZW4uanNvblwiLFxuICAgIFwiU3dlZGVuX1bDpHN0ZXJub3JybGFuZC5qc29uXCIsXG4gICAgXCJTd2VkZW5fVsOkc3RtYW5sYW5kLmpzb25cIixcbiAgICBcIlN3ZWRlbl9Ww6RzdHJhX0fDtnRhbGFuZC5qc29uXCJcbiAgXTtcblxuICBjb25zdCB0ZXJyYWluR3JpZHMgPSAoYXdhaXQgUHJvbWlzZS5hbGwoc3dlZGVuQXNzZXRzLm1hcCgoYXNzZXQpID0+IHtcbiAgICByZXR1cm4gQnJvd3NlclRlcnJhaW5HcmlkLmZyb21Bc3NldChcIi4uL2Fzc2V0cy9zd2VkZW4vXCIgKyBhc3NldCk7XG4gIH0pKSk7XG4gIFxuICBjb25zdCB0ZXJyYWluVGlsZXNDb2xsZWN0aW9uID0gdGVycmFpbkdyaWRzLm1hcCgodGVycmFpbkdyaWQpID0+IHtcbiAgICBjb25zdCB0ZXJyYWluVGlsZXMgPSBuZXcgVGVycmFpblRpbGVzKHRlcnJhaW5HcmlkKTtcbiAgIFxuICAgIHJldHVybiB0ZXJyYWluVGlsZXM7XG4gIH0pO1xuXG4gIGNvbnN0IHRlc3RUZXJyYWluVGlsZXMgPSBuZXcgVGVycmFpblRpbGVzKHRlc3RUZXJyYWluR3JpZCk7XG4gIGNvbnN0IHRlcnJhaW5DYW52YXMgPSBuZXcgVGVycmFpbkNhbnZhcyh0ZXJyYWluVGlsZXNDb2xsZWN0aW9uLCAxMCk7XG5cbiAgY29uc29sZS5sb2codGVycmFpbkNhbnZhcy5jYW52YXMpO1xuXG4gIGNvbnN0IGdhbWVUZXJyYWluRW50aXR5ID0gbmV3IEdhbWVUZXJyYWluRW50aXR5KHRlcnJhaW5DYW52YXMpO1xuICBcbiAgY29uc3QgZ2FtZUNhbnZhcyA9IG5ldyBHYW1lQ2FudmFzKFsgZ2FtZVRlcnJhaW5FbnRpdHkgXSk7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZ2FtZUNhbnZhcy5lbGVtZW50KTtcbn0pKCk7XG4iLCJleHBvcnQgZW51bSBEaXJlY3Rpb24ge1xuICAgIE5vcnRoID0gMCxcbiAgICBOb3J0aEVhc3QgPSBOb3J0aCArIDQ1LFxuICAgIFxuICAgIEVhc3QgPSA5MCxcbiAgICBTb3V0aEVhc3QgPSBFYXN0ICsgNDUsXG5cbiAgICBTb3V0aCA9IDE4MCxcbiAgICBTb3V0aFdlc3QgPSBTb3V0aCArIDQ1LFxuXG4gICAgV2VzdCA9IDI3MCxcbiAgICBOb3J0aFdlc3QgPSBXZXN0ICsgNDVcbn1cbiIsImV4cG9ydCBlbnVtIFNpZGUge1xuICAgIExlZnQsXG4gICAgUmlnaHRcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==