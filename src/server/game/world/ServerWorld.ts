import Chunk from "src/common/world/Chunk";
import Position from "src/common/world/Position";
import World from "src/common/world/World";
import ServerChunk from "src/server/game/world/ServerChunk";
import WorldGenerator from "src/server/game/world/WorldGenerator";

class ServerWorld extends World {

    private readonly generator: WorldGenerator;

    public constructor() {
        super();
        this.generator = new WorldGenerator("");
        for (let x = -3; x <= 3; x++) {
            for (let z = -3; z <= 3; z++) {
                void this.getChunk(x, z);
            }
        }
    }

    public async getSpawnPoint(): Promise<Position> {
        return new Position(0.5, await this.highestPointAt(0, 0), 0.5, 0, 0);
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

    public async highestPointAt(x: number, z: number): Promise<number> {
        const chunk = await this.getChunk(x >> 4, z >> 4);
        let y = 128;
        while (y > 1 && !chunk.blockAt(x & 15, y - 1, z & 15)) y--;
        return y;
    }

    public async getChunk(x: number, z: number): Promise<Chunk> {
        let chunk = this.chunkMap[[x, z].toString()];
        if (!chunk) {
            chunk = new ServerChunk(this, x, z);
            await this.generator.generateChunk(chunk);
            this.chunkMap[[x, z].toString()] = chunk;
        }
        return chunk;
    }

}

export default ServerWorld;