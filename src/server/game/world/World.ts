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

    public highestPointAt(x: number, z: number): number {
        const chunk = this.getChunk(Math.floor(x / 16), Math.floor(z / 16));
        const x1 = x - chunk.x * 16;
        const z1 = z - chunk.z * 16;
        let y = 0;
        while (chunk.blockAt(x1, y, z1)) y++;
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