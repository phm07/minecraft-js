import { makeNoise2D } from "fast-simplex-noise";
import Random from "rand-seed";

import Blocks from "./Blocks";
import CaveGenerator from "./CaveGenerator";
import Chunk from "./Chunk";

class WorldGenerator {

   public readonly seed: string;
   public readonly random: Random;
   public readonly heightNoise1: (x: number, y: number) => number;
   public readonly heightNoise2: (x: number, y: number) => number;
   public readonly heightNoise3: (x: number, y: number) => number;
   public readonly caveGenerator: CaveGenerator;

    public constructor(seed: string) {
        this.seed = seed;
        this.random = new Random(seed);
        this.heightNoise1 = makeNoise2D(() => this.random.next());
        this.heightNoise2 = makeNoise2D(() => this.random.next());
        this.heightNoise3 = makeNoise2D(() => this.random.next());
        this.caveGenerator = new CaveGenerator(this);
    }

    public generateChunk(chunk: Chunk): void {

        const caveData = this.caveGenerator.getAndRemoveCaveData(chunk);

        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {

                const worldX = x + chunk.x * 16;
                const worldZ = z + chunk.z * 16;

                const height = Math.floor(
                    this.heightNoise1(worldX / 100, worldZ / 100) * 12
                    + this.heightNoise2(worldX / 50, worldZ / 50) * 6
                    + this.heightNoise3(worldX / 25, worldZ / 25) * 3
                    + 48
                );

                let surface = 0;
                for (let y = 0; y < height; y++) {

                    if (caveData[x + z * 16 + y * 256]) continue;
                    surface = y;

                    if (y >= height - 4) {
                        chunk.setBlockAt(x, y, z, Blocks.DIRT);
                    } else {
                        chunk.setBlockAt(x, y, z, Blocks.STONE);
                    }
                }

                if (chunk.blockAt(x, surface, z) === Blocks.DIRT) {
                    chunk.setBlockAt(x, surface, z, Blocks.GRASS);
                }
            }
        }
    }

}

export default WorldGenerator;