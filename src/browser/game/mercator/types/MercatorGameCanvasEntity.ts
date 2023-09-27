import GameCanvasEntity from "../../types/GameCanvasEntity";
import { MercatorCoordinate } from "./MercatorCoordinates";

export default interface MercatorGameCanvasEntity extends GameCanvasEntity {
    worldCoordinate: MercatorCoordinate;
};
