import Shader from "../gl/Shader";
import vertexShader from "../shaders/human.vs";
import fragmentShader from "../shaders/human.fs";
import skin from "../assets/steve.png";
import Texture from "../gl/Texture";
import Human from "./Human";
import PlayerPosition from "../../common/PlayerPosition";

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

    public updatePlayer(id: number, position: PlayerPosition): void {
        const player = this.findPlayer(id);
        if(player) player.setPosition(position);
    }

    public findPlayer(id: number): Human | null {
        return this.players.find(player => player.id === id) ?? null;
    }

    public delete(): void {
        this.players.forEach(player => player.delete());
    }

    public update(): void {
        this.players.forEach(player => player.update());
    }

    public render(): void {
        this.players.forEach(player => player.render());
    }
}

export default PlayerManager;