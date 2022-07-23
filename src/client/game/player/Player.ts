import Human from "client/game/mp/Human";
import PlayerController from "client/game/player/PlayerController";
import ViewMode from "client/game/player/ViewMode";
import Block from "client/game/world/Block";
import BlockFace from "client/game/world/BlockFace";
import Camera from "client/gl/Camera";
import Model from "client/gl/Model";
import Shader from "client/gl/Shader";
import Texture from "client/gl/Texture";
import WireframeCuboid from "client/models/WireframeCuboid";
import AABB from "client/physics/AABB";
import GameScene from "client/scene/GameScene";
import ImageUtils from "client/util/ImageUtils";
import Interpolator from "common/math/Interpolator";
import MathUtils from "common/math/MathUtils";
import Vec3 from "common/math/Vec3";
import Material from "common/world/Material";
import Position from "common/world/Position";

type TargetBlock = { position: Vec3, face: BlockFace } | null;

class Player {

    private readonly camera: Camera;
    private readonly controller: PlayerController;
    private readonly updateTimer: NodeJS.Timer;
    private readonly interpolator: Interpolator;
    private readonly wireframe: Model;
    public readonly velocity: Vec3;
    public readonly playerModel: Human;
    private bobTime: number;
    private accumulator: number;
    private headPosition: Position;
    public position: Position;
    public onGround: boolean;
    public targetedBlock: TargetBlock;
    public viewMode: ViewMode;

    public constructor(id: string, skin: string | null, camera: Camera, wireframeShader: Shader, humanShader: Shader) {
        this.camera = camera;
        this.interpolator = new Interpolator({ bob: 0 });
        this.controller = new PlayerController(this);
        this.position = new Position();
        this.headPosition = new Position();
        this.velocity = new Vec3();
        this.wireframe = new Model(wireframeShader, new WireframeCuboid(new Vec3(-0.001), new Vec3(1.002)));
        this.onGround = false;
        this.bobTime = 0;
        this.targetedBlock = null;
        this.accumulator = 0;
        this.viewMode = ViewMode.FIRST_PERSON;
        this.playerModel = new Human(id, "", null, humanShader, null);

        if (skin) {
            void this.loadSkin(skin);
        }

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
        this.wireframe.delete();
    }

    public update(delta: number): void {

        this.interpolator.update(delta);

        this.velocity.x = MathUtils.lerp(this.velocity.x, 0, delta * 25);
        this.velocity.z = MathUtils.lerp(this.velocity.z, 0, delta * 25);
        this.controller.update();

        const oldX = this.position.x;
        const oldZ = this.position.z;

        if ((game.scene as GameScene).world.isLoaded(oldX >> 4, oldZ >> 4)) {
            this.stepPhysics(delta);
        }

        this.camera.position = Position.clone(this.position);
        this.camera.position.y += 1.7;
        this.headPosition = Position.clone(this.camera.position);

        this.playerModel.position = Position.clone(this.position);
        this.playerModel.targetPosition = Position.clone(this.position);
        this.playerModel.velocity = Vec3.clone(this.velocity);
        this.playerModel.update(delta);

        if (this.viewMode === ViewMode.FIRST_PERSON) {
            if (MathUtils.dist2Square(this.velocity.x, this.velocity.z, 0, 0) >= 1 && this.onGround) {
                const speed = MathUtils.dist2(this.velocity.x, this.velocity.z, 0, 0);
                const bobAmount = MathUtils.map(speed, 0, 3, 0, 0.05);
                this.interpolator.animate("bob", bobAmount, 0.1);
            } else {
                this.interpolator.animate("bob", 0, 0.1);
            }

            const bob = this.interpolator.getValue("bob");
            this.camera.position.y += Math.sin(this.bobTime * 2) * Math.cos(this.position.pitch) * bob;
            this.camera.position.x += Math.cos(this.camera.position.yaw) * Math.sin(this.bobTime) * bob;
            this.camera.position.z += Math.sin(this.camera.position.yaw) * Math.sin(this.bobTime) * bob;

            this.bobTime += bob * delta * 100;

        } else {

            const raycastPosition = Position.clone(this.headPosition);
            if (this.viewMode === ViewMode.THIRD_PERSON_BACK) {
                raycastPosition.yaw += Math.PI;
                raycastPosition.pitch *= -1;
            }

            const range = Math.max(0.3, Player.findRange(raycastPosition, 3, 0.5))
                * (this.viewMode === ViewMode.THIRD_PERSON_FRONT ? -1 : 1);

            this.camera.position.y += Math.sin(this.position.pitch) * range;
            this.camera.position.x += Math.cos(this.position.pitch) * Math.sin(Math.PI * 2 - this.camera.position.yaw) * range;
            this.camera.position.z += Math.cos(this.position.pitch) * Math.cos(Math.PI * 2 - this.camera.position.yaw) * range;

            if (this.viewMode === ViewMode.THIRD_PERSON_FRONT) {
                this.camera.position.yaw += Math.PI;
                this.camera.position.pitch *= -1;
            }
        }

        this.camera.updateViewMatrix();

        if (oldX >> 4 !== this.position.x >> 4
            || oldZ >> 4 !== this.position.z >> 4) {
            (game.scene as GameScene).world.update();
        }

        this.targetedBlock = this.findTargetedBlock();
        if (this.targetedBlock) {
            this.wireframe.position = this.targetedBlock.position;
            this.wireframe.update();
        }
    }

