import { Feature, FeatureCollection, GeoJSON, MultiPolygon, Polygon } from "geojson";
import MercatorProjection from "../mercator/MercatorProjection";
import { CanvasPaths } from "../canvas/types/CanvasPaths";
import { MercatorPixelCoordinates } from "../../browser/game/mercator/types/MercatorPixelCoordinates";
import { MercatorCoordinates } from "../../browser/game/mercator/types/MercatorCoordinates";

export default class GeoJsonAdapter {
    static getPathsFromGeoJson(geojson: GeoJSON, zoomLevel: number, pixelTolerance: number) {
        switch(geojson.type) {
            case "FeatureCollection":
                return this.getPathsFromFeatureCollection(geojson, zoomLevel, pixelTolerance);

            case "Feature":
                return this.getPathsFromFeature(geojson, zoomLevel, pixelTolerance);

            case "MultiPolygon":
                return this.getPathsFromMultiPolygon(geojson, zoomLevel, pixelTolerance);

            case "Polygon":
                return this.getPathsFromPolygon(geojson, zoomLevel, pixelTolerance);
        }

        return null;
    }

    static getPathsFromFeatureCollection(featureCollection: FeatureCollection, zoomLevel: number, pixelTolerance: number) {
        let canvasPaths: CanvasPaths = {
            paths: []
        };

        for(let feature of featureCollection.features) {
            const newCanvasPaths = this.getPathsFromFeature(feature, zoomLevel, pixelTolerance);

            if(!newCanvasPaths)
                continue;

            canvasPaths = {
                paths: canvasPaths.paths.concat(newCanvasPaths.paths),
                bounds: this.getBiggestBounds(canvasPaths.bounds, newCanvasPaths.bounds),
                minimumCoordinates: this.getSmallestCoordinates(canvasPaths.minimumCoordinates, newCanvasPaths.minimumCoordinates)
            };
        }

        return canvasPaths;
    };

    static getPathsFromFeature(feature: Feature, zoomLevel: number, pixelTolerance: number) {
        switch(feature.geometry.type) {
            case "MultiPolygon":
                return this.getPathsFromMultiPolygon(feature.geometry, zoomLevel, pixelTolerance);

            case "Polygon":
                return this.getPathsFromPolygon(feature.geometry, zoomLevel, pixelTolerance);
        }

        return null;
    };

    static getPathsFromMultiPolygon(multiPolygon: MultiPolygon, zoomLevel: number, pixelTolerance: number) {
        let canvasPaths: CanvasPaths = {
            paths: []
        };

        for(let polygon of multiPolygon.coordinates) {
            const newCanvasPaths = this.getPathsFromPolygon({ coordinates: polygon, type: "Polygon" }, zoomLevel, pixelTolerance);

            canvasPaths = {
                paths: canvasPaths.paths.concat(newCanvasPaths.paths),
                bounds: this.getBiggestBounds(canvasPaths.bounds, newCanvasPaths.bounds),
                minimumCoordinates: this.getSmallestCoordinates(canvasPaths.minimumCoordinates, newCanvasPaths.minimumCoordinates)
            };
        }

        return canvasPaths;
    };

