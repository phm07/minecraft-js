import { mat4, quat } from "gl-matrix";

import Camera from "src/client/gl/Camera";
import Mesh from "src/client/gl/Mesh";
import Shader from "src/client/gl/Shader";
import Vec3 from "src/common/math/Vec3";

class Model {

    public readonly shader: Shader;
    private readonly mesh: Mesh;
    public readonly modelMatrix: mat4;
    private readonly modelMatrixUniform: WebGLUniformLocation | null;
    private readonly viewMatrixUniform: WebGLUniformLocation | null;
    private readonly projectionMatrixUniform: WebGLUniformLocation | null;
    public position: Vec3;
    public rotation: Vec3;
    public scale: Vec3;
    public origin: Vec3;

    public constructor(shader: Shader, mesh: Mesh, position = new Vec3(), rotation = new Vec3, scale = new Vec3(1), origin = new Vec3()) {
        this.shader = shader;
        this.mesh = mesh;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.origin = origin;

        this.modelMatrix = mat4.create();

        this.modelMatrixUniform = shader.getUniformLocation("uModelMatrix");
        this.viewMatrixUniform = shader.getUniformLocation("uViewMatrix");
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

        const rotationQuat = quat.create();
        quat.fromEuler(rotationQuat, this.rotation.x * (180 / Math.PI), this.rotation.y * (180 / Math.PI), this.rotation.z * (180 / Math.PI));

        mat4.fromRotationTranslationScaleOrigin(
            this.modelMatrix,
            rotationQuat,
            [this.position.x, this.position.y, this.position.z],
            [this.scale.x, this.scale.y, this.scale.z],
            [this.origin.x, this.origin.y, this.origin.z]
        );
    }

    public render(camera: Camera): void {

        console.log(this);

        GL.uniformMatrix4fv(this.modelMatrixUniform, false, this.modelMatrix);
        GL.uniformMatrix4fv(this.viewMatrixUniform, false, camera.viewMatrix);
        GL.uniformMatrix4fv(this.projectionMatrixUniform, false, camera.projectionMatrix);
        this.mesh.render();
    }
}

export default Model;