    public render(camera: Camera): void {
        if (this.targetedBlock) {
            this.wireframe.shader.bind();
            this.wireframe.render(camera);
        }

        if (this.viewMode !== ViewMode.FIRST_PERSON) {
            this.playerModel.renderAlone(camera, (game.scene as GameScene).humanFactory);
        }
    }

    public placeBlock(): void {
        if (!this.targetedBlock) return;
        const world = (game.scene as GameScene).world;
        const pos = Vec3.add(this.targetedBlock.position, this.targetedBlock.face.dir);
        if (world.isPlaceable(pos.x, pos.y, pos.z)) {
            void world.setBlock(pos.x, pos.y, pos.z, Material.DIRT);
            game.client.socket?.emit("blockUpdate", { position: pos, type: Material.DIRT });
        }
    }

    public breakBlock(): void {
        if (!this.targetedBlock) return;
        const world = (game.scene as GameScene).world;
        const { x, y, z } = this.targetedBlock.position;
        if (Block.ofId(world.blockAt(x, y, z))?.breakable) {
            void world.setBlock(x, y, z, 0);
            game.client.socket?.emit("blockUpdate", { position: { x, y, z }, type: 0 });
        }
    }

    public getBoundingBox(): AABB {
        return new AABB(this.position.x - 0.3, this.position.y, this.position.z - 0.3, 0.6, 1.8, 0.6);
    }

    private isCollision(aabb: AABB, blocks: AABB[]): boolean {
        return blocks.some((block) => block.intersects(aabb));
    }

    private stepPhysics(delta: number): void {

        const step = 1 / 500;
        const aabb = this.getBoundingBox();
        let blocks = this.getWorldCollisionBox();

        for (this.accumulator += delta; this.accumulator > step; this.accumulator -= step) {

            this.velocity.y = Math.max(-25, this.velocity.y - step * 25);

            const dx = this.velocity.x * step;
            const dy = this.velocity.y * step;
            const dz = this.velocity.z * step;

            if (Math.floor(this.position.x) !== Math.floor(this.position.x - dx)
                || Math.floor(this.position.y) !== Math.floor(this.position.y - dy)
                || Math.floor(this.position.z) !== Math.floor(this.position.z - dz)) {

                blocks = this.getWorldCollisionBox();
            }

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
                if (Math.abs(dy) > 10e-9) this.onGround = false;
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

    private getWorldCollisionBox(): AABB[] {

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

    private findTargetedBlock(): TargetBlock {

        const range = 5;
        const raycast = (game.scene as GameScene).world.raycastBlock(this.headPosition, range);

        if (raycast) {
            return { position: raycast.blockPos, face: BlockFace.getNearestFace(raycast.probePos) };
        } else return null;
    }

    private static findRange(position: Position, maxDistance: number, padding: number): number {
        const raycast = (game.scene as GameScene).world.raycastBlock(position, maxDistance);
        return raycast ? Vec3.distance(raycast.probePos, new Vec3(position.x, position.y, position.z)) - padding : maxDistance;
    }

    private async loadSkin(skin: string): Promise<void> {
        this.playerModel.skin = new Texture(await ImageUtils.fromSource(skin));
    }
}

export default Player;