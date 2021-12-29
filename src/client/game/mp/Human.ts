import Position from "../../../common/Position";
import Util from "../../../common/Util";
import Vec3 from "../../../common/Vec3";
import Humanoid from "../../models/Humanoid";
import AABB from "../../physics/AABB";
import Text from "../text/Text";
import Animator from "./Animator";
import HumanFactory from "./HumanFactory";

class Human {

    private readonly factory: HumanFactory;
    private readonly model: Humanoid;
    private readonly animator: Animator;
    private readonly text: Text;
    private targetPosition: Position;
    public readonly id: number;
    public position: Position;
    public velocity: Vec3;

    public constructor(factory: HumanFactory, id: number, name: string, position: Position) {
        this.factory = factory;
        this.id = id;
        this.position = Position.clone(position);
        this.targetPosition = Position.clone(position);
        this.model = new Humanoid(position, factory.shader);
        this.animator = new Animator(this, this.model);
        this.velocity = new Vec3();
        this.text = factory.textFactory.createText(name, 0.4, new Vec3());
    }

    public getBoundingBox(): AABB {
        return new AABB(this.position.x - 0.3, this.position.y, this.position.z - 0.3, 0.6, 1.8, 0.6);
    }

    public setPosition(position: Position, velocity: Vec3): void {
        this.velocity = velocity;
        this.targetPosition = position;
    }

    public delete(): void {
        this.model.delete();
        this.text.delete();
    }

    public render(): void {
        this.model.render();
    }

    public renderText(): void {
        this.text.render();
    }

    public update(delta: number): void {

        const mix = delta * 25;
        this.position.x = Util.lerp(this.position.x, this.targetPosition.x, mix);
        this.position.y = Util.lerp(this.position.y, this.targetPosition.y, mix);
        this.position.z = Util.lerp(this.position.z, this.targetPosition.z, mix);
        this.position.yaw = Util.lerp(this.position.yaw, this.targetPosition.yaw, mix);
        this.position.pitch = Util.lerp(this.position.pitch, this.targetPosition.pitch, mix);
        this.animator.update(delta);
        this.model.position = this.position;
        this.model.update();

        this.text.position = new Vec3(this.position.x, this.position.y + 2.1, this.position.z);
        this.text.update();
    }
}

export default Human;