import GuiManager from "client/game/gui/GuiManager";
import Client from "client/network/Client";
import HomeScene from "client/scene/HomeScene";
import IScene from "client/scene/IScene";

class Game {

    public readonly client: Client;
    public guiManager: GuiManager;
    public scene: IScene;
    private frameStart: number;
    public fps: number;

    public constructor() {

        this.client = new Client();
        this.guiManager = new GuiManager();
        this.scene = new HomeScene(this, "");
        this.frameStart = 0;
        this.fps = 0;

        GL.clearColor(131 / 255, 226 / 255, 252 / 255, 1);
        GL.enable(GL.CULL_FACE);
        GL.blendFuncSeparate(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE);
    }

    public setScene(scene: IScene): void {
        this.scene.delete();
        this.scene = scene;
        this.scene.onWindowResize();
    }

    public update(delta: number): void {
        this.frameStart = window.performance.now();
        this.scene.update(delta);
        this.guiManager.update(delta);
    }

    public render(): void {

        GL.clear(GL.COLOR_BUFFER_BIT);
        GL.clear(GL.DEPTH_BUFFER_BIT);

        this.scene.render();
        this.guiManager.render();
    }

    public onWindowResize(): void {
        GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
        this.scene.onWindowResize();
        this.guiManager.onWindowResize();
    }
}

export default Game;