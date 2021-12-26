import Position from "../../../common/Position";
import Vec3 from "../../../common/Vec3";
import skin from "../../assets/steve.png";
import Shader from "../../gl/Shader";
import Texture from "../../gl/Texture";
import GameScene from "../../scene/GameScene";
import fragmentShader from "../../shaders/human.fs";
import vertexShader from "../../shaders/human.vs";
import TextFactory from "../text/TextFactory";
import Human from "./Human";

class HumanFactory {

    private readonly humans: Human[];
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

    public addPlayer(id: number, name: string, position: Position): void {
        this.humans.push(new Human(this, id, name, position));
    }

    public removeHuman(id: number): void {
        const human = this.findHuman(id);
        if (human) {
            this.humans.splice(this.humans.indexOf(human), 1);
            human.delete();
        }
    }

    public updateHuman(id: number, position: Position, velocity: Vec3): void {
        const human = this.findHuman(id);
        if (human) human.setPosition(position, velocity);
    }

    public findHuman(id: number): Human | null {
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

    public render(): void {

        this.shader.bind();
        GL.uniform1i(this.samplerUniform, 0);
        GL.activeTexture(GL.TEXTURE0);
        this.texture.bind();

        GL.disable(GL.CULL_FACE);
        this.humans.forEach((human) => human.render());
        GL.enable(GL.CULL_FACE);

        GL.disable(GL.DEPTH_TEST);
        GL.enable(GL.BLEND);

        const camPos = (game.scene as GameScene).camera.position;
        this.humans
            .slice()
            .sort(({ position: a }, { position: b }) => Position.distSquare(b, camPos) - Position.distSquare(a, camPos))
            .forEach((human) => human.renderText());

        GL.enable(GL.DEPTH_TEST);
        GL.disable(GL.BLEND);
    }
}

export default HumanFactory;