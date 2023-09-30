import { GeoJSON } from "geojson";
import GeoJsonAdapter from "../geojson/GeoJsonAdapter";
import CanvasPathsAdapter from "../canvas/CanvasPathsAdapter";
import CanvasGridAdapter from "../canvas/CanvasGridAdapter";
import { MercatorGridMap } from "../../browser/game/mercator/types/MercatorGridMap";
import MercatorProjection from "./MercatorProjection";

/**
 * An adapter to translate data into grid compatible data.
 */
export default class MercatorAdapter {
    static getMercatorGridMapFromGeoJson(geojson: GeoJSON, zoomLevel: number, pixelTolerance: number): MercatorGridMap {
        const canvasPaths = GeoJsonAdapter.getPathsFromGeoJson(geojson, zoomLevel, pixelTolerance);

        if(!canvasPaths)
            throw new Error("Could not get paths from the GeoJSON object, unsupported type.");

        if(!canvasPaths.bounds || !canvasPaths.northWest)
            throw new Error("Cannot process the canvas paths from the GeoJSON without valid bounds.");

        const canvas = CanvasPathsAdapter.getCanvasFromPaths(canvasPaths);
        const gridMap = CanvasGridAdapter.getGridMapFromImageData(canvas);

        return {
            map: gridMap,
            zoomLevel,
            
            coordinate: canvasPaths.northWest
        };
    };
}