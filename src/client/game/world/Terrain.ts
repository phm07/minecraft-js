import terrain from "../../assets/terrain.png";
import Mesh from "../../gl/Mesh";
import Shader from "../../gl/Shader";
import TextureArray from "../../gl/TextureArray";
import GameScene from "../../scene/GameScene";
import fragmentShader from "../../shaders/terrain.fs";
import vertexShader from "../../shaders/terrain.vs";
import Block from "./Block";
import Chunk from "./Chunk";
import ChunkWorker from "./ChunkWorker";
import World from "./World";

class Terrain {

    private readonly world: World;
    private readonly meshes: Record<string, Mesh | undefined>;
    private readonly chunkWorker: ChunkWorker;
    private readonly shader: Shader;
    private readonly viewMatrixUniform: WebGLUniformLocation | null;
    private readonly projectionMatrixUniform: WebGLUniformLocation | null;
    private readonly samplerUniform: WebGLUniformLocation | null;
    private readonly texture: TextureArray;

    public constructor(world: World) {

        this.world = world;
        this.meshes = {};
        this.chunkWorker = new ChunkWorker(world, this.updateChunk.bind(this));
        this.shader = new Shader(vertexShader, fragmentShader);
        this.viewMatrixUniform = this.shader.getUniformLocation("uViewMatrix");
        this.projectionMatrixUniform = this.shader.getUniformLocation("uProjMatrix");
        this.samplerUniform = this.shader.getUniformLocation("uTexture");
        this.texture = new TextureArray(terrain, 16, 16);
    }

    public render(): void {

        this.shader.bind();
        GL.uniformMatrix4fv(this.viewMatrixUniform, false, (game.scene as GameScene).camera.viewMatrix);
        GL.uniformMatrix4fv(this.projectionMatrixUniform, false, (game.scene as GameScene).camera.projectionMatrix);
        GL.uniform1i(this.samplerUniform, 0);
        GL.activeTexture(GL.TEXTURE0);
        this.texture.bind();

        for (const coord in this.meshes) {
            const mesh = this.meshes[coord];
            if (mesh) {
                mesh.bind();
                GL.drawElements(GL.TRIANGLES, mesh.numIndices, GL.UNSIGNED_INT, 0);
            }
        }
    }

    public delete(): void {
        Object.values(this.meshes).forEach((mesh) => mesh?.delete());
        this.shader.delete();
        this.texture.delete();
        this.chunkWorker.delete();
    }

    public unloadChunk(chunk: Chunk): void {

        const mesh = this.meshes[[chunk.x, chunk.z].toString()];
        if (mesh) {
            mesh.delete();
            delete this.meshes[[chunk.x, chunk.z].toString()];
        }
    }

    public requestChunkUpdate(chunk?: Chunk, priority = false): void {
        if (chunk) {
            this.chunkWorker.push(chunk, priority);
        }
    }

