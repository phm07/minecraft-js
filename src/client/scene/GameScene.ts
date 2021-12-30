import Position from "../../common/Position";
import defaultFont from "../assets/glyphs.png";
import GameGui from "../game/gui/GameGui";
import HumanFactory from "../game/mp/HumanFactory";
import Player from "../game/player/Player";
import Font from "../game/text/Font";
import TextFactory from "../game/text/TextFactory";
import World from "../game/world/World";
import Camera from "../gl/Camera";
import Shader from "../gl/Shader";
import wireframeFragmentShader from "../shaders/wireframe.fs";
import wireframeVertexShader from "../shaders/wireframe.vs";
import IScene from "./IScene";

class GameScene implements IScene {

    public readonly camera: Camera;
    public readonly player: Player;
    public readonly world: World;
    public readonly font: Font;
    public readonly textFactory: TextFactory;
    public readonly humanFactory: HumanFactory;
    public readonly wireframeShader: Shader;

    public constructor() {

        this.wireframeShader = new Shader(wireframeVertexShader, wireframeFragmentShader);
        this.camera = new Camera(new Position(), 110 / 360 * Math.PI * 2, 0.01, 1000);
        this.player = new Player(this.camera, this.wireframeShader);
        this.world = new World();

        this.font = new Font(defaultFont, 12);
        this.textFactory = new TextFactory(this.font);
        this.humanFactory = new HumanFactory(this.textFactory);

        game.guiManager.setGui(GameGui, { humanFactory: this.humanFactory, wireframeShader: this.wireframeShader });

        GL.enable(GL.DEPTH_TEST);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    }

    public delete(): void {
        this.player.delete();
        this.world.delete();
        this.font.delete();
        this.humanFactory.delete();
        this.textFactory.delete();

        GL.enable(GL.DEPTH_TEST);
    }

    public update(delta: number): void {
        this.player.update(delta);
        this.humanFactory.update(delta);
    }

    public render(): void {
        this.world.render();
        this.humanFactory.render();
        this.player.render();
    }

    public onWindowResize(): void {
        this.camera.updateProjectionMatrix();
    }
}

export default GameScene;