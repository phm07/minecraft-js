import AABB from "../physics/aabb";
import PlayerController from "./player_controller";
import OutlineCuboid from "../models/outline_cuboid";
import outlineVertexShader from "../shaders/outline.vs";
import outlineFragmentShader from "../shaders/outline.fs";
import Shader from "../gl/shader";
import { mat4 } from "gl-matrix";

const DEBUG = false;

class Player {

    constructor(camera) {
        this.camera = camera;
        this.controller = new PlayerController(this);
        this.position = {x: 0, y: 0, z: 0, yaw: 0, pitch: 0};
        this.velocity = {x: 0, y: 0, z: 0};
        this.onGround = false;

        if(DEBUG) {
            this.outlineShader = new Shader(outlineVertexShader, outlineFragmentShader);
            this.modelMatrixUniform = this.outlineShader.getUniform("uModelMatrix", "Matrix4fv");
            this.viewMatrixUniform = this.outlineShader.getUniform("uViewMatrix", "Matrix4fv");
            this.projectionMatrixUniform = this.outlineShader.getUniform("uProjMatrix", "Matrix4fv");
            this.playerAABB = new OutlineCuboid();
        }

        this.updateTimer = setInterval(() => {
            game.client.socket.emit("position", {
                position: this.position
            });
        }, 50);
    }

    render() {

        if(!DEBUG) return;

        this.outlineShader.bind();

        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [this.position.x-0.3, this.position.y, this.position.z-0.3]);
        mat4.scale(modelMatrix, modelMatrix, [0.6, 1.8, 0.6]);

        this.modelMatrixUniform.set(modelMatrix);
        this.viewMatrixUniform.set(this.camera.viewMatrix);
        this.projectionMatrixUniform.set(this.camera.projectionMatrix);

        this.playerAABB.bind();
        GL.disable(GL.DEPTH_TEST);
        GL.drawElements(GL.LINES, this.playerAABB.indices.length, GL.UNSIGNED_INT, 0);
        
        for(let block of this.getWorldAABB()) {
            const mm = mat4.create();
            mat4.translate(mm, mm, [block.x, block.y, block.z]);
            this.modelMatrixUniform.set(mm);
            GL.drawElements(GL.LINES, this.playerAABB.indices.length, GL.UNSIGNED_INT, 0);
        }
        GL.enable(GL.DEPTH_TEST);

    }

    delete() {
        clearInterval(this.updateTimer);
        document.exitPointerLock();
    }

    update(delta) {

        this.controller.update(delta);
        this.velocity.y -= delta * 25.0;
        this.velocity.y = Math.max(-25.0, this.velocity.y);

        const oldX = this.position.x;
        const oldZ = this.position.z;

        this.updatePosition(delta);

        this.camera.x = this.position.x;
        this.camera.y = this.position.y+1.7;
        this.camera.z = this.position.z;
        this.camera.yaw = this.position.yaw;
        this.camera.pitch = this.position.pitch;
        this.camera.updateViewMatrix();

        if(Math.floor(oldX/16) !== Math.floor(this.position.x/16)
            || Math.floor(oldZ/16) !== Math.floor(this.position.z/16)) {
            game.scene.world.update();
        }
    }

    isCollision(aabb, blocks) {
        for(let block of blocks) {
            if(block.intersects(aabb)) return true;
        }
        return false;
    }

    updatePosition(delta) {

        const aabb = new AABB(this.position.x-0.3, this.position.y, this.position.z-0.3, 0.6, 1.8, 0.6);
        const blocks = this.getWorldAABB();

        const steps = Math.ceil(delta/(1/120));
        const d = delta/steps;

        for(let step = 0; step < steps; step++) {
            const dx = this.velocity.x * d;
            const dy = this.velocity.y * d;
            const dz = this.velocity.z * d;

            aabb.x += dx;
            if(this.isCollision(aabb, blocks)) {
                aabb.x -= dx;
                this.velocity.x = 0;
            } else {
                this.position.x += dx;
            }
            
            aabb.y += dy;
            if(this.isCollision(aabb, blocks)) {
                aabb.y -= dy;
                if(dy < 0) this.onGround = true;
                this.velocity.y = 0;
            } else {
                this.position.y += dy;
                if(dy > 0) this.onGround = false;
            }

            aabb.z += dz;
            if(this.isCollision(aabb, blocks)) {
                aabb.z -= dz;
                this.velocity.z = 0;
            } else {
                this.position.z += dz;
            }
        }
    }

    getWorldAABB() {

        const blocks = [];
        for(let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 2; y++) {
                for(let z = -1; z <= 1; z++) {
                    if(x === 0 && z === 0 && y >= 0 && y < 2) continue;
                    const blockX = Math.floor(this.position.x+x);
                    const blockY = Math.floor(this.position.y+y);
                    const blockZ = Math.floor(this.position.z+z);

                    if(game.scene.world.blockAt(blockX, blockY, blockZ)) {
                        blocks.push(new AABB(blockX, blockY, blockZ, 1, 1, 1));
                    }
                }
            }
        }

        return blocks;
    }

    teleport(position) {
        this.position = {
            ...this.position,
            ...position
        };
    }
}

export default Player;