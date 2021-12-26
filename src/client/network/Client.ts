import { io, Socket } from "socket.io-client";

import Position from "../../common/Position";
import Vec3 from "../../common/Vec3";
import Chunk from "../game/world/Chunk";
import GameScene from "../scene/GameScene";
import HomeScene from "../scene/HomeScene";

class Client {

    private loggingIn = false;
    public socket: Socket | null = null;

    public async login(name: string): Promise<string> {

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

            this.socket.emit("login", {
                name, timestamp
            });

            this.socket.on("error", (error: string) => {
                reject(error);
                clearTimeout(timeout);
                this.loggingIn = false;
            });

            this.socket.on("login", (packet: { timestamp: number }) => {
                if (packet.timestamp === timestamp) {
                    this.loggingIn = false;
                    clearTimeout(timeout);
                    resolve("Success");
                    this.setupSocket();
                    game.setScene(new GameScene());
                }
            });
        });
    }

    public setupSocket(): void {

        if (!this.socket) return;

        let err = "Disconnected";
        this.socket.on("error", (error: string) => {
            err = error;
        });

        this.socket.on("disconnect", () => {
            game.setScene(new HomeScene(game, err));
        });

        this.socket.on("teleport", (packet: { position: Position }) => {
            (game.scene as GameScene).player.teleport(packet.position);
        });

        this.socket.on("chunk", (packet: { x: number, z: number, blocks: number[] }) => {
            (game.scene as GameScene).world.receiveChunk(new Chunk(packet.x, packet.z, new Uint8Array(packet.blocks)));
        });

        this.socket.on("playerAdd", (packet: { id: number, name: string, position: Position }) => {
            (game.scene as GameScene).humanFactory.addPlayer(packet.id, packet.name, packet.position);
        });

        this.socket.on("position", (packet: { id: number, position: Position, velocity: Vec3, onGround: boolean }) => {
            (game.scene as GameScene).humanFactory.updateHuman(packet.id, packet.position, packet.velocity);
        });

        this.socket.on("playerRemove", (packet: { id: number }) => {
            (game.scene as GameScene).humanFactory.removeHuman(packet.id);
        });
    }
}

export default Client;