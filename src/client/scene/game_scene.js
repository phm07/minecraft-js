import Camera from "../gl/camera";
import World from "../game/world";
import Player from "../game/player";
import PlayerManager from "../game/player_manager";

class GameScene {

    constructor() {

        this.camera = new Camera(0, 64, 3, 0, 0, 110/360*Math.PI*2, 0.1, 1000);
        this.player = new Player(this.camera);
        this.world = new World();
        this.playerManager = new PlayerManager();

        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
    }

    delete() {
        this.player.delete();
        this.world.delete();
        this.playerManager.delete();

        GL.enable(GL.DEPTH_TEST);
        GL.disable(GL.CULL_FACE);
    }

    update(delta) {
        this.player.update(delta);
        this.playerManager.update(delta);
    }

    render() {
        this.world.render();
        this.player.render();
        this.playerManager.render();
    }

    onWindowResize() {
        this.camera.updateProjectionMatrix();
    }
}

export default GameScene;