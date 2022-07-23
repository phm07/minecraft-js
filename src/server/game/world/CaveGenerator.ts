import { makeNoise3D } from "fast-simplex-noise";
import Random from "rand-seed";

import MathUtils from "src/common/math/MathUtils";
import Vec3 from "src/common/math/Vec3";
import Chunk from "src/common/world/Chunk";
import WorldGenerator from "src/server/game/world/WorldGenerator";

class CaveGenerator {

    private static readonly CAVES_PER_CHUNK = 0.5;
    private static readonly CAVE_LENGTH = 128;
    private static readonly CHUNK_RADIUS = Math.floor(CaveGenerator.CAVE_LENGTH / 16);

    private readonly generator: WorldGenerator;
    private readonly preGenerated: Record<string, Promise<void> | true>;
    private readonly caveData: Record<string, Uint8Array | undefined>;

    public constructor(generator: WorldGenerator) {
        this.generator = generator;
        this.preGenerated = {};
        this.caveData = {};
    }

    private async preGenerate(chunkX: number, chunkZ: number): Promise<void> {

        const index = [chunkX, chunkZ].toString();
        if (this.preGenerated[index] === true) {
            return;
        } else if (this.preGenerated[index] instanceof Promise) {
            await this.preGenerated[index];
            return;
        }

        const promise = new Promise<void>((resolve) => {

            this.caveData[[chunkX, chunkZ].toString()] ??= new Uint8Array(16 * 16 * 128);

            const chunkSeed = this.generator.seed + ":" + chunkX.toString() + "," + chunkZ.toString();
            const random = new Random(chunkSeed);

            for (let i = 0; i < CaveGenerator.CAVES_PER_CHUNK; i++) {

                if (random.next() > CaveGenerator.CAVES_PER_CHUNK) continue;

                const noiseX1 = makeNoise3D(() => random.next());
                const noiseX2 = makeNoise3D(() => random.next());
                const noiseY1 = makeNoise3D(() => random.next());
                const noiseY2 = makeNoise3D(() => random.next());
                const noiseZ1 = makeNoise3D(() => random.next());
                const noiseZ2 = makeNoise3D(() => random.next());
                const noiseR = makeNoise3D(() => random.next());

                let x = chunkX * 16 + Math.floor(random.next() * 16);
                let y = Math.floor(random.next() * 48) + 16;
                let z = chunkZ * 16 + Math.floor(random.next() * 16);

                for (let j = 0; j < CaveGenerator.CAVE_LENGTH; j++) {

                    const dx = noiseX1(x / 50, y / 50, z / 50) - noiseX2(x / 50, y / 50, z / 50);
                    const dz = noiseZ1(x / 50, y / 50, z / 50) - noiseZ2(x / 50, y / 50, z / 50);

                    const yGradient = MathUtils.map(y, 8, 16, 0, 1);
                    const yNoise = noiseY1(x / 50, y / 50, z / 50) - noiseY2(x / 50, y / 50, z / 50);
                    const dy = MathUtils.lerp(1, yNoise, yGradient);

                    [x, y, z] = Vec3.toArray(Vec3.add(Vec3.normalize(new Vec3(dx, dy, dz)), new Vec3(x, y, z)));

                    const r = MathUtils.map(noiseR(x / 10, y / 10, z / 10), 0, 1, 2, 4);
                    for (let blockX = Math.floor(x - r); blockX <= Math.floor(x + r); blockX++) {
                        for (let blockY = Math.max(2, Math.floor(y - r)); blockY <= Math.min(127, Math.floor(y + r)); blockY++) {
                            for (let blockZ = Math.floor(z - r); blockZ <= Math.floor(z + r); blockZ++) {
                                if (MathUtils.dist3Square(blockX, blockY, blockZ, x, y, z) <= r * r) {
                                    (this.caveData[[blockX >> 4, blockZ >> 4].toString()] ??= new Uint8Array(16 * 16 * 128))[(blockX & 15) + (blockZ & 15) * 16 + blockY * 256] = 1;
                                }
                            }
                        }
                    }
                }
            }

            resolve();
        });

        this.preGenerated[index] = promise;
        await promise;
        this.preGenerated[index] = true;
    }

    public async requestCaveData(chunk: Chunk): Promise<Uint8Array> {

        const promises = [];
        for (let x = chunk.x - CaveGenerator.CHUNK_RADIUS; x <= chunk.x + CaveGenerator.CHUNK_RADIUS; x++) {
            for (let z = chunk.z - CaveGenerator.CHUNK_RADIUS; z <= chunk.z + CaveGenerator.CHUNK_RADIUS; z++) {
                promises.push(this.preGenerate(x, z));
            }
        }

        await Promise.all(promises);

        const data = this.caveData[[chunk.x, chunk.z].toString()] ?? new Uint8Array(16 * 128 * 16);
        delete this.caveData[[chunk.x, chunk.z].toString()];
        return data;
    }
}

export default CaveGenerator;