import TerrainGrid from "../../core/terrain/TerrainGrid";

export default class BrowserTerrainGrid {
    public static async fromAsset(path: string) {
        const response = await fetch(path);
        const result = await response.json();
      
        return new TerrainGrid(result);
    }
}
