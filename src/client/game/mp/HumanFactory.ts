import skin from "src/client/assets/steve.png";
import Human from "src/client/game/mp/Human";
import TextFactory from "src/client/game/text/TextFactory";
import Camera from "src/client/gl/Camera";
import Shader from "src/client/gl/Shader";
import Texture from "src/client/gl/Texture";
import fragmentShader from "src/client/shaders/human.fs";
import vertexShader from "src/client/shaders/human.vs";
import Vec3 from "src/common/math/Vec3";
import Position from "src/common/world/Position";

class HumanFactory {

    public readonly humans: Human[];
    public readonly textFactory: TextFactory;
    public readonly texture: Texture;
    public readonly shader: Shader;
    public readonly samplerUniform: WebGLUniformLocation | null;

    public constructor(textFactory: TextFactory) {
        this.textFactory = textFactory;
        this.humans = [];
        this.texture = new Texture(skin);
        this.shader = new Shader(vertexShader, fragmentShader);
        this.samplerUniform = this.shader.getUniformLocation("uTexture");
    }

    public addPlayer(id: string, name: string): void {
        this.humans.push(new Human(id, name, this.shader, this.textFactory));
    }

    public removeHuman(id: string): void {
        const human = this.findHuman(id);
        if (human) {
            this.humans.splice(this.humans.indexOf(human), 1);
            human.delete();
        }
    }

    public updateHuman(id: string, position: Position, velocity: Vec3): void {
        const human = this.findHuman(id);
        if (human) {
            human.targetPosition = Position.clone(position);
            human.velocity = Vec3.clone(velocity);
        }
    }

    public findHuman(id: string): Human | null {
        return this.humans.find((human) => human.id === id) ?? null;
    }

    public delete(): void {
        this.humans.forEach((human) => human.delete());
        this.shader.delete();
        this.texture.delete();
    }

    public update(delta: number): void {
        this.humans.forEach((human) => human.update(delta));
    }

    public render(camera: Camera): void {

        this.shader.bind();
        GL.uniform1i(this.samplerUniform, 0);
        GL.activeTexture(GL.TEXTURE0);
        this.texture.bind();

        GL.disable(GL.CULL_FACE);
        this.humans.forEach((human) => human.render(camera));
        GL.enable(GL.CULL_FACE);

        GL.disable(GL.DEPTH_TEST);
        GL.enable(GL.BLEND);

        const camPos = camera.position;
        this.humans
            .slice()
            .sort(({ position: a }, { position: b }) => Position.distSquare(b, camPos) - Position.distSquare(a, camPos))
            .forEach((human) => human.renderText(camera));

        GL.enable(GL.DEPTH_TEST);
        GL.disable(GL.BLEND);
    }
}

export default HumanFactory;