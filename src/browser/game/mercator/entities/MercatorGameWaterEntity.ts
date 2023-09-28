import GameWaterEntity from "../../entities/GameWaterEntity";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";
import { MercatorPixelCoordinates } from "../types/MercatorPixelCoordinates";

export default class MercatorGameWaterEntity extends GameWaterEntity implements MercatorGameCanvasEntity {
    coordinates = null;
    pixelCoordinates: MercatorPixelCoordinates | null = null;
};
