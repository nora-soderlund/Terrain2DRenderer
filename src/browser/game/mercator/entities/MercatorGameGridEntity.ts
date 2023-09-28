import GameGridEntity from "../../entities/GameGridEntity";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";
import { MercatorPixelCoordinates } from "../types/MercatorPixelCoordinates";

export default class MercatorGameGridEntity extends GameGridEntity implements MercatorGameCanvasEntity {
    coordinates = null;
    pixelCoordinates: MercatorPixelCoordinates | null = null;
};
