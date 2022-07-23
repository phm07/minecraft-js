import Terrain from "src/client/game/world/Terrain";
import Camera from "src/client/gl/Camera";
import AABB from "src/client/physics/AABB";
import GameScene from "src/client/scene/GameScene";
import Vec3 from "src/common/math/Vec3";
import Chunk from "src/common/world/Chunk";
import Position from "src/common/world/Position";
import World from "src/common/world/World";

class ClientWorld extends World {

    public static readonly RENDER_DISTANCE = 8;

    private readonly requested: Record<string, boolean | undefined>;
    public readonly terrain: Terrain;

    public constructor() {
        super();
        this.requested = {};
        this.terrain = new Terrain(this);
        setTimeout(this.update.bind(this), 0);
    }

    public delete(): void {
        this.terrain.delete();
    }

    public render(camera: Camera): void {
        this.terrain.render(camera);
    }

    public isPlaceable(x: number, y: number, z: number): boolean {
        const aabb = new AABB(x, y, z, 1, 1, 1);
        return y >= 0 && y <= 127
            && !this.blockAt(x, y, z)
            && !(game.scene as GameScene).player.getBoundingBox().intersects(aabb)
            && !(game.scene as GameScene).humanFactory.humans.some((human) => human.getBoundingBox().intersects(aabb));
    }

    public raycastBlock(position: Position, maxDistance: number): { blockPos: Vec3, probePos: Vec3 } | null {

        const { x, y, z, pitch, yaw } = position;

        const dx = Math.cos(pitch) * Math.cos(yaw + Math.PI / 2);
        const dy = Math.sin(pitch);
        const dz = Math.cos(pitch) * Math.sin(yaw + Math.PI / 2);

        for (let d = 0; d <= maxDistance; d += 0.025) {
            const x1 = x - dx * d;
            const y1 = y - dy * d;
            const z1 = z - dz * d;
            const blockX = Math.floor(x1);
            const blockY = Math.floor(y1);
            const blockZ = Math.floor(z1);
            if (this.blockAt(blockX, blockY, blockZ)) {
                return { blockPos: new Vec3(blockX, blockY, blockZ), probePos: new Vec3(x1, y1, z1) };
            }
        }

        return null;
    }

    public async setBlock(x: number, y: number, z: number, block: number): Promise<void> {

        const chunk = this.chunkMap[[x >> 4, z >> 4].toString()];
        if (!chunk) return;

        chunk.setBlockAt(x & 15, y, z & 15, block);

        const edgeX = (x & 15) === 0 ? -1 : (x & 15) === 15 ? 1 : 0;
        const edgeY = (y & 15) === 0 ? -1 : (y & 15) === 15 ? 1 : 0;
        const edgeZ = (z & 15) === 0 ? -1 : (z & 15) === 15 ? 1 : 0;

        if (block !== 0) {
            await this.terrain.updateSubChunk(chunk.subChunks[y >> 4]);
        }

        for (let chunkX = Math.min(0, edgeX); chunkX <= Math.max(0, edgeX); chunkX++) {
            for (let chunkZ = Math.min(0, edgeZ); chunkZ <= Math.max(0, edgeZ); chunkZ++) {

                const x1 = (x >> 4) + chunkX;
                const z1 = (z >> 4) + chunkZ;
                const theChunk = this.chunkMap[[x1, z1].toString()];
                if (!theChunk) continue;

                for (let chunkY = Math.min(0, edgeY); chunkY <= Math.max(0, edgeY); chunkY++) {
                    const y1 = (y >> 4) + chunkY;
                    if (y1 < 0 || y1 >= 8 || x1 === 0 && y1 === 0 && z1 === 0) continue;
                    await this.terrain.updateSubChunk(theChunk.subChunks[y1]);
                }
            }
        }

        if (block === 0) {
            await this.terrain.updateSubChunk(chunk.subChunks[y >> 4]);
        }
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

        const chunkX = (game.scene as GameScene).player.position.x >> 4;
        const chunkZ = (game.scene as GameScene).player.position.z >> 4;

        for (const chunkCoord in this.chunkMap) {
            const chunk = this.chunkMap[chunkCoord];
            if (!chunk) continue;
            const dx = Math.abs(chunk.x - chunkX);
            const dz = Math.abs(chunk.z - chunkZ);
            if (dx > ClientWorld.RENDER_DISTANCE || dz > ClientWorld.RENDER_DISTANCE) {
                this.unloadChunk(chunk);
            }
        }

        for (let r = 0; r <= ClientWorld.RENDER_DISTANCE; r++) {
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

    public async receiveChunk(x: number, z: number, blocks: Uint8Array): Promise<void> {

        const chunk = new Chunk(this, x, z, blocks);
        this.chunkMap[[chunk.x, chunk.z].toString()] = chunk;

        const neighbors = this.getNeighbors(chunk);
        if (neighbors.length === 8) {
            await this.terrain.updateChunk(chunk);
        }

        await Promise.all(neighbors.map(async (neighbor) => {
            if (this.getNeighbors(neighbor).length === 8) {
                await this.terrain.updateChunk(neighbor);
            }
        }));
    }

    public getNeighbors(chunk: Chunk): Chunk[] {
        return [
            this.chunkMap[[chunk.x, chunk.z - 1].toString()],
            this.chunkMap[[chunk.x + 1, chunk.z - 1].toString()],
            this.chunkMap[[chunk.x + 1, chunk.z].toString()],
            this.chunkMap[[chunk.x + 1, chunk.z + 1].toString()],
            this.chunkMap[[chunk.x, chunk.z + 1].toString()],
            this.chunkMap[[chunk.x - 1, chunk.z + 1].toString()],
            this.chunkMap[[chunk.x - 1, chunk.z].toString()],
            this.chunkMap[[chunk.x - 1, chunk.z - 1].toString()]
        ].filter((e): e is Chunk => e !== undefined);
    }
}

export default ClientWorld;