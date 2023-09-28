import GameCanvasEntity from "../../types/GameCanvasEntity";
import MercatorGameCanvas from "../MercatorGameCanvas";
import { MercatorCoordinates } from "./MercatorCoordinates";
import { MercatorPixelCoordinates } from "./MercatorPixelCoordinates";

export default interface MercatorGameCanvasEntity extends GameCanvasEntity {
    coordinates: MercatorCoordinates | null;
    pixelCoordinates: MercatorPixelCoordinates | null;
};
