import * as crypto from "crypto";

import LoginHandler from "./connection/LoginHandler";
import Player from "./game/player/Player";
import World from "./game/world/World";

class GameServer {

    public readonly players: Player[];
    public readonly world: World;
    private readonly loginHandler: LoginHandler;

    public constructor() {

        this.players = [];
        this.world = new World();
        this.loginHandler = new LoginHandler();
    }

    public getPlayerByName(name: string): Player | null {
        return this.players.find((player) => player.name === name) ?? null;
    }

    public newEntityId(): number {
        let id;
        do {
            id = crypto.randomBytes(4).readInt32BE(0);
        } while (this.findEntity(id));
        return id;
    }

    public findEntity(id: number): Player | null {
        return this.players.find((player) => player.id === id) ?? null;
    }
}

export default GameServer;