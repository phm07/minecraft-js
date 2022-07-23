import terrain from "src/client/assets/terrain.png";
import MeshGenerator from "src/client/game/world/MeshGenerator";
import Camera from "src/client/gl/Camera";
import Mesh from "src/client/gl/Mesh";
import Shader from "src/client/gl/Shader";
import TextureArray from "src/client/gl/TextureArray";
import fragmentShader from "src/client/shaders/terrain.fs";
import vertexShader from "src/client/shaders/terrain.vs";
import Chunk from "src/common/world/Chunk";
import SubChunk from "src/common/world/SubChunk";
import World from "src/common/world/World";

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

    public render(camera: Camera): void {

        this.shader.bind();
        GL.uniformMatrix4fv(this.viewMatrixUniform, false, camera.viewMatrix);
        GL.uniformMatrix4fv(this.projectionMatrixUniform, false, camera.projectionMatrix);
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