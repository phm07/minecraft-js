import Chunk from "./Chunk";
import World from "./World";

class ChunkWorker {

    private readonly world: World;
    private readonly queue: Chunk[];
    private readonly timer: NodeJS.Timer;

    private working = false;

    public constructor(world: World) {
        this.world = world;
        this.queue = [];

        this.timer = setInterval(() => {

            const chunk = this.queue[this.queue.length - 1];
            if (!chunk || this.working) return;

            this.working = true;
            this.queue.pop();

            this.world.chunkMap[[chunk.x, chunk.z].toString()] = chunk;

            const neighbors = this.world.getNeighbors(chunk);

            if (neighbors.length === 4) {
                this.world.terrain.updateChunk(chunk);
            }

            neighbors.forEach(neighbor => {
                if (this.world.getNeighbors(neighbor).length === 4) {
                    this.world.terrain.updateChunk(neighbor);
                }
            });

            this.working = false;
        }, 20);
    }

    public stop(): void {
        clearInterval(this.timer);
    }

    public push(chunk: Chunk): void {
        this.queue.unshift(chunk);
    }
}

export default ChunkWorker;