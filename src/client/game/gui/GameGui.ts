import { resolveCaa } from "dns";

import PlayerPosition from "../../../common/PlayerPosition";
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
import Human from "../mp/Human";
import GuiManager from "./GuiManager";
import IGui from "./IGui";

class GameGui implements IGui {

    private readonly crosshair: Model2D;
    private readonly camera: Camera;
    private readonly texture: Texture;
    private readonly arm: Model;

    public constructor() {

        GL.uniform1i(GuiManager.GUI_SAMPLER_UNIFORM, 0);

        this.crosshair = new Model2D(GuiManager.GUI_SHADER, new TexturedQuad2D(1 / 64, 10 / 64, 1 / 64, 10 / 64));
        this.camera = new Camera(new PlayerPosition(), 90 / 360 * Math.PI * 2, 0.1, 100);
        this.texture = new Texture(gui);

        this.arm = new Model(Human.HUMAN_SHADER, this.camera,
            new ShadedTexturedCuboid(Humanoid.map(40 / 64, 16 / 64, 4, 12, 4)),
            new Vec3(3.5, -1.5, -3), new Vec3(Math.PI / 2, Math.PI / 4, -Math.PI / 2), new Vec3(1, 3, 1));
    }

    public delete(): void {
        this.crosshair.delete();
    }

    public render(): void {

        GuiManager.GUI_SHADER.bind();
        GL.activeTexture(GL.TEXTURE0);
        this.texture.bind();
        this.crosshair.render();

        Human.HUMAN_SHADER.bind();
        GL.activeTexture(GL.TEXTURE0);
        (game.scene as GameScene).playerManager.texture.bind();
        this.arm.render();
    }

    public onWindowResize(): void {
        this.crosshair.scale = new Vec2(Math.max(GL.canvas.width, GL.canvas.height) / 100);
        this.crosshair.position = new Vec2(GL.canvas.width / 2 - this.crosshair.scale.x / 2, GL.canvas.height / 2 - this.crosshair.scale.y / 2);
        this.crosshair.update();
        this.camera.updateProjectionMatrix();
    }

    public update(): void {
        // do nothing
    }
}

export default GameGui;