    static getPathsFromPolygon(polygon: Polygon, zoomLevel: number, pixelTolerance: number) {
        const canvasPaths: CanvasPaths = {
            paths: []
        };

        for(let ring of polygon.coordinates) {
            const path: MercatorPixelCoordinates[] = [];

            let bounds: CanvasPaths["bounds"] = undefined;
            let minimumCoordinates: CanvasPaths["minimumCoordinates"] = undefined;
    
            for(let index = 0; index < ring.length; index++) {
                if(!minimumCoordinates) {
                    minimumCoordinates = {
                        latitude: ring[index][0],
                        longitude: ring[index][1]
                    };
                }
                else {
                    if(minimumCoordinates.latitude > ring[index][0])
                        minimumCoordinates.latitude = ring[index][0];

                    if(minimumCoordinates.longitude > ring[index][1])
                        minimumCoordinates.longitude = ring[index][1];
                }

                const pixelCoordinate = MercatorProjection.getPixelCoordinatesFromCoordinates(zoomLevel, ring[index][0], ring[index][1]);
    
                path.push(pixelCoordinate);

                if(!bounds) {
                    bounds = {
                        minimumLeft: pixelCoordinate.left,
                        maximumLeft: pixelCoordinate.left,
                        minimumTop: pixelCoordinate.top,
                        maximumTop: pixelCoordinate.top
                    };
                }
                else {
                    if(pixelCoordinate.left > bounds.maximumLeft)
                        bounds.maximumLeft = pixelCoordinate.left;
        
                    if(pixelCoordinate.top > bounds.maximumTop)
                        bounds.maximumTop = pixelCoordinate.top;
        
                    if(pixelCoordinate.left < bounds.minimumLeft)
                        bounds.minimumLeft = pixelCoordinate.left;
        
                    if(pixelCoordinate.top < bounds.minimumTop)
                        bounds.minimumTop = pixelCoordinate.top;
                }
            }

            if(!bounds)
                continue;

            const area = (1 + (bounds.maximumLeft - bounds.minimumLeft)) * (1 + (bounds.maximumTop - bounds.minimumTop));
    
            if(area < pixelTolerance)
                continue;
    
            canvasPaths.paths.push(path);
   
            if(!canvasPaths.bounds) {
                canvasPaths.bounds = bounds;
            }
            else {
                if(canvasPaths.bounds.maximumLeft < bounds.maximumLeft)
                    canvasPaths.bounds.maximumLeft = bounds.maximumLeft;

                if(canvasPaths.bounds.maximumTop < bounds.maximumTop)
                    canvasPaths.bounds.maximumTop = bounds.maximumTop;

                if(canvasPaths.bounds.minimumLeft > bounds.minimumLeft)
                    canvasPaths.bounds.minimumLeft = bounds.minimumLeft;

                if(canvasPaths.bounds.minimumTop > bounds.minimumTop)
                    canvasPaths.bounds.minimumTop = bounds.minimumTop;
            }

            if(minimumCoordinates) {
                if(!canvasPaths.minimumCoordinates) {
                    canvasPaths.minimumCoordinates = {
                        latitude: minimumCoordinates.latitude,
                        longitude: minimumCoordinates.longitude
                    };
                }
                else {
                    if(canvasPaths.minimumCoordinates.latitude > minimumCoordinates.latitude)
                        canvasPaths.minimumCoordinates.latitude = minimumCoordinates.latitude;

                    if(canvasPaths.minimumCoordinates.longitude > minimumCoordinates.longitude)
                        canvasPaths.minimumCoordinates.longitude = minimumCoordinates.longitude;
                }
            }
        }

        return canvasPaths;
    };

    static getBiggestBounds(originalBounds: CanvasPaths["bounds"], newBounds: CanvasPaths["bounds"]) {
        if(originalBounds && newBounds) {
            if(originalBounds.maximumLeft < newBounds.maximumLeft)
                originalBounds.maximumLeft = newBounds.maximumLeft;

            if(originalBounds.maximumTop < newBounds.maximumTop)
                originalBounds.maximumTop = newBounds.maximumTop;

            if(originalBounds.minimumLeft > newBounds.minimumLeft)
                originalBounds.minimumLeft = newBounds.minimumLeft;

            if(originalBounds.minimumTop > newBounds.minimumTop)
                originalBounds.minimumTop = newBounds.minimumTop;

            return originalBounds;
        }

        return originalBounds ?? newBounds
    };

    static getSmallestCoordinates(originalCoordinates: CanvasPaths["minimumCoordinates"], newCoordinates: CanvasPaths["minimumCoordinates"]) {
        if(originalCoordinates && newCoordinates) {
            if(originalCoordinates.latitude > newCoordinates.latitude)
                originalCoordinates.latitude = newCoordinates.latitude;

            if(originalCoordinates.longitude > newCoordinates.longitude)
                originalCoordinates.longitude = newCoordinates.longitude;

            return originalCoordinates;
        }

        return originalCoordinates ?? newCoordinates
    };
};
