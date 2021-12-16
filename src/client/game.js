import HomeScene from "./scene/home_scene";
import Client from "./network/client";

class Game {

    constructor() {

        this.client = new Client();

        this.setScene(HomeScene);

        GL.clearColor(131/255, 226/255, 252/255, 1);
    }

    setScene(sceneClass, ...args) {
        if(this.scene) {
            this.scene.delete();
        }
        this.scene = new sceneClass(...args);
        this.scene.onWindowResize();
    }

    update(delta) {
        this.scene.update(delta);
    }

    render() {

        GL.clear(GL.COLOR_BUFFER_BIT);
        GL.clear(GL.DEPTH_BUFFER_BIT);

        this.scene.render();
    }

    onWindowResize() {
        GL.viewport(0, 0, GL.canvas.clientWidth, GL.canvas.clientHeight);
        this.scene.onWindowResize();
    }
}

export default Game;