import PlayerPosition from "../../common/PlayerPosition";
import Vec3 from "../../common/Vec3";
import skin from "../assets/steve.png";
import Shader from "../gl/Shader";
import Texture from "../gl/Texture";
import fragmentShader from "../shaders/human.fs";
import vertexShader from "../shaders/human.vs";
import Human from "./Human";

class PlayerManager {

    private readonly players: Human[];
    private readonly shader: Shader;
    private readonly texture: Texture;

    public constructor() {
        this.players = [];
        this.shader = new Shader(vertexShader, fragmentShader);
        this.texture = new Texture(skin);
    }

    public addPlayer(id: number, position: PlayerPosition): void {
        this.players.push(new Human(id, this.shader, this.texture, position));
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
        this.players.forEach(player => player.render());
    }
}

export default PlayerManager;