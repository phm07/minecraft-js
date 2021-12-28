import terrain from "../../assets/terrain.png";
import Mesh from "../../gl/Mesh";
import Shader from "../../gl/Shader";
import TextureArray from "../../gl/TextureArray";
import GameScene from "../../scene/GameScene";
import fragmentShader from "../../shaders/terrain.fs";
import vertexShader from "../../shaders/terrain.vs";
import Block from "./Block";
import Chunk from "./Chunk";
import World from "./World";

class Terrain {

    private readonly world: World;
    private readonly meshes: Record<string, Mesh | undefined>;
    private readonly shader: Shader;
    private readonly viewMatrixUniform: WebGLUniformLocation | null;
    private readonly projectionMatrixUniform: WebGLUniformLocation | null;
    private readonly samplerUniform: WebGLUniformLocation | null;
    private readonly texture: TextureArray;

    public constructor(world: World) {

        this.world = world;
        this.meshes = {};
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

    public unloadChunk(chunk: Chunk): void {

        const mesh = this.meshes[[chunk.x, chunk.z].toString()];
        if (mesh) {
            mesh.delete();
            delete this.meshes[[chunk.x, chunk.z].toString()];
        }
    }

    public updateChunk(chunk?: Chunk): void {

        if (!chunk) return;

        const left = this.world.chunkMap[[chunk.x - 1, chunk.z].toString()];
        const right = this.world.chunkMap[[chunk.x + 1, chunk.z].toString()];
        const back = this.world.chunkMap[[chunk.x, chunk.z - 1].toString()];
        const front = this.world.chunkMap[[chunk.x, chunk.z + 1].toString()];

        const isSolid = new Uint8Array(18 * 130 * 18);

        for (let x = -1; x <= 16; x++) {
            for (let z = -1; z <= 16; z++) {
                if ((x < 0 || x > 15) && (z < 0 || z > 15)) continue;
                for (let y = -1; y <= 128; y++) {
                    let solid;
                    if (y < 0 || y >= 128) {
                        solid = 0;
                    } else if (x >= 0 && x < 16 && z >= 0 && z < 16) {
                        solid = Boolean(chunk.blockAt(x, y, z));
                    } else if (x < 0) {
                        solid = Boolean(left?.blockAt(x + 16, y, z));
                    } else if (x >= 16) {
                        solid = Boolean(right?.blockAt(x - 16, y, z));
                    } else if (z < 0) {
                        solid = Boolean(back?.blockAt(x, y, z + 16));
                    } else if (z >= 16) {
                        solid = Boolean(front?.blockAt(x, y, z - 16));
                    }
                    isSolid[x + 1 + (z + 1) * 18 + (y + 1) * 324] = solid ? 1 : 0;
                }
            }
        }

        const vertices = [], indices = [];

        let offset = 0;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 128; y++) {
                for (let z = 0; z < 16; z++) {

                    const id = chunk.blockAt(x, y, z);
                    const uv = Block.ofId(id)?.uvs;
                    if (!uv) continue;

                    const offX = chunk.x * 16 + x;
                    const offZ = chunk.z * 16 + z;

                    if (!isSolid[x + 1 + (z + 2) * 18 + (y + 1) * 324]) {
                        vertices.push(
                            // front
                            offX + 0.0, y + 1.0, offZ + 1.0, ...uv[3], 0.9,
                            offX + 0.0, y + 0.0, offZ + 1.0, ...uv[0], 0.9,
                            offX + 1.0, y + 0.0, offZ + 1.0, ...uv[1], 0.9,
                            offX + 1.0, y + 1.0, offZ + 1.0, ...uv[2], 0.9
                        );
                        indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        offset += 4;
                    }
                    if (!isSolid[x + 1 + z * 18 + (y + 1) * 324]) {
                        vertices.push(
                            // back
                            offX + 0.0, y + 0.0, offZ + 0.0, ...uv[5], 0.9,
                            offX + 0.0, y + 1.0, offZ + 0.0, ...uv[6], 0.9,
                            offX + 1.0, y + 1.0, offZ + 0.0, ...uv[7], 0.9,
                            offX + 1.0, y + 0.0, offZ + 0.0, ...uv[4], 0.9
                        );
                        indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        offset += 4;
                    }
                    if (!isSolid[x + 1 + (z + 1) * 18 + (y + 2) * 324]) {
                        vertices.push(
                            // top
                            offX + 0.0, y + 1.0, offZ + 0.0, ...uv[8], 1.0,
                            offX + 0.0, y + 1.0, offZ + 1.0, ...uv[9], 1.0,
                            offX + 1.0, y + 1.0, offZ + 1.0, ...uv[10], 1.0,
                            offX + 1.0, y + 1.0, offZ + 0.0, ...uv[11], 1.0
                        );
                        indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        offset += 4;
                    }
                    if (!isSolid[x + 1 + (z + 1) * 18 + y * 324]) {
                        vertices.push(
                            // bottom
                            offX + 0.0, y + 0.0, offZ + 0.0, ...uv[12], 0.7,
                            offX + 1.0, y + 0.0, offZ + 0.0, ...uv[13], 0.7,
                            offX + 1.0, y + 0.0, offZ + 1.0, ...uv[14], 0.7,
                            offX + 0.0, y + 0.0, offZ + 1.0, ...uv[15], 0.7
                        );
                        indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        offset += 4;
                    }
                    if (!isSolid[x + 2 + (z + 1) * 18 + (y + 1) * 324]) {
                        vertices.push(
                            // right
                            offX + 1.0, y + 0.0, offZ + 0.0, ...uv[17], 0.8,
                            offX + 1.0, y + 1.0, offZ + 0.0, ...uv[18], 0.8,
                            offX + 1.0, y + 1.0, offZ + 1.0, ...uv[19], 0.8,
                            offX + 1.0, y + 0.0, offZ + 1.0, ...uv[16], 0.8
                        );
                        indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
                        offset += 4;
                    }
                    if (!isSolid[x + (z + 1) * 18 + (y + 1) * 324]) {
                        vertices.push(
                            // left
                            offX + 0.0, y + 0.0, offZ + 0.0, ...uv[20], 0.8,
                            offX + 0.0, y + 0.0, offZ + 1.0, ...uv[21], 0.8,
                            offX + 0.0, y + 1.0, offZ + 1.0, ...uv[22], 0.8,
                            offX + 0.0, y + 1.0, offZ + 0.0, ...uv[23], 0.8
                        );
                        indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
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