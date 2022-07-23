import Animator from "src/client/game/mp/Animator";
import HumanFactory from "src/client/game/mp/HumanFactory";
import Text from "src/client/game/text/Text";
import TextFactory from "src/client/game/text/TextFactory";
import Camera from "src/client/gl/Camera";
import Shader from "src/client/gl/Shader";
import Humanoid from "src/client/models/Humanoid";
import AABB from "src/client/physics/AABB";
import Vec3 from "src/common/math/Vec3";
import Util from "src/common/util/Util";
import Position from "src/common/world/Position";

class Human {

    public readonly id: string;
    public readonly name: string;
    private readonly model: Humanoid;
    private readonly animator: Animator;
    private readonly text: Text | undefined;
    public targetPosition: Position;
    public position: Position;
    public velocity: Vec3;

    public constructor(id: string, name: string, shader: Shader, textFactory: TextFactory | null) {
        this.id = id;
        this.name = name;
        this.position = new Position();
        this.targetPosition = new Position();
        this.model = new Humanoid(this.position, shader);
        this.animator = new Animator(this, this.model);
        this.velocity = new Vec3();

        if (textFactory) {
            this.text = textFactory.createText(this.name, 0.4, new Vec3());
        }
    }

    public getBoundingBox(): AABB {
        return new AABB(this.position.x - 0.3, this.position.y, this.position.z - 0.3, 0.6, 1.8, 0.6);
    }

    public delete(): void {
        this.model.delete();
        this.text?.delete();
    }

    public render(camera: Camera): void {
        this.model.render(camera);
    }

    public renderAlone(camera: Camera, humanFactory: HumanFactory): void {

        humanFactory.shader.bind();
        GL.uniform1i(humanFactory.samplerUniform, 0);
        GL.activeTexture(GL.TEXTURE0);
        humanFactory.texture.bind();

        GL.disable(GL.CULL_FACE);
        this.model.render(camera);
        GL.enable(GL.CULL_FACE);
    }

    public renderText(camera: Camera): void {
        this.text?.render(camera);
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

        if (this.text) {
            this.text.position = new Vec3(this.position.x, this.position.y + 2.1, this.position.z);
            this.text.update();
        }
    }
}

export default Human;