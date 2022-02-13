import { makeNoise3D } from "fast-simplex-noise";
import Random from "rand-seed";

import Vec3 from "src/common/math/Vec3";
import Util from "src/common/util/Util";
import Chunk from "src/common/world/Chunk";
import WorldGenerator from "src/server/game/world/WorldGenerator";

class CaveGenerator {

    private static readonly CAVES_PER_CHUNK = 0.5;
    private static readonly CAVE_LENGTH = 128;
    private static readonly CHUNK_RADIUS = Math.floor(CaveGenerator.CAVE_LENGTH / 16);

    private readonly generator: WorldGenerator;
    private readonly generated: Record<string, boolean | undefined>;
    private readonly caveData: Record<string, Uint8Array | undefined>;

    public constructor(generator: WorldGenerator) {
        this.generator = generator;
        this.generated = {};
        this.caveData = {};
    }

    private setData(x: number, y: number, z: number, data: number): void {
        (this.caveData[[x >> 4, z >> 4].toString()] ??= new Uint8Array(16 * 16 * 128))[(x & 15) + (z & 15) * 16 + y * 256] = data;
    }

    private generate(chunkX: number, chunkZ: number): void {

        if (this.generated[[chunkX, chunkZ].toString()]) return;
        this.generated[[chunkX, chunkZ].toString()] = true;
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

                const yGradient = Util.map(y, 8, 16, 0, 1);
                const yNoise = noiseY1(x / 50, y / 50, z / 50) - noiseY2(x / 50, y / 50, z / 50);
                const dy = Util.lerp(1, yNoise, yGradient);

                [x, y, z] = Vec3.toArray(Vec3.add(Vec3.normalize(new Vec3(dx, dy, dz)), new Vec3(x, y, z)));

                const r = Util.map(noiseR(x / 10, y / 10, z / 10), 0, 1, 2, 4);
                for (let blockX = Math.floor(x - r); blockX <= Math.floor(x + r); blockX++) {
                    for (let blockY = Math.max(2, Math.floor(y - r)); blockY <= Math.min(127, Math.floor(y + r)); blockY++) {
                        for (let blockZ = Math.floor(z - r); blockZ <= Math.floor(z + r); blockZ++) {
                            if (Util.dist3Square(blockX, blockY, blockZ, x, y, z) <= r * r) {
                                this.setData(blockX, blockY, blockZ, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    public getAndRemoveCaveData(chunk: Chunk): Uint8Array {

        for (let x = chunk.x - CaveGenerator.CHUNK_RADIUS; x <= chunk.x + CaveGenerator.CHUNK_RADIUS; x++) {
            for (let z = chunk.z - CaveGenerator.CHUNK_RADIUS; z <= chunk.z + CaveGenerator.CHUNK_RADIUS; z++) {
                this.generate(x, z);
            }
        }

        const data = this.caveData[[chunk.x, chunk.z].toString()] ?? new Uint8Array(16 * 128 * 16);
        delete this.caveData[[chunk.x, chunk.z].toString()];
        return data;
    }
}

export default CaveGenerator;