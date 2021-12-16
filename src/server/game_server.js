import LoginHandler from "./connection/login_handler.js";
import World from "./game/world.js";

class GameServer {

    constructor() {

        this.players = [];
        this.world = new World();
        this.loginHandler = new LoginHandler();
    }

    getPlayer(name) {
        for(let player of this.players) {
            if(player.name === name) return player;
        }
        return null;
    }
}

export default GameServer;