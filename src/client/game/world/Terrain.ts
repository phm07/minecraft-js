import terrain from "../../assets/terrain.png";
import Mesh from "../../gl/Mesh";
import Shader from "../../gl/Shader";
import TextureArray from "../../gl/TextureArray";
import GameScene from "../../scene/GameScene";
import fragmentShader from "../../shaders/terrain.fs";
import vertexShader from "../../shaders/terrain.vs";
import Chunk from "./Chunk";
import MeshGenerator from "./MeshGenerator";
import SubChunk from "./SubChunk";
import World from "./World";

class Terrain {

    private readonly world: World;
    private readonly meshes: Record<string, Array<Mesh | undefined> | undefined>;
    private readonly meshGenerator: MeshGenerator;
    private readonly shader: Shader;
    private readonly viewMatrixUniform: WebGLUniformLocation | null;
    private readonly projectionMatrixUniform: WebGLUniformLocation | null;
    private readonly samplerUniform: WebGLUniformLocation | null;
    private readonly texture: TextureArray;

    public constructor(world: World) {

        this.world = world;
        this.meshes = {};
        this.meshGenerator = new MeshGenerator(world);
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
            this.meshes[coord]?.filter((subMesh): subMesh is Mesh => Boolean(subMesh)).forEach((subMesh) => {
                subMesh.bind();
                GL.drawElements(GL.TRIANGLES, subMesh.numIndices, GL.UNSIGNED_INT, 0);
            });
        }
    }

    public delete(): void {
        Object.values(this.meshes).flat().forEach((mesh) => mesh?.delete());
        this.shader.delete();
        this.texture.delete();
    }

    public unloadChunk(chunk: Chunk): void {

        const mesh = this.meshes[[chunk.x, chunk.z].toString()];

        if (mesh) {
            mesh.forEach((subMesh) => subMesh?.delete());
            delete this.meshes[[chunk.x, chunk.z].toString()];
        }
    }

    public async updateChunk(chunk?: Chunk): Promise<void> {
        if (chunk) {
            await Promise.all(chunk.subChunks.map(async (subChunk) => await this.updateSubChunk(subChunk)));
        }
    }

    public async updateSubChunk(subChunk: SubChunk): Promise<void> {

        await new Promise<void>((resolve) => {
            const index = [subChunk.chunk.x, subChunk.chunk.z].toString();
            const mesh = this.meshGenerator.generateSubChunkMesh(subChunk);
            this.meshes[index]?.[subChunk.level]?.delete();
            this.meshes[index] ??= new Array(8);
            this.meshes[index]?.splice(subChunk.level, 1, mesh);
            resolve();
        });
    }
}

export default Terrain;