import * as crypto from "crypto";

import LoginHandler from "server/connection/LoginHandler";
import Player from "server/game/player/Player";
import ServerWorld from "server/game/world/ServerWorld";

class GameServer {

    public readonly players: Player[];
    public readonly world: ServerWorld;
    private readonly loginHandler: LoginHandler;

    public constructor() {
        this.players = [];
        this.world = new ServerWorld();
        this.loginHandler = new LoginHandler();
    }

    public getPlayerByName(name: string): Player | null {
        return this.players.find((player) => player.name === name) ?? null;
    }

    public newEntityId(): string {
        let id;
        do {
            id = crypto.randomUUID();
        } while (this.findEntity(id));
        return id;
    }

    public findEntity(id: string): Player | null {
        return this.players.find((player) => player.id === id) ?? null;
    }

    public sendChatMessage(text: string, color: string | null = null): void {
        io.emit("chatMessage", { text, color });
    }
}

export default GameServer;