import "../../styles/game_gui.scss";

import Position from "../../../common/Position";
import Vec2 from "../../../common/Vec2";
import Vec3 from "../../../common/Vec3";
import gui from "../../assets/gui.png";
import Camera from "../../gl/Camera";
import Model from "../../gl/Model";
import Model2D from "../../gl/Model2D";
import Texture from "../../gl/Texture";
import Humanoid from "../../models/Humanoid";
import ShadedTexturedCuboid from "../../models/ShadedTexturedCuboid";
import TexturedQuad2D from "../../models/TexturedQuad2D";
import GameScene from "../../scene/GameScene";
import HumanFactory from "../mp/HumanFactory";
import GuiManager from "./GuiManager";
import IGui from "./IGui";

class GameGui implements IGui {

    private readonly manager: GuiManager;
    private readonly crosshair: Model2D;
    private readonly camera: Camera;
    private readonly texture: Texture;
    private readonly arm: Model | null;
    private readonly fpsCounter: HTMLDivElement;
    private readonly lastFpsValues: number[];
    private readonly removeListeners: () => void;
    private showFps: boolean;

    public constructor(manager: GuiManager, { humanFactory }: { humanFactory: HumanFactory }) {

        this.manager = manager;
        this.crosshair = new Model2D(manager.shader, new TexturedQuad2D(1 / 64, 10 / 64, 1 / 64, 10 / 64));
        this.camera = new Camera(new Position(), 90 / 360 * Math.PI * 2, 0.1, 100);
        this.texture = new Texture(gui);
        this.showFps = false;
        this.lastFpsValues = [];

        this.fpsCounter = document.createElement("div");
        this.fpsCounter.classList.add("fpsCounter");
        document.body.appendChild(this.fpsCounter);

        this.fpsCounter.textContent = "FPS: 69";

        this.arm = new Model(humanFactory.shader, this.camera,
            new ShadedTexturedCuboid(Humanoid.map(40 / 64, 16 / 64, 4, 12, 4)),
            new Vec3(3.5, -1.5, -3), new Vec3(Math.PI / 2, Math.PI / 4, -Math.PI / 2), new Vec3(1, 3, 1));

        const onWindowKeydown = (e: KeyboardEvent): void => {
            if (e.code === "KeyF") {
                this.showFps = !this.showFps;
                this.fpsCounter.style.opacity = this.showFps ? "1" : "0";
            }
        };

        window.addEventListener("keydown", onWindowKeydown);

        this.removeListeners = (): void => {
            window.removeEventListener("keydown", onWindowKeydown);
        };
    }

    public delete(): void {
        document.body.removeChild(this.fpsCounter);
        this.texture.delete();
        this.arm?.delete();
        this.crosshair.delete();
        this.removeListeners();
    }

    public render(): void {

        this.manager.shader.bind();
        GL.activeTexture(GL.TEXTURE0);
        GL.uniform1i(this.manager.samplerUniform, 0);
        this.texture.bind();
        this.crosshair.render();

        const { shader: humanShader, samplerUniform: humanSamplerUniform, texture: humanTexture } = (game.scene as GameScene).humanFactory;
        humanShader.bind();
        GL.activeTexture(GL.TEXTURE0);
        GL.uniform1i(humanSamplerUniform, 0);
        humanTexture.bind();
        this.arm?.render();
    }

    public onWindowResize(): void {
        this.crosshair.scale = new Vec2(Math.min(GL.canvas.width, GL.canvas.height) / 40);
        this.crosshair.position = new Vec2(GL.canvas.width / 2 - this.crosshair.scale.x / 2, GL.canvas.height / 2 - this.crosshair.scale.y / 2);
        this.crosshair.update();
        this.camera.updateProjectionMatrix();
    }

    public update(): void {
        if (this.showFps) {
            this.lastFpsValues.push(game.fps);
            if (this.lastFpsValues.length > 60) this.lastFpsValues.unshift();
            const fps = Math.round(this.lastFpsValues.reduce((a, b) => a + b) / this.lastFpsValues.length);
            this.fpsCounter.textContent = `FPS: ${fps}`;
        }
    }
}

export default GameGui;