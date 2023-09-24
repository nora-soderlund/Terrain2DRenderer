import { readFileSync } from "node:fs";
import TerrainGrid from "../../core/terrain/TerrainGrid";

export default class NodeTerrainGrid {
    public static fromAsset(path: string, encoding: BufferEncoding = "utf-8") {
        const content = readFileSync(path, {
            encoding
        });

        const result = JSON.parse(content);
      
        return new TerrainGrid(result);
    }
}
