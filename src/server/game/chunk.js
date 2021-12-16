import Blocks from "./blocks";

class Chunk {

    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.blocks = new Uint8Array(32768).fill(Blocks.AIR);
    }

    blockAt(x, y, z) {
        return this.blocks[x + z * 16 + y * 256];
    }

    setBlockAt(x, y, z, block) {
        this.blocks[x + z * 16 + y * 256] = block;
    }

    sendTo(player) {
        player.socket.emit("chunk", {
            x: this.x,
            z: this.z,
            blocks: this.blocks
        });
    }
}

export default Chunk;