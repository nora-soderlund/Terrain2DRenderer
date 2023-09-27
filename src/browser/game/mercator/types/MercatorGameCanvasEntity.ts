import GameCanvasEntity from "../../types/GameCanvasEntity";
import MercatorGameCanvas from "../MercatorGameCanvas";
import { MercatorCoordinates } from "./MercatorCoordinates";

export default interface MercatorGameCanvasEntity extends GameCanvasEntity {
    coordinates: MercatorCoordinates | null;
};
