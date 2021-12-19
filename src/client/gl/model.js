import { mat4, quat } from "gl-matrix";

class Model {

    constructor(shader, mesh, position=[0,0,0], rotation=[0,0,0], scale=[1,1,1], origin=[0,0,0]) {
       
        this.shader = shader;
        this.mesh = mesh;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.origin = origin;
        this.modelMatrixUniform = shader.getUniform("uModelMatrix", "Matrix4fv");
        this.viewMatrixUniform = shader.getUniform("uViewMatrix", "Matrix4fv");
        this.projectionMatrixUniform = shader.getUniform("uProjMatrix", "Matrix4fv");
        
        this.update();
    }

    bind() {
        this.mesh.bind();
    }

    delete() {
        this.mesh.delete();
    }

    update() {

        const rotationQuat = quat.create();
        quat.fromEuler(rotationQuat, ...this.rotation);

        this.modelMatrix = mat4.create();
        mat4.fromRotationTranslationScaleOrigin(
            this.modelMatrix,
            rotationQuat,
            this.position,
            this.scale,
            this.origin
        );
    }

    render() {
        this.bind();

        this.modelMatrixUniform.set(this.modelMatrix);
        this.viewMatrixUniform.set(game.scene.camera.viewMatrix);
        this.projectionMatrixUniform.set(game.scene.camera.projectionMatrix);
        
        GL.drawElements(GL.TRIANGLES, this.mesh.indices.length, GL.UNSIGNED_INT, 0);
    }
}

export default Model;