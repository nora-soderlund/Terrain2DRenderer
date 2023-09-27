import { MercatorCoordinates } from "../../browser/game/mercator/types/MercatorCoordinates";
import { MercatorWorldCoordinates } from "../../browser/game/mercator/types/MercatorWorldCoordinates";

export default class MercatorProjection {
    static getTileSize(zoomLevel: number) {
        return zoomLevel * 256;
    };

    static getWorldCoordinateProjection(zoomLevel: number, latitude: number, longitude: number): MercatorWorldCoordinates {
        const tileSize = this.getTileSize(zoomLevel);

        const latitudeToRadians = ((latitude * Math.PI) / 180);
        const northing = Math.log(Math.tan((Math.PI / 4) + (latitudeToRadians / 2)));
    
        return {
            left: ((tileSize / 2) - ((tileSize * northing) / (2 * Math.PI))),
            top: ((longitude + 180) * (tileSize / 360))
        };
    }

    static getPixelCoordinates(zoomLevel: number, worldCoordinate: MercatorWorldCoordinates) {
        return {
            left: worldCoordinate.left * (2 ** zoomLevel),
            top: worldCoordinate.top * (2 ** zoomLevel)
        };
    }

    static getPixelCoordinatesFromCoordinates(zoomLevel: number, latitude: number, longitude: number) {
        const worldCoordinate = MercatorProjection.getWorldCoordinateProjection(zoomLevel, latitude, longitude);

        return this.getPixelCoordinates(zoomLevel, worldCoordinate);
    }
}
