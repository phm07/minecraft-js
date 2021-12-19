import LoginHandler from "./connection/login_handler.js";
import World from "./game/world.js";
import crypto from "crypto";

class GameServer {

    constructor() {

        this.players = [];
        this.world = new World();
        this.loginHandler = new LoginHandler();
    }

    getPlayerByName(name) {
        return this.players.find(player => player.name === name);
    }

    newEntityId() {
        let id;
        do {
            id = crypto.randomBytes(4).readInt32BE(0);
        } while(this.findEntity(id));
        return id;
    }

    findEntity(id) {
        return this.players.find(player => player.id === id);
    }
}

export default GameServer;