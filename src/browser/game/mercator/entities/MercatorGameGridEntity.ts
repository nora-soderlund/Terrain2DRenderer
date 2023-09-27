import GameGridEntity from "../../entities/GameGridEntity";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";

export default class MercatorGameGridEntity extends GameGridEntity implements MercatorGameCanvasEntity {
    coordinates = null;
};
