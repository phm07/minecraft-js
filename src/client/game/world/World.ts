import GameScene from "../../scene/GameScene";
import Chunk from "./Chunk";
import ChunkWorker from "./ChunkWorker";
import Terrain from "./Terrain";

class World {

    public static readonly RENDER_DISTANCE = 8;

    private readonly requested: { [index: string]: boolean };
    private readonly worker: ChunkWorker;
    public readonly chunkMap: { [index: string]: Chunk };
    public readonly terrain: Terrain;

    public constructor() {
        this.chunkMap = {};
        this.requested = {};
        this.terrain = new Terrain(this);
        this.worker = new ChunkWorker(this);
        setTimeout(this.update.bind(this), 0);
    }

    public delete(): void {
        this.worker.stop();
    }

    public render(): void {
        this.terrain.render();
    }

    public blockAt(x: number, y: number, z: number): number {
        const chunk = this.chunkMap[[Math.floor(x / 16), Math.floor(z / 16)].toString()];
        return chunk?.blockAt(x & 15, y, z & 15) ?? 0;
    }

    public requestChunk(x: number, z: number): void {

        if (!this.requested[[x, z].toString()]) {
            game.client.socket?.emit("requestChunk", { x, z });
            this.requested[[x, z].toString()] = true;
        }
    }

    public unloadChunk(chunk: Chunk): void {
        delete this.chunkMap[[chunk.x, chunk.z].toString()];
        delete this.requested[[chunk.x, chunk.z].toString()];
        this.terrain.unloadChunk(chunk);
    }

    public update(): void {

        const chunkX = Math.floor((game.scene as GameScene).player.position.x / 16);
        const chunkZ = Math.floor((game.scene as GameScene).player.position.z / 16);

        for (const chunkCoord in this.chunkMap) {
            const chunk = this.chunkMap[chunkCoord];
            const dx = Math.abs(chunk.x - chunkX);
            const dz = Math.abs(chunk.z - chunkZ);
            if (dx > World.RENDER_DISTANCE || dz > World.RENDER_DISTANCE) {
                this.unloadChunk(chunk);
            }
        }

        for (let r = 0; r <= World.RENDER_DISTANCE; r++) {
            for (let x = -1; x <= 1; x += 2) {
                for (let z = chunkZ - r; z <= chunkZ + r; z++) {
                    this.requestChunk(chunkX + x * r, z);
                }
            }
            for (let z = -1; z <= 1; z += 2) {
                for (let x = chunkX - r; x <= chunkX + r; x++) {
                    this.requestChunk(x, chunkZ + z * r);
                }
            }
        }
    }

    public receiveChunk(chunkData: Chunk): void {

        const chunk = new Chunk(chunkData.x, chunkData.z, chunkData.blocks);
        this.worker.push(chunk);
    }

    public getNeighbors(chunk: Chunk): Chunk[] {
        return [
            this.chunkMap[[chunk.x - 1, chunk.z].toString()],
            this.chunkMap[[chunk.x + 1, chunk.z].toString()],
            this.chunkMap[[chunk.x, chunk.z - 1].toString()],
            this.chunkMap[[chunk.x, chunk.z + 1].toString()]
        ].filter(e => !!e);
    }
}

export default World;