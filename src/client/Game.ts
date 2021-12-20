import HomeScene from "./scene/HomeScene";
import Client from "./network/Client";
import IScene from "./scene/IScene";

class Game {

    public readonly client: Client;
    public scene: IScene;

    public constructor() {

        this.client = new Client();
        this.scene = new HomeScene(null);

        GL.clearColor(131/255, 226/255, 252/255, 1);
    }

    public setScene(scene: IScene): void {
        this.scene.delete();
        this.scene = scene;
        this.scene.onWindowResize();
    }

    public update(delta: number): void {
        this.scene.update(delta);
    }

    public render(): void {

        GL.clear(GL.COLOR_BUFFER_BIT);
        GL.clear(GL.DEPTH_BUFFER_BIT);

        this.scene.render();
    }

    public onWindowResize(): void {
        GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
        this.scene.onWindowResize();
    }
}

export default Game;