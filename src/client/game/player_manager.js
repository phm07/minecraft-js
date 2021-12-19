import Shader from "../gl/shader";
import vertexShader from "../shaders/human.vs"
import fragmentShader from "../shaders/human.fs"
import skin from "../assets/steve.png"
import Texture from "../gl/texture";
import Human from "./human";

class PlayerManager {

    constructor() {
        this.players = [];
        this.shader = new Shader(vertexShader, fragmentShader);
        this.texture = new Texture(skin);
    }

    addPlayer(id, position) {
        this.players.push(new Human(id, this.shader, this.texture, position));
    }

    updatePlayer(id, position) {
        const player = this.findPlayer(id);
        if(player) player.setPosition(position);
    }

    findPlayer(id) {
        return this.players.find(player => player.id === id);
    }

    delete() {
        this.players.forEach(player => player.delete());
    }

    update(delta) {
        this.players.forEach(player => player.update(delta));
    }

    render() {
        this.players.forEach(player => player.render());
    }
}

export default PlayerManager;