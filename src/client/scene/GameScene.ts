import PlayerPosition from "../../common/PlayerPosition";
import Vec3 from "../../common/Vec3";
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

    private readonly texts: Text[];

    public constructor() {

        this.camera = new Camera(new PlayerPosition(), 110 / 360 * Math.PI * 2, 0.1, 1000);
        this.player = new Player(this.camera);
        this.world = new World();
        this.font = new Font(defaultFont, 12);
        this.playerManager = new PlayerManager();

        Text.init();

        this.texts = [];
        window.addEventListener("keydown", e => {
            if (e.code === "KeyF") {
                this.texts.push(new Text("Moin jungs das ist ein ganz langer text momm", this.font, 0.5, new Vec3(this.player.position.x, this.player.position.y, this.player.position.z)));
            }
        });

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
        this.texts.forEach(text => text.update());
    }

    public render(): void {
        this.world.render();
        this.playerManager.render();
        this.texts.forEach(text => text.render());
    }

    public onWindowResize(): void {
        this.camera.updateProjectionMatrix();
    }
}

export default GameScene;