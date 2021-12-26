import Interpolator from "../../../common/Interpolator";
import Position from "../../../common/Position";
import Util from "../../../common/Util";
import Vec3 from "../../../common/Vec3";
import Camera from "../../gl/Camera";
import AABB from "../../physics/AABB";
import GameScene from "../../scene/GameScene";
import PlayerController from "./PlayerController";

class Player {

    private readonly camera: Camera;
    private readonly controller: PlayerController;
    private readonly updateTimer: NodeJS.Timer;
    private readonly interpolator: Interpolator;
    public readonly velocity: Vec3;
    private bobTime: number;
    public position: Position;
    public onGround: boolean;

    public constructor(camera: Camera) {
        this.camera = camera;
        this.interpolator = new Interpolator({ bob: 0 });
        this.controller = new PlayerController(this);
        this.position = new Position();
        this.velocity = new Vec3();
        this.onGround = false;
        this.bobTime = 0;

        this.updateTimer = setInterval(() => {
            game.client.socket?.emit("position", {
                position: this.position,
                velocity: this.velocity,
                onGround: this.onGround
            });
        }, 50);
    }

    public delete(): void {
        clearInterval(this.updateTimer);
        this.controller.delete();
    }

    public update(delta: number): void {

        this.interpolator.update(delta);

        this.velocity.y -= delta * 25.0;
        this.velocity.y = Math.max(-25.0, this.velocity.y);
        this.velocity.x = Util.lerp(this.velocity.x, 0, delta * 25);
        this.velocity.z = Util.lerp(this.velocity.z, 0, delta * 25);
        this.controller.update();

        const oldX = this.position.x;
        const oldZ = this.position.z;

        if ((game.scene as GameScene).world.isLoaded(Math.floor(oldX / 16), Math.floor(oldZ / 16))) {
            this.updatePosition(delta);
        }

        if (Util.dist2Square(this.velocity.x, this.velocity.z, 0, 0) >= 1 && this.onGround) {
            const speed = Util.dist2(this.velocity.x, this.velocity.z, 0, 0);
            const bobAmount = Util.map(speed, 0, 3, 0, 0.05);
            this.interpolator.animate("bob", bobAmount, 0.1);
        } else {
            this.interpolator.animate("bob", 0, 0.1);
        }

        const bob = this.interpolator.getValue("bob");
        this.camera.position = Position.clone(this.position);
        this.camera.position.y += 1.7 + Math.sin(this.bobTime * 2) * Math.cos(this.position.pitch) * bob;
        this.camera.position.x += Math.cos(this.camera.position.yaw) * Math.sin(this.bobTime) * bob;
        this.camera.position.z += Math.sin(this.camera.position.yaw) * Math.sin(this.bobTime) * bob;
        this.camera.updateViewMatrix();

        this.bobTime += bob * delta * 100;

        if (Math.floor(oldX / 16) !== Math.floor(this.position.x / 16)
            || Math.floor(oldZ / 16) !== Math.floor(this.position.z / 16)) {
            (game.scene as GameScene).world.update();
        }
    }

    public isCollision(aabb: AABB, blocks: AABB[]): boolean {
        return blocks.some((block) => block.intersects(aabb));
    }

    public updatePosition(delta: number): void {

        const aabb = new AABB(this.position.x - 0.3, this.position.y, this.position.z - 0.3, 0.6, 1.8, 0.6);
        const blocks = this.getWorldCollisionBox();

        const steps = Math.ceil(delta / (1 / 120));
        const d = delta / steps;

        for (let step = 0; step < steps; step++) {
            const dx = this.velocity.x * d;
            const dy = this.velocity.y * d;
            const dz = this.velocity.z * d;

            aabb.x += dx;
            if (this.isCollision(aabb, blocks)) {
                aabb.x -= dx;
                this.velocity.x = 0;
            } else {
                this.position.x += dx;
            }

            aabb.y += dy;
            if (this.isCollision(aabb, blocks)) {
                aabb.y -= dy;
                if (dy < 0) this.onGround = true;
                this.velocity.y = 0;
            } else {
                this.position.y += dy;
                if (dy > 0) this.onGround = false;
            }

            aabb.z += dz;
            if (this.isCollision(aabb, blocks)) {
                aabb.z -= dz;
                this.velocity.z = 0;
            } else {
                this.position.z += dz;
            }
        }
    }

    public getWorldCollisionBox(): AABB[] {

        const blocks = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 2; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && z === 0 && y >= 0 && y < 2) continue;
                    const blockX = Math.floor(this.position.x + x);
                    const blockY = Math.floor(this.position.y + y);
                    const blockZ = Math.floor(this.position.z + z);

                    if ((game.scene as GameScene).world.blockAt(blockX, blockY, blockZ)) {
                        blocks.push(new AABB(blockX, blockY, blockZ, 1, 1, 1));
                    }
                }
            }
        }

        return blocks;
    }

    public teleport(position: Position): void {
        Object.assign(this.position, position);
    }
}

export default Player;