import Chunk from "common/world/Chunk";
import Material from "common/world/Material";

abstract class World {

    public readonly chunkMap: Record<string, Chunk | undefined>;

    protected constructor() {
        this.chunkMap = {};
    }

    public isLoaded(chunkX: number, chunkZ: number): boolean {
        return Boolean(this.chunkMap[[chunkX, chunkZ].toString()]);
    }

    public blockAt(x: number, y: number, z: number): Material {
        const chunk = this.chunkMap[[x >> 4, z >> 4].toString()];
        return chunk?.blockAt(x & 15, y, z & 15) ?? 0;
    }
}

export default World;