import { mat4 } from "gl-matrix";

import Position from "src/common/world/Position";

class Camera {

    public position: Position;
    public readonly projectionMatrix: mat4;
    public readonly viewMatrix: mat4;
    private readonly fov: number;
    private readonly near: number;
    private readonly far: number;

    public constructor(position: Position, fov: number, near: number, far: number) {
        this.position = position;
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.updateProjectionMatrix();
        this.updateViewMatrix();
    }

    public updateProjectionMatrix(): void {
        mat4.perspective(this.projectionMatrix, this.fov, GL.canvas.clientWidth / GL.canvas.clientHeight, this.near, this.far);
    }

    public updateViewMatrix(): void {
        mat4.identity(this.viewMatrix);
        mat4.rotate(this.viewMatrix, this.viewMatrix, this.position.pitch, [1, 0, 0]);
        mat4.rotate(this.viewMatrix, this.viewMatrix, this.position.yaw, [0, 1, 0]);
        mat4.translate(this.viewMatrix, this.viewMatrix, [-this.position.x, -this.position.y, -this.position.z]);
    }
}

export default Camera;