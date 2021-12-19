import Chunk from "./chunk";
import WorldGenerator from "./world_generator";

class World {

    constructor() {
        this.spawnPoint = {x: 0, y: 100, z: 0, yaw: 0, pitch: 0};
        this.generator = new WorldGenerator("momm");
        this.chunkMap = {};
    }

    getChunk(x, z) {
        let chunk = this.chunkMap[[x, z]];
        if(!chunk) {
            chunk = new Chunk(x, z);
            this.generator.generateChunk(chunk);
            this.chunkMap[[x, z]] = chunk;
        }
        return chunk;
    }

}

export default World;