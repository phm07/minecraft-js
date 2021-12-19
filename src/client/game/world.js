import Chunk from "./chunk";
import Terrain from "./terrain";

class World {

    static RENDER_DISTANCE = 8;

    constructor() {
        this.chunkMap = {};
        this.requested = {};
        this.terrain = new Terrain(this);

        const world = this;
        this.worker = {
            queue: [],
            start() {
                this.timer = setInterval(async () => {
            
                    const chunk = this.queue[this.queue.length-1];
                    if(!chunk || this.working) return;
                    this.working = true;
                    this.queue.pop();
        
                    world.chunkMap[[chunk.x, chunk.z]] = chunk;
        
                    const neighbors = world.getNeighbors(chunk);
                    if(neighbors.length === 4) {
                        world.terrain.updateChunk(chunk);
                    }
                    for(let neighbor of neighbors) {
                        if(world.getNeighbors(neighbor).length === 4) {
                            world.terrain.updateChunk(neighbor);
                        }
                    }
                    this.working = false;
                }, 20);
            },
            stop() {
                clearInterval(this.timer);
            },
            push(chunk) {
                this.queue.unshift(chunk);
            }
        };

        this.worker.start();

        setTimeout(this.update.bind(this), 0);
    }

    delete() {
        this.worker.stop();
    }

    render() {
        this.terrain.render();
    }

    blockAt(x, y, z) {

        const chunk = this.chunkMap[[Math.floor(x/16), Math.floor(z/16)]];
        return chunk?.blockAt?.(x & 15, y, z & 15) ?? 0;
    }

    requestChunk(x, z) {

        if(!this.requested[[x, z]]) {
            game.client.socket.emit("requestChunk", {x, z});
            this.requested[[x, z]] = true;
        }
    }

    unloadChunk(chunk) {
        delete this.chunkMap[[chunk.x, chunk.z]];
        delete this.requested[[chunk.x, chunk.z]];
        this.terrain.unloadChunk(chunk);
    }

    update() {

        const chunkX = Math.floor(game.scene.player.position.x / 16);
        const chunkZ = Math.floor(game.scene.player.position.z / 16);

        for(let chunkCoord in this.chunkMap) {
            const chunk = this.chunkMap[chunkCoord];
            const dx = Math.abs(chunk.x - chunkX);
            const dz = Math.abs(chunk.z - chunkZ);
            if(dx > World.RENDER_DISTANCE || dz > World.RENDER_DISTANCE) {
                this.unloadChunk(chunk);
            }
        }

        for(let r = 0; r <= World.RENDER_DISTANCE; r++) {
            for(let x = -1; x <= 1; x += 2) {
                for(let z = chunkZ-r; z <= chunkZ+r; z++) {
                    this.requestChunk(chunkX+x*r, z);
                }
            }
            for(let z = -1; z <= 1; z += 2) {
                for(let x = chunkX-r; x <= chunkX+r; x++) {
                    this.requestChunk(x, chunkZ+z*r);
                }
            }
        }
    }

    async receiveChunk(chunkData) {

        const chunk = new Chunk(chunkData.x, chunkData.z, chunkData.blocks);
        this.worker.push(chunk);
    }

    getNeighbors(chunk) {
        return [
            this.chunkMap[[chunk.x - 1, chunk.z]],
            this.chunkMap[[chunk.x + 1, chunk.z]],
            this.chunkMap[[chunk.x, chunk.z - 1]],
            this.chunkMap[[chunk.x, chunk.z + 1]],
        ].filter(e => !!e);
    }
}

export default World;