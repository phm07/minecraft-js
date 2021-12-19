import { io } from "socket.io-client"
import GameScene from "../scene/game_scene";
import HomeScene from "../scene/home_scene";

class Client {

    login(name) {
        if(this.loggingIn) return;
        this.loggingIn = true;

        return new Promise((resolve, reject) => {

            this.socket = io();
            const timestamp = Date.now();
            const timeout = setTimeout(() => {
                reject("Timeout");
                this.loggingIn = false;
            }, 10000);

            this.socket.emit("login", {
                name, timestamp
            });

            this.socket.on("error", error => {
                reject(error);
                clearTimeout(timeout);
                this.loggingIn = false;
            });

            this.socket.on("login", packet => {
                if(packet.timestamp === timestamp) {
                    this.loggingIn = false;
                    clearTimeout(timeout);
                    resolve("Success");
                    this.setupSocket();
                    game.setScene(GameScene);
                }
            });
        });
    }

    setupSocket() {

        let err = "Disconnected";
        this.socket.on("error", error => {
            err = error;
        });

        this.socket.on("disconnect", () => {
            game.setScene(HomeScene, err);
        });

        this.socket.on("teleport", packet => {
            game.scene.player.teleport(packet.position);
        });

        this.socket.on("chunk", chunk => {
            chunk.blocks = new Uint8Array(chunk.blocks);
            game.scene.world.receiveChunk(chunk).then();
        });

        this.socket.on("playerAdd", packet => {
            game.scene.playerManager.addPlayer(packet.id, packet.position);
        });

        this.socket.on("position", packet => {
            game.scene.playerManager.updatePlayer(packet.id, packet.position);
        });
    }
}

export default Client;