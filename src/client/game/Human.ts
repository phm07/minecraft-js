import PlayerPosition from "../../common/PlayerPosition";
import Shader from "../gl/Shader";
import Texture from "../gl/Texture";
import Humanoid from "../models/Humanoid";

class Human {

    public readonly id: number;
    private readonly position: PlayerPosition;
    private readonly model: Humanoid;
    private targetPosition: PlayerPosition;
    private targetBodyYaw: number;

    public constructor(id: number, shader: Shader, texture: Texture, position: PlayerPosition) {
        this.id = id;
        this.position = position;
        this.targetPosition = PlayerPosition.clone(position);
        this.model = new Humanoid(shader, texture, position);
        this.targetBodyYaw = 0;
    }

    public setPosition(position: PlayerPosition): void {
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
        const dt = Math.min(1, delta * 25);
        this.position.x += (this.targetPosition.x - this.position.x) * dt;
        this.position.y += (this.targetPosition.y - this.position.y) * dt;
        this.position.z += (this.targetPosition.z - this.position.z) * dt;
        this.position.yaw += (this.targetPosition.yaw - this.position.yaw) * dt;
        this.position.pitch += (this.targetPosition.pitch - this.position.pitch) * dt;
        this.model.position = this.position;
        this.model.bodyYaw += (this.targetBodyYaw - this.model.bodyYaw) * dt;
        this.model.update();
    }
}

export default Human;