import PlayerPosition from "../../common/PlayerPosition";
import defaultFont from "../assets/glyphs.png";
import PlayerManager from "../game/mp/PlayerManager";
import Player from "../game/player/Player";
import Font from "../game/text/Font";
import Text from "../game/text/Text";
import World from "../game/world/World";
import Camera from "../gl/Camera";
import IScene from "./IScene";

class GameScene implements IScene {

    public readonly camera: Camera;
    public readonly player: Player;
    public readonly world: World;
    public readonly font: Font;
    public readonly playerManager: PlayerManager;

    public constructor() {

        this.camera = new Camera(new PlayerPosition(), 110 / 360 * Math.PI * 2, 0.1, 1000);
        this.player = new Player(this.camera);
        this.world = new World();

        this.playerManager = new PlayerManager();
        this.font = new Font(defaultFont, 12);

        Text.init();

        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    }

    public delete(): void {
        this.player.delete();
        this.world.delete();
        this.playerManager.delete();

        GL.enable(GL.DEPTH_TEST);
        GL.disable(GL.CULL_FACE);
    }

    public update(delta: number): void {
        this.player.update(delta);
        this.playerManager.update(delta);
    }

    public render(): void {
        this.world.render();
        this.playerManager.render();
    }

    public onWindowResize(): void {
        this.camera.updateProjectionMatrix();
    }
}

export default GameScene;