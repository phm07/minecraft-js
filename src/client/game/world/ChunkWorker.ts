import Chunk from "./Chunk";
import World from "./World";

class ChunkWorker {

    private readonly world: World;
    private readonly queue: Chunk[];
    private readonly timer: NodeJS.Timer;

    public constructor(world: World, updateFunction: (chunk: Chunk) => void) {

        this.world = world;
        this.queue = [];

        this.timer = setInterval(() => {
            const chunk = this.queue.pop();
            if (!chunk) return;
            updateFunction(chunk);
        }, 5);
    }

    public delete(): void {
        clearInterval(this.timer);
    }

    public push(chunk: Chunk, priority: boolean): void {
        if (priority) {
            this.queue.push(chunk);
        } else {
            this.queue.unshift(chunk);
        }
    }
}

export default ChunkWorker;