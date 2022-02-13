import Block from "src/client/game/world/Block";
import Mesh from "src/client/gl/Mesh";
import Uint8Array3D from "src/common/util/Uint8Array3D";
import SubChunk from "src/common/world/SubChunk";
import World from "src/common/world/World";

class MeshGenerator {

    private readonly world: World;

    public constructor(world: World) {
        this.world = world;
    }

    private getNeighbors(subChunk: SubChunk): (SubChunk | undefined)[][][] {

        const neighbors: (SubChunk | undefined)[][][] = Array.from(new Array(3), () => Array.from(new Array(3), () => []));

        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                const chunk = this.world.chunkMap[[subChunk.chunk.x + x, subChunk.chunk.z + z].toString()];
                if (!chunk) continue;
                for (let y = -1; y <= 1; y++) {
                    if (subChunk.level + y < 0 || subChunk.level + y >= 8) continue;
                    neighbors[x + 1][y + 1][z + 1] = chunk.subChunks[subChunk.level + y];
                }
            }
        }

        return neighbors;
    }

    public generateSubChunkMesh(subChunk: SubChunk): Mesh {

        const neighbors = this.getNeighbors(subChunk);
        const blocks = new Uint8Array3D(18, 18, 18);

        for (let x = -1; x <= 16; x++) {
            for (let z = -1; z <= 16; z++) {
                for (let y = -1; y <= 16; y++) {
                    const blockChunk = neighbors[Math.floor(x / 16) + 1][Math.floor(y / 16) + 1][Math.floor(z / 16) + 1];
                    if (!blockChunk) continue;
                    blocks.setAt(x + 1, y + 1, z + 1, blockChunk.blocks.getAt(x & 15, y & 15, z & 15));
                }
            }
        }

        const vertices = [], indices = [];
        const light = 0.25;

        let offset = 0;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {

                    const block = blocks.getAt(x + 1, y + 1, z + 1);
                    const uv = Block.ofId(block)?.uvs;
                    if (!uv) continue;

                    const offX = subChunk.chunk.x * 16 + x;
                    const offZ = subChunk.chunk.z * 16 + z;
                    const offY = subChunk.level * 16 + y;

                    // front
                    if (!blocks.getAt(x + 1, y + 1, z + 2)) {

                        const top = !blocks.getAt(x + 1, y + 2, z + 2);
                        const right = !blocks.getAt(x + 2, y + 1, z + 2);
                        const bottom = !blocks.getAt(x + 1, y, z + 2);
                        const left = !blocks.getAt(x, y + 1, z + 2);
                        const topRight = top && right && !blocks.getAt(x + 2, y + 2, z + 2) ? 0 : light;
                        const bottomRight = bottom && right && !blocks.getAt(x + 2, y, z + 2) ? 0 : light;
                        const bottomLeft = bottom && left && !blocks.getAt(x, y, z + 2) ? 0 : light;
                        const topLeft = top && left && !blocks.getAt(x, y + 2, z + 2) ? 0 : light;

                        vertices.push(
                            offX + 0.0, offY + 1.0, offZ + 1.0, ...uv[3], 0.8 * (1 - topLeft),
                            offX + 0.0, offY + 0.0, offZ + 1.0, ...uv[0], 0.8 * (1 - bottomLeft),
                            offX + 1.0, offY + 0.0, offZ + 1.0, ...uv[1], 0.8 * (1 - bottomRight),
                            offX + 1.0, offY + 1.0, offZ + 1.0, ...uv[2], 0.8 * (1 - topRight)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // back
                    if (!blocks.getAt(x + 1, y + 1, z)) {

                        const top = !blocks.getAt(x + 1, y + 2, z);
                        const right = !blocks.getAt(x + 2, y + 1, z);
                        const bottom = !blocks.getAt(x + 1, y, z);
                        const left = !blocks.getAt(x, y + 1, z);
                        const topRight = top && right && !blocks.getAt(x + 2, y + 2, z) ? 0 : light;
                        const bottomRight = bottom && right && !blocks.getAt(x + 2, y, z) ? 0 : light;
                        const bottomLeft = bottom && left && !blocks.getAt(x, y, z) ? 0 : light;
                        const topLeft = top && left && !blocks.getAt(x, y + 2, z) ? 0 : light;

                        vertices.push(
                            offX + 0.0, offY + 0.0, offZ + 0.0, ...uv[5], 0.8 * (1 - bottomLeft),
                            offX + 0.0, offY + 1.0, offZ + 0.0, ...uv[6], 0.8 * (1 - topLeft),
                            offX + 1.0, offY + 1.0, offZ + 0.0, ...uv[7], 0.8 * (1 - topRight),
                            offX + 1.0, offY + 0.0, offZ + 0.0, ...uv[4], 0.8 * (1 - bottomRight)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        } else {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        }
                        offset += 4;
                    }

                    // top
                    if (!blocks.getAt(x + 1, y + 2, z + 1)) {

                        const top = !blocks.getAt(x + 1, y + 2, z);
                        const right = !blocks.getAt(x + 2, y + 2, z + 1);
                        const bottom = !blocks.getAt(x + 1, y + 2, z + 2);
                        const left = !blocks.getAt(x, y + 2, z + 1);
                        const topRight = top && right && !blocks.getAt(x + 2, y + 2, z) ? 0 : light;
                        const bottomRight = bottom && right && !blocks.getAt(x + 2, y + 2, z + 2) ? 0 : light;
                        const bottomLeft = bottom && left && !blocks.getAt(x, y + 2, z + 2) ? 0 : light;
                        const topLeft = top && left && !blocks.getAt(x, y + 2, z) ? 0 : light;

                        vertices.push(
                            offX + 0.0, offY + 1.0, offZ + 0.0, ...uv[8], 1 - topLeft,
                            offX + 0.0, offY + 1.0, offZ + 1.0, ...uv[9], 1 - bottomLeft,
                            offX + 1.0, offY + 1.0, offZ + 1.0, ...uv[10], 1 - bottomRight,
                            offX + 1.0, offY + 1.0, offZ + 0.0, ...uv[11], 1 - topRight
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // bottom
                    if (!blocks.getAt(x + 1, y, z + 1)) {

                        const top = !blocks.getAt(x + 1, y, z);
                        const right = !blocks.getAt(x + 2, y, z + 1);
                        const bottom = !blocks.getAt(x + 1, y, z + 2);
                        const left = !blocks.getAt(x, y, z + 1);
                        const topRight = top && right && !blocks.getAt(x + 2, y, z) ? 0 : light;
                        const bottomRight = bottom && right && !blocks.getAt(x + 2, y, z + 2) ? 0 : light;
                        const bottomLeft = bottom && left && !blocks.getAt(x, y, z + 2) ? 0 : light;
                        const topLeft = top && left && !blocks.getAt(x, y, z) ? 0 : light;

                        vertices.push(
                            offX + 0.0, offY + 0.0, offZ + 0.0, ...uv[12], 0.5 * (1 - topLeft),
                            offX + 1.0, offY + 0.0, offZ + 0.0, ...uv[13], 0.5 * (1 - topRight),
                            offX + 1.0, offY + 0.0, offZ + 1.0, ...uv[14], 0.5 * (1 - bottomRight),
                            offX + 0.0, offY + 0.0, offZ + 1.0, ...uv[15], 0.5 * (1 - bottomLeft)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // right
                    if (!blocks.getAt(x + 2, y + 1, z + 1)) {

                        const top = !blocks.getAt(x + 2, y + 2, z + 1);
                        const right = !blocks.getAt(x + 2, y + 1, z);
                        const bottom = !blocks.getAt(x + 2, y, z + 1);
                        const left = !blocks.getAt(x + 2, y + 1, z + 2);
                        const topRight = top && right && !blocks.getAt(x + 2, y + 2, z) ? 0 : light;
                        const bottomRight = bottom && right && !blocks.getAt(x + 2, y, z) ? 0 : light;
                        const bottomLeft = bottom && left && !blocks.getAt(x + 2, y, z + 2) ? 0 : light;
                        const topLeft = top && left && !blocks.getAt(x + 2, y + 2, z + 2) ? 0 : light;

                        vertices.push(
                            offX + 1.0, offY + 0.0, offZ + 0.0, ...uv[17], 0.6 * (1 - bottomRight),
                            offX + 1.0, offY + 1.0, offZ + 0.0, ...uv[18], 0.6 * (1 - topRight),
                            offX + 1.0, offY + 1.0, offZ + 1.0, ...uv[19], 0.6 * (1 - topLeft),
                            offX + 1.0, offY + 0.0, offZ + 1.0, ...uv[16], 0.6 * (1 - bottomLeft)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // left
                    if (!blocks.getAt(x, y + 1, z + 1)) {

                        const top = !blocks.getAt(x, y + 2, z + 1);
                        const right = !blocks.getAt(x, y + 1, z);
                        const bottom = !blocks.getAt(x, y, z + 1);
                        const left = !blocks.getAt(x, y + 1, z + 2);
                        const topRight = top && right && !blocks.getAt(x, y + 2, z) ? 0 : light;
                        const bottomRight = bottom && right && !blocks.getAt(x, y, z) ? 0 : light;
                        const bottomLeft = bottom && left && !blocks.getAt(x, y, z + 2) ? 0 : light;
                        const topLeft = top && left && !blocks.getAt(x, y + 2, z + 2) ? 0 : light;

                        vertices.push(
                            offX + 0.0, offY + 0.0, offZ + 0.0, ...uv[20], 0.6 * (1 - bottomRight),
                            offX + 0.0, offY + 0.0, offZ + 1.0, ...uv[21], 0.6 * (1 - bottomLeft),
                            offX + 0.0, offY + 1.0, offZ + 1.0, ...uv[22], 0.6 * (1 - topLeft),
                            offX + 0.0, offY + 1.0, offZ + 0.0, ...uv[23], 0.6 * (1 - topRight)
                        );

                        if (topRight + bottomLeft > bottomRight + topLeft) {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        } else {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        }
                        offset += 4;
                    }
                }
            }
        }

        return new Mesh(vertices, [3, 3, 1], indices);
    }
}

export default MeshGenerator;