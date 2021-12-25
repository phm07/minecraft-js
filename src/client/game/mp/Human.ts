import PlayerPosition from "../../../common/PlayerPosition";
import Util from "../../../common/Util";
import Vec3 from "../../../common/Vec3";
import Shader from "../../gl/Shader";
import Humanoid from "../../models/Humanoid";
import GameScene from "../../scene/GameScene";
import fragmentShader from "../../shaders/human.fs";
import vertexShader from "../../shaders/human.vs";
import Text from "../text/Text";
import Animator from "./Animator";

class Human {

    declare public static HUMAN_SHADER: Shader;
    declare public static HUMAN_SAMPLER: WebGLUniformLocation | null;

    public readonly id: number;
    public position: PlayerPosition;
    public velocity: Vec3;
    private readonly model: Humanoid;
    private readonly animator: Animator;
    private readonly text: Text;
    private targetPosition: PlayerPosition;

    public constructor(id: number, name: string, position: PlayerPosition) {
        this.id = id;
        this.position = PlayerPosition.clone(position);
        this.targetPosition = PlayerPosition.clone(position);
        this.model = new Humanoid(position, Human.HUMAN_SHADER);
        this.animator = new Animator(this, this.model);
        this.velocity = new Vec3();
        this.text = new Text(name, (game.scene as GameScene).font, 0.4, new Vec3());
    }

    public static init(): void {
        if (!Human.HUMAN_SHADER) {
            Human.HUMAN_SHADER = new Shader(vertexShader, fragmentShader);
            Human.HUMAN_SAMPLER = Human.HUMAN_SHADER.getUniformLocation("uTexture");
        }
    }

    public setPosition(position: PlayerPosition, velocity: Vec3): void {
        this.velocity = velocity;
        this.targetPosition = position;
    }

    public delete(): void {
        this.model.delete();
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