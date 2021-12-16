import Block from "./block";
import Mesh from "../gl/mesh";
import Shader from "../gl/shader";
import TextureArray from "../gl/texture_array";
import vertexShader from "../shaders/terrain.vs";
import fragmentShader from "../shaders/terrain.fs";
import terrain from "../assets/terrain.png";

class Terrain {

    constructor(world) {
        this.world = world;
        this.meshes = {};
        this.shader = new Shader(vertexShader, fragmentShader);
        this.viewMatrixUniform = this.shader.getUniform("uViewMatrix", "Matrix4fv");
        this.projectionMatrixUniform = this.shader.getUniform("uProjMatrix", "Matrix4fv");
        this.samplerUniform = this.shader.getUniform("uTexture", "1i");
        this.texture = new TextureArray(terrain, 16, 16);
    }

    render() {

        this.shader.bind();
        this.viewMatrixUniform.set(game.scene.camera.viewMatrix);
        this.projectionMatrixUniform.set(game.scene.camera.projectionMatrix);
        this.samplerUniform.set(0);

        GL.activeTexture(GL.TEXTURE0);
        this.texture.bind();

        for(let coord in this.meshes) {
            const mesh = this.meshes[coord];
            mesh.bind();
            GL.drawElements(GL.TRIANGLES, mesh.indices.length, GL.UNSIGNED_INT, 0);
        }
    }

    unloadChunk(chunk) {

        const mesh = this.meshes[[chunk.x, chunk.z]];
        if(mesh) {
            mesh.delete();
            delete this.meshes[[chunk.x, chunk.z]];
        }
    }

    updateChunk(chunk) {

        const left = this.world.chunkMap[[chunk.x-1, chunk.z]];
        const right = this.world.chunkMap[[chunk.x+1, chunk.z]];
        const back = this.world.chunkMap[[chunk.x, chunk.z-1]];
        const front = this.world.chunkMap[[chunk.x, chunk.z+1]];

        const isSolid = new Uint8Array((18)*(130)*(18));

        for(let x = -1; x <= 16; x++) {
            for(let z = -1; z <= 16; z++) {
                if((x < 0 || x > 15) && (z < 0 || z > 15)) continue;
                for(let y = -1; y <= 128; y++) {
                    let solid;
                    if(y < 0 || y >= 128) {
                        solid = 0;
                    } else if(x >= 0 && x < 16 && z >= 0 && z < 16) {
                        solid = !!chunk.blockAt(x, y, z);
                    } else if(x < 0) {
                        solid = !!left?.blockAt(x+16, y, z);
                    } else if(x >= 16) {
                        solid = !!right?.blockAt(x-16, y, z);
                    } else if(z < 0) {
                        solid = !!back?.blockAt(x, y, z+16);
                    } else if(z >= 16) {
                        solid = !!front?.blockAt(x, y, z-16);
                    }
                    isSolid[(x+1) + (z+1) * 18 + (y+1) * 324] = solid;
                }
            }
        }

        const vertices = [], indices = [];

        if(!chunk) return;

        let offset = 0;
        for(let x = 0; x < 16; x++) {
            for(let y = 0; y < 128; y++) {
                for(let z = 0; z < 16; z++) {
                    
                    const id = chunk.blockAt(x, y, z);
                    const uv = Block.ofId(id)?.uvs;
                    if(!uv) continue;

                    const offX = chunk.x*16+x;
                    const offZ = chunk.z*16+z;

                    if(!isSolid[(x+1) + (z+2) * 18 + (y+1) * 324]) {
                        vertices.push(
                            // front
                            offX+0.0, y+1.0, offZ+1.0, ...uv[3], 0.9,
                            offX+0.0, y+0.0, offZ+1.0, ...uv[0], 0.9,
                            offX+1.0, y+0.0, offZ+1.0, ...uv[1], 0.9,
                            offX+1.0, y+1.0, offZ+1.0, ...uv[2], 0.9,
                        );
                        indices.push(offset, offset+1, offset+2, offset, offset+2, offset+3);
                        offset += 4;
                    }
                    if(!isSolid[(x+1) + (z) * 18 + (y+1) * 324]) {
                        vertices.push(
                            // back
                            offX+0.0, y+0.0, offZ+0.0, ...uv[5], 0.9,
                            offX+0.0, y+1.0, offZ+0.0, ...uv[6], 0.9,
                            offX+1.0, y+1.0, offZ+0.0, ...uv[7], 0.9,
                            offX+1.0, y+0.0, offZ+0.0, ...uv[4], 0.9,
                        );
                        indices.push(offset, offset+1, offset+2, offset, offset+2, offset+3);
                        offset += 4;
                    }
                    if(!isSolid[(x+1) + (z+1) * 18 + (y+2) * 324]) {
                        vertices.push(
                            // top
                            offX+0.0, y+1.0, offZ+0.0, ...uv[8], 1.0,
                            offX+0.0, y+1.0, offZ+1.0, ...uv[9], 1.0,
                            offX+1.0, y+1.0, offZ+1.0, ...uv[10], 1.0,
                            offX+1.0, y+1.0, offZ+0.0, ...uv[11], 1.0,
                        );
                        indices.push(offset, offset+1, offset+2, offset, offset+2, offset+3);
                        offset += 4;
                    }
                    if(!isSolid[(x+1) + (z+1) * 18 + (y) * 324]) {
                        vertices.push(
                            // bottom
                            offX+0.0, y+0.0, offZ+0.0, ...uv[12], 0.7,
                            offX+1.0, y+0.0, offZ+0.0, ...uv[13], 0.7,
                            offX+1.0, y+0.0, offZ+1.0, ...uv[14], 0.7,
                            offX+0.0, y+0.0, offZ+1.0, ...uv[15], 0.7,
                        );
                        indices.push(offset, offset+1, offset+2, offset, offset+2, offset+3);
                        offset += 4;
                    }
                    if(!isSolid[(x+2) + (z+1) * 18 + (y+1) * 324]) {
                        vertices.push(
                            // right
                            offX+1.0, y+0.0, offZ+0.0, ...uv[17], 0.8,
                            offX+1.0, y+1.0, offZ+0.0, ...uv[18], 0.8,
                            offX+1.0, y+1.0, offZ+1.0, ...uv[19], 0.8,
                            offX+1.0, y+0.0, offZ+1.0, ...uv[16], 0.8,
                        );
                        indices.push(offset, offset+1, offset+2, offset, offset+2, offset+3);
                        offset += 4;
                    }
                    if(!isSolid[(x) + (z+1) * 18 + (y+1) * 324]) {
                        vertices.push(
                            // left
                            offX+0.0, y+0.0, offZ+0.0, ...uv[20], 0.8,
                            offX+0.0, y+0.0, offZ+1.0, ...uv[21], 0.8,
                            offX+0.0, y+1.0, offZ+1.0, ...uv[22], 0.8,
                            offX+0.0, y+1.0, offZ+0.0, ...uv[23], 0.8
                        );
                        indices.push(offset, offset+1, offset+2, offset, offset+2, offset+3);
                        offset += 4;
                    }
                }
            }
        }

        const mesh = new Mesh(vertices, [3, 3, 1], indices);
        const current = this.meshes[[chunk.x, chunk.z]];
        if(current) current.delete();
        this.meshes[[chunk.x, chunk.z]] = mesh;
    }

}

export default Terrain;