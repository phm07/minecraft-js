import Chunk from "./Chunk";
import WorldGenerator from "./WorldGenerator";
import PlayerPosition from "../../common/PlayerPosition";

class World {

    public readonly spawnPoint: PlayerPosition;
    private readonly generator: WorldGenerator;
    private readonly chunkMap: {[index: string]: Chunk};

    public constructor() {
        this.spawnPoint = new PlayerPosition(0, 100, 0, 0, 0);
        this.generator = new WorldGenerator();
        this.chunkMap = {};
    }

    public getChunk(x: number, z: number): Chunk {
        let chunk = this.chunkMap[[x, z].toString()];
        if(!chunk) {
            chunk = new Chunk(x, z);
            this.generator.generateChunk(chunk);
            this.chunkMap[[x, z].toString()] = chunk;
        }
        return chunk;
    }

}

export default World;