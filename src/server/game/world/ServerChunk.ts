import Chunk from "common/world/Chunk";
import Material from "common/world/Material";
import World from "common/world/World";
import Player from "server/game/player/Player";

class ServerChunk extends Chunk {

    public constructor(world: World, x: number, z: number) {
        super(world, x, z, new Uint8Array(32768).fill(Material.AIR));
    }

    public sendTo(player: Player): void {
        player.socket.emit("chunk", {
            x: this.x,
            z: this.z,
            blocks: this.collectSubChunks()
        });
    }

    private collectSubChunks(): Uint8Array {
        const blocks = new Uint8Array(32768);
        for (let level = 0; level < 8; level++) {
            blocks.set(this.subChunks[level].blocks, level * 16 * 16 * 16);
        }
        return blocks;
    }
}

export default ServerChunk;