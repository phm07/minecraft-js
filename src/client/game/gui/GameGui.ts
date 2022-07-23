import "src/client/styles/game_gui.scss";

import { mat4 } from "gl-matrix";
import gui from "src/client/assets/gui.png";
import GuiManager from "src/client/game/gui/GuiManager";
import IGui from "src/client/game/gui/IGui";
import HumanFactory from "src/client/game/mp/HumanFactory";
import ViewMode from "src/client/game/player/ViewMode";
import Camera from "src/client/gl/Camera";
import Model from "src/client/gl/Model";
import Model2D from "src/client/gl/Model2D";
import Shader from "src/client/gl/Shader";
import Texture from "src/client/gl/Texture";
import Axes from "src/client/models/Axes";
import Humanoid from "src/client/models/Humanoid";
import ShadedTexturedCuboid from "src/client/models/ShadedTexturedCuboid";
import TexturedQuad2D from "src/client/models/TexturedQuad2D";
import GameScene from "src/client/scene/GameScene";
import Vec2 from "src/common/math/Vec2";
import Vec3 from "src/common/math/Vec3";
import Position from "src/common/world/Position";

class GameGui implements IGui {

    private readonly manager: GuiManager;
    private readonly crosshair: Model2D;
    private readonly axes: Model;
    private readonly camera: Camera;
    private readonly texture: Texture;
    private readonly arm: Model;
    private readonly fpsCounter: HTMLDivElement;
    private readonly lastFpsValues: number[];
    private readonly removeListeners: () => void;
    private showFps: boolean;

    public constructor(manager: GuiManager, { humanFactory, wireframeShader }: { humanFactory: HumanFactory, wireframeShader: Shader }) {

        this.manager = manager;
        this.camera = new Camera(new Position(), 90 / 360 * Math.PI * 2, 0.1, 100);
        this.crosshair = new Model2D(manager.shader, new TexturedQuad2D(1 / 64, 10 / 64, 1 / 64, 10 / 64));
        this.axes = new Model(wireframeShader, new Axes());
        this.texture = new Texture(gui);
        this.showFps = false;
        this.lastFpsValues = [];

        this.fpsCounter = document.createElement("div");
        this.fpsCounter.classList.add("fpsCounter");
        document.body.appendChild(this.fpsCounter);

        this.fpsCounter.textContent = "FPS: 69";

        this.arm = new Model(humanFactory.shader,
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
        this.arm.delete();
        this.crosshair.delete();
        this.axes.delete();
        this.removeListeners();
    }

    public render(): void {

        if (this.showFps) {
            this.axes.shader.bind();
            this.axes.render(this.camera);
        } else {
            this.manager.shader.bind();
            GL.activeTexture(GL.TEXTURE0);
            GL.uniform1i(this.manager.samplerUniform, 0);
            this.texture.bind();
            this.crosshair.render();
        }

        if ((game.scene as GameScene).player.viewMode === ViewMode.FIRST_PERSON) {
            const { shader: humanShader, samplerUniform: humanSamplerUniform, texture: humanTexture } = (game.scene as GameScene).humanFactory;
            humanShader.bind();
            GL.activeTexture(GL.TEXTURE0);
            GL.uniform1i(humanSamplerUniform, 0);
            humanTexture.bind();
            this.arm.render(this.camera);
        }
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

            const { pitch, yaw } = (game.scene as GameScene).camera.position;
            mat4.identity(this.axes.modelMatrix);
            mat4.translate(this.axes.modelMatrix, this.axes.modelMatrix, [0, 0, -15]);
            mat4.rotate(this.axes.modelMatrix, this.axes.modelMatrix, pitch, [1, 0, 0]);
            mat4.rotate(this.axes.modelMatrix, this.axes.modelMatrix, yaw, [0, 1, 0]);
        }
    }
}

export default GameGui;