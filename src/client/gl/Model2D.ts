import { mat4, quat } from "gl-matrix";

import Vec2 from "../../common/Vec2";
import Mesh from "./Mesh";
import Shader from "./Shader";

class Model2D {

    private readonly shader: Shader;
    private readonly mesh: Mesh;
    private readonly modelMatrix: mat4;
    private readonly modelMatrixUniform: WebGLUniformLocation | null;
    private readonly projectionMatrixUniform: WebGLUniformLocation | null;
    public position: Vec2;
    public scale: Vec2;

    public constructor(shader: Shader, mesh: Mesh, position = new Vec2(), scale = new Vec2(1)) {

        this.shader = shader;
        this.mesh = mesh;
        this.position = position;
        this.scale = scale;

        this.modelMatrix = mat4.create();

        this.modelMatrixUniform = shader.getUniformLocation("uModelMatrix");
        this.projectionMatrixUniform = shader.getUniformLocation("uProjMatrix");

        this.update();
    }

    public bind(): void {
        this.mesh.bind();
    }

    public delete(): void {
        this.mesh.delete();
    }

    public update(): void {

        mat4.fromRotationTranslationScale(
            this.modelMatrix,
            quat.create(),
            [this.position.x, this.position.y, 0],
            [this.scale.x, this.scale.y, 1]
        );
    }

    public render(): void {

        this.bind();
        GL.uniformMatrix4fv(this.modelMatrixUniform, false, this.modelMatrix);
        GL.uniformMatrix4fv(this.projectionMatrixUniform, false, game.guiManager.projectionMatrix);
        GL.drawElements(GL.TRIANGLES, this.mesh.numIndices, GL.UNSIGNED_INT, 0);
    }
}

export default Model2D;