class Chunk {

    constructor(x, z, blocks) {
        this.x = x;
        this.z = z;
        this.blocks = blocks;
    }

    blockAt(x, y, z) {
        return this.blocks[x + z * 16 + y * 256];
    }

    setBlockAt(x, y, z, block) {
        this.blocks[x + z * 16 + y * 256] = block;
    }
}

export default Chunk;