    private updateChunk(chunk: Chunk): void {

        const blocks = new Array<number>(18 * 130 * 18).fill(0);

        const north = this.world.chunkMap[[chunk.x, chunk.z - 1].toString()];
        const northeast = this.world.chunkMap[[chunk.x + 1, chunk.z - 1].toString()];
        const east = this.world.chunkMap[[chunk.x + 1, chunk.z].toString()];
        const southeast = this.world.chunkMap[[chunk.x + 1, chunk.z + 1].toString()];
        const south = this.world.chunkMap[[chunk.x, chunk.z + 1].toString()];
        const southwest = this.world.chunkMap[[chunk.x - 1, chunk.z + 1].toString()];
        const west = this.world.chunkMap[[chunk.x - 1, chunk.z].toString()];
        const northwest = this.world.chunkMap[[chunk.x - 1, chunk.z - 1].toString()];

        for (let x = -1; x <= 16; x++) {
            for (let z = -1; z <= 16; z++) {

                let blockChunk;
                if (x < 0) {
                    if (z < 0) {
                        blockChunk = northwest;
                    } else if (z > 15) {
                        blockChunk = southwest;
                    } else {
                        blockChunk = west;
                    }
                } else if (x > 15) {
                    if (z < 0) {
                        blockChunk = northeast;
                    } else if (z > 15) {
                        blockChunk = southeast;
                    } else {
                        blockChunk = east;
                    }
                } else if (z < 0) {
                        blockChunk = north;
                    } else if (z > 15) {
                        blockChunk = south;
                    } else {
                        blockChunk = chunk;
                    }

                if (!blockChunk) continue;

                for (let y = 0; y < 127; y++) {
                    blocks[x + 1 + (z + 1) * 18 + (y + 1) * 324] = blockChunk.blocks[(x & 15) + (z & 15) * 16 + y * 256];
                }
            }
        }

        const vertices = [], indices = [];
        const light = 0.25;

        let offset = 0;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 128; y++) {
                for (let z = 0; z < 16; z++) {

                    const block = blocks[x + 1 + (z + 1) * 18 + (y + 1) * 324];
                    const uv = Block.ofId(block)?.uvs;
                    if (!uv) continue;

                    const offX = chunk.x * 16 + x;
                    const offZ = chunk.z * 16 + z;

                    // front
                    if (!blocks[x + 1 + (z + 2) * 18 + (y + 1) * 324]) {
                        const top = !blocks[x + 1 + (z + 2) * 18 + (y + 2) * 324];
                        const right = !blocks[x + 2 + (z + 2) * 18 + (y + 1) * 324];
                        const bottom = !blocks[x + 1 + (z + 2) * 18 + y * 324];
                        const left = !blocks[x + (z + 2) * 18 + (y + 1) * 324];
                        const topRight = top && right && !blocks[x + 2 + (z + 2) * 18 + (y + 2) * 324] ? 0 : light;
                        const bottomRight = bottom && right && !blocks[x + 2 + (z + 2) * 18 + y * 324] ? 0 : light;
                        const bottomLeft = bottom && left && !blocks[x + (z + 2) * 18 + y * 324] ? 0 : light;
                        const topLeft = top && left && !blocks[x + (z + 2) * 18 + (y + 2) * 324] ? 0 : light;

                        vertices.push(
                            offX + 0.0, y + 1.0, offZ + 1.0, ...uv[3], 0.8 * (1 - topLeft),
                            offX + 0.0, y + 0.0, offZ + 1.0, ...uv[0], 0.8 * (1 - bottomLeft),
                            offX + 1.0, y + 0.0, offZ + 1.0, ...uv[1], 0.8 * (1 - bottomRight),
                            offX + 1.0, y + 1.0, offZ + 1.0, ...uv[2], 0.8 * (1 - topRight)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // back
                    if (!blocks[x + 1 + z * 18 + (y + 1) * 324]) {
                        const top = !blocks[x + 1 + z * 18 + (y + 2) * 324];
                        const right = !blocks[x + 2 + z * 18 + (y + 1) * 324];
                        const bottom = !blocks[x + 1 + z * 18 + y * 324];
                        const left = !blocks[x + z * 18 + (y + 1) * 324];
                        const topRight = top && right && !blocks[x + 2 + z * 18 + (y + 2) * 324] ? 0 : light;
                        const bottomRight = bottom && right && !blocks[x + 2 + z * 18 + y * 324] ? 0 : light;
                        const bottomLeft = bottom && left && !blocks[x + z * 18 + y * 324] ? 0 : light;
                        const topLeft = top && left && !blocks[x + z * 18 + (y + 2) * 324] ? 0 : light;

                        vertices.push(
                            offX + 0.0, y + 0.0, offZ + 0.0, ...uv[5], 0.8 * (1 - bottomLeft),
                            offX + 0.0, y + 1.0, offZ + 0.0, ...uv[6], 0.8 * (1 - topLeft),
                            offX + 1.0, y + 1.0, offZ + 0.0, ...uv[7], 0.8 * (1 - topRight),
                            offX + 1.0, y + 0.0, offZ + 0.0, ...uv[4], 0.8 * (1 - bottomRight)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        } else {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        }
                        offset += 4;
                    }

                    // top
                    if (!blocks[x + 1 + (z + 1) * 18 + (y + 2) * 324]) {
                        const top = !blocks[x + 1 + z * 18 + (y + 2) * 324];
                        const right = !blocks[x + 2 + (z + 1) * 18 + (y + 2) * 324];
                        const bottom = !blocks[x + 1 + (z + 2) * 18 + (y + 2) * 324];
                        const left = !blocks[x + (z + 1) * 18 + (y + 2) * 324];
                        const topRight = top && right && !blocks[x + 2 + z * 18 + (y + 2) * 324] ? 0 : light;
                        const bottomRight = bottom && right && !blocks[x + 2 + (z + 2) * 18 + (y + 2) * 324] ? 0 : light;
                        const bottomLeft = bottom && left && !blocks[x + (z + 2) * 18 + (y + 2) * 324] ? 0 : light;
                        const topLeft = top && left && !blocks[x + z * 18 + (y + 2) * 324] ? 0 : light;

                        vertices.push(
                            offX + 0.0, y + 1.0, offZ + 0.0, ...uv[8], 1 - topLeft,
                            offX + 0.0, y + 1.0, offZ + 1.0, ...uv[9], 1 - bottomLeft,
                            offX + 1.0, y + 1.0, offZ + 1.0, ...uv[10], 1 - bottomRight,
                            offX + 1.0, y + 1.0, offZ + 0.0, ...uv[11], 1 - topRight
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // bottom
                    if (!blocks[x + 1 + (z + 1) * 18 + y * 324]) {
                        const top = !blocks[x + 1 + z * 18 + y * 324];
                        const right = !blocks[x + 2 + (z + 1) * 18 + y * 324];
                        const bottom = !blocks[x + 1 + (z + 2) * 18 + y * 324];
                        const left = !blocks[x + (z + 1) * 18 + y * 324];
                        const topRight = top && right && !blocks[x + 2 + z * 18 + y * 324] ? 0 : light;
                        const bottomRight = bottom && right && !blocks[x + 2 + (z + 2) * 18 + y * 324] ? 0 : light;
                        const bottomLeft = bottom && left && !blocks[x + (z + 2) * 18 + y * 324] ? 0 : light;
                        const topLeft = top && left && !blocks[x + z * 18 + y * 324] ? 0 : light;

                        vertices.push(
                            offX + 0.0, y + 0.0, offZ + 0.0, ...uv[12], 0.5 * (1 - topLeft),
                            offX + 1.0, y + 0.0, offZ + 0.0, ...uv[13], 0.5 * (1 - topRight),
                            offX + 1.0, y + 0.0, offZ + 1.0, ...uv[14], 0.5 * (1 - bottomRight),
                            offX + 0.0, y + 0.0, offZ + 1.0, ...uv[15], 0.5 * (1 - bottomLeft)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // right
                    if (!blocks[x + 2 + (z + 1) * 18 + (y + 1) * 324]) {
                        const top = !blocks[x + 2 + (z + 1) * 18 + (y + 2) * 324];
                        const right = !blocks[x + 2 + z * 18 + (y + 1) * 324];
                        const bottom = !blocks[x + 2 + (z + 1) * 18 + y * 324];
                        const left = !blocks[x + 2 + (z + 2) * 18 + (y + 1) * 324];
                        const topRight = top && right && !blocks[x + 2 + z * 18 + (y + 2) * 324] ? 0 : light;
                        const bottomRight = bottom && right && !blocks[x + 2 + z * 18 + y * 324] ? 0 : light;
                        const bottomLeft = bottom && left && !blocks[x + 2 + (z + 2) * 18 + y * 324] ? 0 : light;
                        const topLeft = top && left && !blocks[x + 2 + (z + 2) * 18 + (y + 2) * 324] ? 0 : light;

                        vertices.push(
                            offX + 1.0, y + 0.0, offZ + 0.0, ...uv[17], 0.6 * (1 - bottomRight),
                            offX + 1.0, y + 1.0, offZ + 0.0, ...uv[18], 0.6 * (1 - topRight),
                            offX + 1.0, y + 1.0, offZ + 1.0, ...uv[19], 0.6 * (1 - topLeft),
                            offX + 1.0, y + 0.0, offZ + 1.0, ...uv[16], 0.6 * (1 - bottomLeft)
                        );

                        if (topLeft + bottomRight > bottomLeft + topRight) {
                            indices.push(offset + 1, offset + 2, offset + 3, offset + 1, offset + 3, offset);
                        } else {
                            indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        }
                        offset += 4;
                    }

                    // left
                    if (!blocks[x + (z + 1) * 18 + (y + 1) * 324]) {
                        const top = !blocks[x + (z + 1) * 18 + (y + 2) * 324];
                        const right = !blocks[x + z * 18 + (y + 1) * 324];
                        const bottom = !blocks[x + (z + 1) * 18 + y * 324];
                        const left = !blocks[x + (z + 2) * 18 + (y + 1) * 324];
                        const topRight = top && right && !blocks[x + z * 18 + (y + 2) * 324] ? 0 : light;
                        const bottomRight = bottom && right && !blocks[x + z * 18 + y * 324] ? 0 : light;
                        const bottomLeft = bottom && left && !blocks[x + (z + 2) * 18 + y * 324] ? 0 : light;
                        const topLeft = top && left && !blocks[x + (z + 2) * 18 + (y + 2) * 324] ? 0 : light;

                        vertices.push(
                            offX + 0.0, y + 0.0, offZ + 0.0, ...uv[20], 0.6 * (1 - bottomRight),
                            offX + 0.0, y + 0.0, offZ + 1.0, ...uv[21], 0.6 * (1 - bottomLeft),
                            offX + 0.0, y + 1.0, offZ + 1.0, ...uv[22], 0.6 * (1 - topLeft),
                            offX + 0.0, y + 1.0, offZ + 0.0, ...uv[23], 0.6 * (1 - topRight)
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

        const mesh = new Mesh(vertices, [3, 3, 1], indices);
        const current = this.meshes[[chunk.x, chunk.z].toString()];
        if (current) current.delete();
        this.meshes[[chunk.x, chunk.z].toString()] = mesh;
    }
}

export default Terrain;