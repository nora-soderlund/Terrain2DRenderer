import { Feature, FeatureCollection, GeoJSON, MultiPolygon, Polygon } from "geojson";
import MercatorProjection from "../mercator/MercatorProjection";
import { CanvasPaths } from "../canvas/types/CanvasPaths";
import { MercatorPixelCoordinates } from "../../browser/game/mercator/types/MercatorPixelCoordinates";
import { MercatorCoordinates } from "../../browser/game/mercator/types/MercatorCoordinates";

/**
 * An adapter to convert GeoJSON data to path polygons, to be used for creating 2d grids. 
 */
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
                northWest: this.getNorthWestCoordinates(canvasPaths.northWest, newCanvasPaths.northWest)
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
                northWest: this.getNorthWestCoordinates(canvasPaths.northWest, newCanvasPaths.northWest)
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
            let northWest: CanvasPaths["northWest"] = undefined;
    
            for(let index = 0; index < ring.length; index++) {
                if(!northWest) {
                    northWest = {
                        latitude: ring[index][1],
                        longitude: ring[index][0]
                    };
                }
                else {
                    if(northWest.latitude < ring[index][1])
                        northWest.latitude = ring[index][1];

                    if(northWest.longitude > ring[index][0])
                        northWest.longitude = ring[index][0];
                }

                const worldCoordinate = MercatorProjection.getWorldCoordinates(zoomLevel, {
                    latitude: ring[index][1],
                    longitude: ring[index][0]
                });
                const pixelCoordinates = MercatorProjection.getPixelCoordinates(zoomLevel, worldCoordinate);
    
                path.push(pixelCoordinates);

                if(!bounds) {
                    bounds = {
                        minimumLeft: pixelCoordinates.left,
                        maximumLeft: pixelCoordinates.left,
                        minimumTop: pixelCoordinates.top,
                        maximumTop: pixelCoordinates.top
                    };
                }
                else {
                    if(pixelCoordinates.left > bounds.maximumLeft)
                        bounds.maximumLeft = pixelCoordinates.left;
        
                    if(pixelCoordinates.top > bounds.maximumTop)
                        bounds.maximumTop = pixelCoordinates.top;
        
                    if(pixelCoordinates.left < bounds.minimumLeft)
                        bounds.minimumLeft = pixelCoordinates.left;
        
                    if(pixelCoordinates.top < bounds.minimumTop)
                        bounds.minimumTop = pixelCoordinates.top;
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

            if(northWest) {
                if(!canvasPaths.northWest) {
                    canvasPaths.northWest = {
                        latitude: northWest.latitude,
                        longitude: northWest.longitude
                    };
                }
                else {
                    if(canvasPaths.northWest.latitude < northWest.latitude)
                        canvasPaths.northWest.latitude = northWest.latitude;

                    if(canvasPaths.northWest.longitude > northWest.longitude)
                        canvasPaths.northWest.longitude = northWest.longitude;
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

    static getNorthWestCoordinates(originalCoordinates: CanvasPaths["northWest"], newCoordinates: CanvasPaths["northWest"]) {
        if(originalCoordinates && newCoordinates) {
            if(originalCoordinates.latitude < newCoordinates.latitude)
                originalCoordinates.latitude = newCoordinates.latitude;

            if(originalCoordinates.longitude > newCoordinates.longitude)
                originalCoordinates.longitude = newCoordinates.longitude;

            return originalCoordinates;
        }

        return originalCoordinates ?? newCoordinates
    };
};
