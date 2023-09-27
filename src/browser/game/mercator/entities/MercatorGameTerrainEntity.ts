import TerrainCanvas from "../../../../core/terrain/TerrainCanvas";
import GameTerrainEntity from "../../entities/GameTerrainEntity";
import { MercatorCoordinates } from "../types/MercatorCoordinates";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";

export default class MercatorGameTerrainEntity extends GameTerrainEntity implements MercatorGameCanvasEntity {
    constructor(terrainCanvas: TerrainCanvas, public readonly coordinates: MercatorCoordinates) {
        super(terrainCanvas);
    };
};
