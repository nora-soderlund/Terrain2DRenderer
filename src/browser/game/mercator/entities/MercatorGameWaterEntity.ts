import GameWaterEntity from "../../entities/GameWaterEntity";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";

export default class MercatorGameWaterEntity extends GameWaterEntity implements MercatorGameCanvasEntity {
    coordinates = null;
};
