import GameCanvasEntity from "../../types/GameCanvasEntity";
import MercatorGameCanvas from "../MercatorGameCanvas";
import { MercatorCoordinates } from "./MercatorCoordinates";
import { MercatorPixelCoordinates } from "./MercatorPixelCoordinates";

/**
 * A canvas entity used by a Mercator game canvas.
 */
export default interface MercatorGameCanvasEntity extends GameCanvasEntity {
    coordinates?: MercatorCoordinates;
    pixelCoordinates?: MercatorPixelCoordinates;
};
