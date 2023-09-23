import TerrainCanvas from "./terrain/TerrainCanvas";
import TerrainDebugCanvas from "./terrain/TerrainDebugCanvas";
import TerrainGrid from "./terrain/TerrainGrid";

fetch("assets/sweden.json").then(async (response) => {
  const result = await response.json();

  const swedenTerrainGrid = new TerrainGrid(result);

  const testTerrainGrid = new TerrainGrid([
    [ 1, 0, 0, 0, 1, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 1, 0, 1, 1, 0 ],
    [ 0, 0, 1, 1, 1, 0, 1, 1, 1 ],
    [ 0, 0, 0, 1, 0, 1, 1, 1, 1 ],
    [ 0, 0, 1, 1, 1, 0, 1, 0, 0 ]
  ]);

  document.body.append(new TerrainCanvas(swedenTerrainGrid, 10).element);
  document.body.append(new TerrainDebugCanvas(100).element);
});
