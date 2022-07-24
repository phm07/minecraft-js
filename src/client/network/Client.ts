import { io } from "socket.io-client";

import GameScene from "client/scene/GameScene";
import HomeScene from "client/scene/HomeScene";

class Client {

    private loggingIn = false;
    public socket: ServerSocket | null = null;
    public playerName: string | null = null;
    public playerId: string | null = null;
    public playerSkin: string | null = null;

    public async login(name: string, skin: string | null): Promise<void> {

        return new Promise((resolve, reject) => {

            if (this.loggingIn) {
                reject("Already logging in");
                return;
            }
            this.loggingIn = true;

            this.socket = io();
            const timestamp = Date.now();
            const timeout = setTimeout(() => {
                reject("Timeout");
                this.loggingIn = false;
            }, 10000);

            this.socket.emit("login", { name, skin: skin ?? undefined, timestamp }, (response) => {

                if (response.error || !response.timestamp || !response.id) {
                    this.loggingIn = false;
                    clearTimeout(timeout);
                    reject(response.error ?? "Invalid server response");
                    return;
                }

                if (response.timestamp === timestamp) {
                    this.loggingIn = false;
                    clearTimeout(timeout);
                    resolve();
                    this.playerName = name;
                    this.playerId = response.id;
                    this.playerSkin = skin;
                    this.setupSocket();
                    game.setScene(new GameScene());
                }
            });
        });
    }

    public setupSocket(): void {

        if (!this.socket) return;

        let error = "Disconnected";
        this.socket.on("error", (packet) => {
            error = packet.error;
        });

        this.socket.on("disconnect", () => {
            this.playerName = null;
            this.playerId = null;
            this.playerSkin = null;
            game.setScene(new HomeScene(game, error));
        });

        this.socket.on("teleport", (packet) => {
            (game.scene as GameScene).player.teleport(packet.position);
        });

        this.socket.on("chunk", (packet) => {
            void (game.scene as GameScene).world.receiveChunk(packet.x, packet.z, new Uint8Array(packet.blocks));
        });

        this.socket.on("playerAdd", (packet) => {
            void (game.scene as GameScene).humanFactory.addPlayer(packet.id, packet.name, packet.skin ?? null);
        });

        this.socket.on("updatePosition", (packet) => {
            (game.scene as GameScene).humanFactory.updateHuman(packet.id, packet.position, packet.velocity);
        });

        this.socket.on("playerRemove", (packet) => {
            (game.scene as GameScene).humanFactory.removeHuman(packet.id);
        });

        this.socket.on("blockUpdate", (packet) => {
            const { x, y, z } = packet.position;
            void (game.scene as GameScene).world.setBlock(x, y, z, packet.type);
        });
    }
}

export default Client;