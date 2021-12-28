import Block from "./Block";

class Chunk {

    public readonly x: number;
    public readonly z: number;
    public readonly blocks: Uint8Array;

    public constructor(x: number, z: number, blocks: Uint8Array) {
        this.x = x;
        this.z = z;
        this.blocks = blocks;
    }

    public blockAt(x: number, y: number, z: number): Block | undefined {
        return Block.ofId(this.blocks[x + z * 16 + y * 256]);
    }

    public setBlockAt(x: number, y: number, z: number, block: number): void {
        this.blocks[x + z * 16 + y * 256] = block;
    }
}

export default Chunk;