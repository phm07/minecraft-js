import { mat4 } from "gl-matrix"

class Camera {

    constructor(x, y, z, yaw, pitch, fov, near, far) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.yaw = yaw;
        this.pitch = pitch;
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
        this.updateViewMatrix();
    }

    updateProjectionMatrix() {
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, this.fov, GL.canvas.clientWidth/GL.canvas.clientHeight, this.near, this.far);
    }

    updateViewMatrix() {
        this.viewMatrix = mat4.create();
        mat4.rotate(this.viewMatrix, this.viewMatrix, this.pitch, [1, 0, 0]);
        mat4.rotate(this.viewMatrix, this.viewMatrix, this.yaw, [0, 1, 0]);
        mat4.translate(this.viewMatrix, this.viewMatrix, [-this.x, -this.y, -this.z]);
    }
}

export default Camera;