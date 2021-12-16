import Camera from "../gl/camera";
import World from "../game/world";
import Player from "../game/player";
import Human from "../game/human";

class GameScene {

    constructor() {

        this.camera = new Camera(0, 64, 3, 0, 0, 110/360*Math.PI*2, 0.1, 1000);
        this.player = new Player(this.camera);
        this.world = new World();

        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);

        this.humans = [];
        document.addEventListener("keypress", e => {
            if(e.code === "KeyF") {
                this.humans.push(new Human(this.player.position));
            }
        });
    }

    delete() {
        this.player.delete();
        this.world.delete();
        this.terrainShader.delete();
        this.terrainTexture.delete();
        this.humans.forEach(human => human.delete());

        GL.enable(GL.DEPTH_TEST);
        GL.disable(GL.CULL_FACE);
    }

    update(delta) {
        this.player.update(delta);
    }

    render() {
        this.world.render();
        this.player.render();
        this.humans.forEach(human => human.render());
    }

    onWindowResize() {
        this.camera.updateProjectionMatrix();
    }
}

export default GameScene;