import PlayerPosition from "../../common/PlayerPosition";
import Util from "../../common/Util";
import Vec3 from "../../common/Vec3";
import Shader from "../gl/Shader";
import Texture from "../gl/Texture";
import Humanoid from "../models/Humanoid";
import AnimationManager from "./AnimationManager";

class Human {

    public readonly id: number;
    public readonly model: Humanoid;
    public velocity: Vec3;
    private readonly animationManager: AnimationManager;
    private targetPosition: PlayerPosition;
    private targetBodyYaw: number;

    public constructor(id: number, shader: Shader, texture: Texture, position: PlayerPosition) {
        this.id = id;
        this.targetPosition = PlayerPosition.clone(position);
        this.model = new Humanoid(shader, texture, position);
        this.animationManager = new AnimationManager(this);
        this.velocity = new Vec3();
        this.targetBodyYaw = 0;
    }

    public setPosition(position: PlayerPosition, velocity: Vec3): void {

        this.velocity = velocity;
        this.animationManager.setWalking(velocity.y >= -10 && Util.distSquare(velocity.x, velocity.z, 0, 0) > 10e-4);

        this.targetPosition = position;
        this.targetBodyYaw = position.yaw;
    }

    public delete(): void {
        this.model.delete();
    }

    public render(): void {
        this.model.render();
    }

    public update(delta: number): void {

        const mix = delta * 25;
        this.model.position.x = Util.lerp(this.model.position.x, this.targetPosition.x, mix);
        this.model.position.y = Util.lerp(this.model.position.y, this.targetPosition.y, mix);
        this.model.position.z = Util.lerp(this.model.position.z, this.targetPosition.z, mix);
        this.model.position.yaw = Util.lerp(this.model.position.yaw, this.targetPosition.yaw, mix);
        this.model.position.pitch = Util.lerp(this.model.position.pitch, this.targetPosition.pitch, mix);
        this.model.bodyYaw = Util.lerp(this.model.bodyYaw, this.targetBodyYaw, mix);
        this.animationManager.update(delta);
        this.model.update();
    }
}

export default Human;