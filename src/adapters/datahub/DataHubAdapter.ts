import { FeatureCollection, GeoJSON } from "geojson";
import { DataHubContinent } from "./types/DataHubContinent";
import { dataHubContinentCountries } from "./types/DataHubContinentCountries";

export default class DataHubAdapter {
    static getCountriesByContinent(geojson: FeatureCollection, continent: DataHubContinent) {
        const countries = dataHubContinentCountries.get(continent);

        return geojson.features.filter((feature) => countries?.includes(feature.properties?.["ADMIN"]));
    };
};
