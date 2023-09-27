import { GeoJSON } from "geojson";
import GeoJsonAdapter from "../geojson/GeoJsonAdapter";
import CanvasPathsAdapter from "../canvas/CanvasPathsAdapter";
import CanvasGridAdapter from "../canvas/CanvasGridAdapter";
import { MercatorGridMap } from "../../browser/game/mercator/types/MercatorGridMap";

export default class MercatorAdapter {
    static getMercatorGridMapFromGeoJson(geojson: GeoJSON, zoomLevel: number, pixelTolerance: number): MercatorGridMap {
        const canvasPaths = GeoJsonAdapter.getPathsFromGeoJson(geojson, zoomLevel, pixelTolerance);

        if(!canvasPaths)
            throw new Error("Could not get paths from the GeoJSON object, unsupported type.");

        if(!canvasPaths.bounds || !canvasPaths.minimumCoordinates)
            throw new Error("Cannot process the canvas paths from the GeoJSON without valid bounds.");

        console.log({ position: canvasPaths.minimumCoordinates });

        const canvas = CanvasPathsAdapter.getCanvasFromPaths(canvasPaths);
        const gridMap = CanvasGridAdapter.getGridMapFromCanvas(canvas);

        return {
            map: gridMap,
            zoomLevel,
            
            coordinate: canvasPaths.minimumCoordinates
        };
    };
}