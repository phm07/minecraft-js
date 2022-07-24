import defaultFont from "client/assets/glyphs.png";
import GameGui from "client/game/gui/GameGui";
import HumanFactory from "client/game/mp/HumanFactory";
import Player from "client/game/player/Player";
import Font from "client/game/text/Font";
import TextFactory from "client/game/text/TextFactory";
import ClientWorld from "client/game/world/ClientWorld";
import Camera from "client/gl/Camera";
import Shader from "client/gl/Shader";
import IScene from "client/scene/IScene";
import wireframeFragmentShader from "client/shaders/wireframe.fs";
import wireframeVertexShader from "client/shaders/wireframe.vs";
import Position from "common/world/Position";

class GameScene implements IScene {

    public readonly camera: Camera;
    public readonly player: Player;
    public readonly world: ClientWorld;
    public readonly font: Font;
    public readonly textFactory: TextFactory;
    public readonly humanFactory: HumanFactory;
    public readonly wireframeShader: Shader;

    public constructor() {

        this.camera = new Camera(new Position(), 110 / 360 * Math.PI * 2, 0.01, 1000);
        this.font = new Font(defaultFont, 12);
        this.textFactory = new TextFactory(this.font);
        this.humanFactory = new HumanFactory(this.textFactory);

        this.wireframeShader = new Shader(wireframeVertexShader, wireframeFragmentShader);
        this.player = new Player(game.client.playerId ?? "", game.client.playerSkin, this.camera, this.wireframeShader, this.humanFactory.shader);
        this.world = new ClientWorld();

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
        this.world.render(this.camera);
        this.humanFactory.render(this.camera);
        this.player.render(this.camera);
    }

    public onWindowResize(): void {
        this.camera.updateProjectionMatrix();
    }
}

export default GameScene;