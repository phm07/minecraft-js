import { makeNoise2D } from "fast-simplex-noise";
import Random from "rand-seed";

import Chunk from "common/world/Chunk";
import Material from "common/world/Material";
import CaveGenerator from "server/game/world/CaveGenerator";

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

    public async generateChunk(chunk: Chunk): Promise<void> {

        const chunkSeed = this.seed + ":" + chunk.x.toString() + "," + chunk.z.toString();
        const chunkRandom = new Random(chunkSeed);
        const caveData = await this.caveGenerator.requestCaveData(chunk);

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

                let surface = 1;
                for (let y = 1; y < height; y++) {

                    if (caveData[x + z * 16 + y * 256]) continue;
                    surface = y;

                    if (y >= height - 4) {
                        chunk.setBlockAt(x, y, z, Material.DIRT);
                    } else if (y > 2) {
                        chunk.setBlockAt(x, y, z, Material.STONE);
                    } else {
                        chunk.setBlockAt(x, y, z, chunkRandom.next() > 0.5 ? Material.BEDROCK : Material.STONE);
                    }
                }

                if (chunk.blockAt(x, surface, z) === Material.DIRT) {
                    chunk.setBlockAt(x, surface, z, Material.GRASS);
                }

                chunk.setBlockAt(x, 0, z, Material.BEDROCK);
            }
        }
    }
}

export default WorldGenerator;