import Player from "../player/Player";
import Blocks from "./Blocks";

class Chunk {

    public readonly x: number;
    public readonly z: number;
    private readonly blocks: Uint8Array;

    public constructor(x: number, z: number) {
        this.x = x;
        this.z = z;
        this.blocks = new Uint8Array(32768).fill(Blocks.AIR);
    }

    public blockAt(x: number, y: number, z: number): number {
        return this.blocks[x + z * 16 + y * 256];
    }

    public setBlockAt(x: number, y: number, z: number, block: number): void {
        this.blocks[x + z * 16 + y * 256] = block;
    }

    public sendTo(player: Player): void {
        player.socket.emit("chunk", {
            x: this.x,
            z: this.z,
            blocks: this.blocks
        });
    }
}

export default Chunk;