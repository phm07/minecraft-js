import PlayerPosition from "../../../common/PlayerPosition";
import Vec3 from "../../../common/Vec3";
import skin from "../../assets/steve.png";
import Texture from "../../gl/Texture";
import GameScene from "../../scene/GameScene";
import Human from "./Human";

class PlayerManager {

    private readonly players: Human[];
    public readonly texture: Texture;

    public constructor() {
        Human.init();

        this.players = [];
        this.texture = new Texture(skin);
    }

    public addPlayer(id: number, name: string, position: PlayerPosition): void {
        this.players.push(new Human(id, name, position));
    }

    public removePlayer(id: number): void {
        const human = this.findPlayer(id);
        if (human) this.players.splice(this.players.indexOf(human), 1);
    }

    public updatePlayer(id: number, position: PlayerPosition, velocity: Vec3): void {
        const player = this.findPlayer(id);
        if (player) player.setPosition(position, velocity);
    }

    public findPlayer(id: number): Human | null {
        return this.players.find(player => player.id === id) ?? null;
    }

    public delete(): void {
        this.players.forEach(player => player.delete());
    }

    public update(delta: number): void {
        this.players.forEach(player => player.update(delta));
    }

    public render(): void {

        Human.HUMAN_SHADER.bind();
        GL.uniform1i(Human.HUMAN_SAMPLER, 0);
        GL.activeTexture(GL.TEXTURE0);
        this.texture.bind();

        this.players.forEach(player => player.render());

        GL.disable(GL.DEPTH_TEST);
        GL.enable(GL.BLEND);

        const camPos = (game.scene as GameScene).camera.position;
        this.players
            .slice()
            .sort(({ position: a }, { position: b }) => PlayerPosition.distSquare(b, camPos) - PlayerPosition.distSquare(a, camPos))
            .forEach(player => player.renderText());

        GL.enable(GL.DEPTH_TEST);
        GL.disable(GL.BLEND);
    }
}

export default PlayerManager;