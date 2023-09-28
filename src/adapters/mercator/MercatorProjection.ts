import { MercatorCoordinates } from "../../browser/game/mercator/types/MercatorCoordinates";
import { MercatorWorldCoordinates } from "../../browser/game/mercator/types/MercatorWorldCoordinates";

export default class MercatorProjection {
    static getTileSize(zoomLevel: number) {
        return zoomLevel * 256;
    };

    static getWorldCoordinates(zoomLevel: number, coordinates: MercatorCoordinates): MercatorWorldCoordinates {
        const tileSize = this.getTileSize(zoomLevel);

        const latitudeToRadians = ((coordinates.latitude * Math.PI) / 180);
        const northing = Math.log(Math.tan((Math.PI / 4) + (latitudeToRadians / 2)));
    
        return {
            left: ((coordinates.longitude + 180) * (tileSize / 360)),
            top: ((tileSize / 2) - ((tileSize * northing) / (2 * Math.PI))),
        };
    }

    static getPixelCoordinates(zoomLevel: number, worldCoordinate: MercatorWorldCoordinates) {
        return {
            left: Math.round(worldCoordinate.left * (2 ** zoomLevel)),
            top: Math.round(worldCoordinate.top * (2 ** zoomLevel))
        };
    }
}
