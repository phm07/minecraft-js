import Position from "../../../common/Position";
import Chunk from "./Chunk";
import WorldGenerator from "./WorldGenerator";

class World {

    public readonly spawnPoint: Position;
    private readonly generator: WorldGenerator;
    private readonly chunkMap: Record<string, Chunk | undefined>;

    public constructor() {
        this.generator = new WorldGenerator("");
        this.chunkMap = {};
        for (let x = -3; x <= 3; x++) {
            for (let z = -3; z <= 3; z++) {
                this.getChunk(x, z);
            }
        }
        this.spawnPoint = new Position(0, this.highestPointAt(0, 0), 0, 0, 0);
    }

    public blockAt(x: number, y: number, z: number): number {
        const chunk = this.chunkMap[[x >> 4, z >> 4].toString()];
        return chunk?.blockAt(x & 15, y, z & 15) ?? 0;
    }

    public setBlock(x: number, y: number, z: number, block: number): void {
        const chunk = this.chunkMap[[x >> 4, z >> 4].toString()];
        if (!chunk) return;
        chunk.setBlockAt(x & 15, y, z & 15, block);
    }

    public highestPointAt(x: number, z: number): number {
        const chunk = this.getChunk(x >> 4, z >> 4);
        let y = 0;
        while (chunk.blockAt(x & 15, y, z & 15)) y++;
        return y;
    }

    public getChunk(x: number, z: number): Chunk {
        let chunk = this.chunkMap[[x, z].toString()];
        if (!chunk) {
            chunk = new Chunk(x, z);
            this.generator.generateChunk(chunk);
            this.chunkMap[[x, z].toString()] = chunk;
        }
        return chunk;
    }

}

export default World;