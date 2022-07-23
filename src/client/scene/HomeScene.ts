import Game from "client/Game";
import HomeGui from "client/game/gui/HomeGui";
import IScene from "client/scene/IScene";

class HomeScene implements IScene {

    public constructor(game: Game, error: string) {
        game.guiManager.setGui(HomeGui, { error });
    }

    public async startGame(name: string): Promise<void> {
        await game.client.login(name);
    }

    public delete(): void {
        // do nothing
    }

    public render(): void {
        // do nothing
    }

    public onWindowResize(): void {
        // do nothing
    }

    public update(): void {
        // do nothing
    }
}

export default HomeScene;