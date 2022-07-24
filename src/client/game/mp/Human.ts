import Animator from "client/game/mp/Animator";
import HumanFactory from "client/game/mp/HumanFactory";
import Text from "client/game/text/Text";
import TextFactory from "client/game/text/TextFactory";
import Camera from "client/gl/Camera";
import Shader from "client/gl/Shader";
import Texture from "client/gl/Texture";
import Humanoid from "client/models/Humanoid";
import AABB from "client/physics/AABB";
import ImageUtils from "client/util/ImageUtils";
import MathUtils from "common/math/MathUtils";
import Vec3 from "common/math/Vec3";
import Position from "common/world/Position";

class Human {

    public readonly id: string;
    public readonly name: string;
    public readonly skin: string | null;
    private readonly model: Humanoid;
    private readonly animator: Animator;
    private readonly text: Text | undefined;
    public skinTexture: Texture | null;
    public targetPosition: Position;
    public position: Position;
    public velocity: Vec3;

    public constructor(id: string, name: string, skin: string | null, shader: Shader, textFactory: TextFactory | null) {
        this.id = id;
        this.name = name;
        this.skin = skin;
        this.position = new Position();
        this.targetPosition = new Position();
        this.model = new Humanoid(this.position, shader);
        this.animator = new Animator(this, this.model);
        this.velocity = new Vec3();
        this.skinTexture = null;

        if (textFactory) {
            this.text = textFactory.createText(this.name, 0.4, new Vec3());
        }

        if (skin) {
            void this.loadSkin(skin);
        }
    }

    public getBoundingBox(): AABB {
        return new AABB(this.position.x - 0.3, this.position.y, this.position.z - 0.3, 0.6, 1.8, 0.6);
    }

    public delete(): void {
        this.model.delete();
        this.text?.delete();
        this.skinTexture?.delete();
    }

    public render(camera: Camera): void {
        this.model.render(camera);
    }

    public renderAlone(camera: Camera, humanFactory: HumanFactory): void {

        humanFactory.shader.bind();
        GL.uniform1i(humanFactory.samplerUniform, 0);
        GL.activeTexture(GL.TEXTURE0);
        (this.skinTexture ?? humanFactory.defaultSkin).bind();

        GL.disable(GL.CULL_FACE);
        this.model.render(camera);
        GL.enable(GL.CULL_FACE);
    }

    public renderText(camera: Camera): void {
        this.text?.render(camera);
    }

    public update(delta: number): void {

        const mix = delta * 25;
        this.position.x = MathUtils.lerp(this.position.x, this.targetPosition.x, mix);
        this.position.y = MathUtils.lerp(this.position.y, this.targetPosition.y, mix);
        this.position.z = MathUtils.lerp(this.position.z, this.targetPosition.z, mix);
        this.position.yaw = MathUtils.lerp(this.position.yaw, this.targetPosition.yaw, mix);
        this.position.pitch = MathUtils.lerp(this.position.pitch, this.targetPosition.pitch, mix);
        this.animator.update(delta);
        this.model.position = this.position;
        this.model.update();

        if (this.text) {
            this.text.position = new Vec3(this.position.x, this.position.y + 2.1, this.position.z);
            this.text.update();
        }
    }

    private async loadSkin(skin: string): Promise<void> {
        this.skinTexture = new Texture(await ImageUtils.fromSource(skin));
    }
}

export default Human;