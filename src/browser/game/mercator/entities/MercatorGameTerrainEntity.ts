import TerrainCanvas from "../../../../core/terrain/TerrainCanvas";
import GameCanvas from "../../GameCanvas";
import GameTerrainEntity from "../../entities/GameTerrainEntity";
import { MercatorCoordinates } from "../types/MercatorCoordinates";
import MercatorGameCanvasEntity from "../types/MercatorGameCanvasEntity";
import { MercatorPixelCoordinates } from "../types/MercatorPixelCoordinates";

export default class MercatorGameTerrainEntity extends GameTerrainEntity implements MercatorGameCanvasEntity {
    public readonly pixelCoordinates?: MercatorPixelCoordinates;
    
    constructor(terrainCanvas: TerrainCanvas, public readonly coordinates: MercatorCoordinates) {
        super(terrainCanvas);
    };
};
