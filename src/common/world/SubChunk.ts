import Uint8Array3D from "src/common/util/Uint8Array3D";
import Chunk from "src/common/world/Chunk";

class SubChunk {

    public readonly chunk: Chunk;
    public readonly level: number;
    public readonly blocks: Uint8Array3D;

    public constructor(chunk: Chunk, level: number, blocks: Uint8Array3D) {
        this.chunk = chunk;
        this.level = level;
        this.blocks = blocks;
    }
}

export default SubChunk;