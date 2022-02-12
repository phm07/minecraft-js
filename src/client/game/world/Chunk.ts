import Uint8Array3D from "../../../common/Uint8Array3D";
import SubChunk from "./SubChunk";
import World from "./World";

class Chunk {

    public readonly world: World;
    public readonly x: number;
    public readonly z: number;
    public readonly subChunks: SubChunk[];

    public constructor(world: World, x: number, z: number, blocks: Uint8Array) {
        this.world = world;
        this.x = x;
        this.z = z;

        this.subChunks = [];
        for (let level = 0; level < 8; level++) {
            const subChunkBlocks = new Uint8Array3D(16, 16, 16, blocks.slice(level * 16 * 16 * 16, (level + 1) * 16 * 16 * 16));
            this.subChunks[level] = new SubChunk(this, level, subChunkBlocks);
        }
    }

    public blockAt(x: number, y: number, z: number): number {
        return this.subChunks[Math.floor(y / 16)].blocks.get(x, y & 15, z);
    }

    public setBlockAt(x: number, y: number, z: number, block: number): void {
        this.subChunks[Math.floor(y / 16)].blocks.set(x, y & 15, z, block);
    }
}

export default Chunk;