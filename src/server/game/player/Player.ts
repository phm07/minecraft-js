import { Socket } from "socket.io";

import PlayerPosition from "../../../common/PlayerPosition";
import Util from "../../../common/Util";
import Vec3 from "../../../common/Vec3";

class Player {

    public readonly socket: Socket;
    public readonly name: string;
    public readonly id: number;
    public position: PlayerPosition;
    public velocity: Vec3;
    public onGround: boolean;

    public constructor(socket: Socket, name: string) {

        this.id = global.server.newEntityId();
        this.name = name;
        this.socket = socket;

        this.socket.on("disconnect", () => {
            global.server.players.splice(global.server.players.indexOf(this), 1);
            this.socket.broadcast.emit("playerRemove", {
                id: this.id
            });
        });

        this.position = PlayerPosition.clone(global.server.world.spawnPoint);
        this.velocity = new Vec3();
        this.onGround = false;
        this.socket.emit("teleport", {
            position: this.position
        });

        this.socket.on("requestChunk", (packet: { x: number, z: number }) => {
            if (Util.distSquare(packet.x * 16, packet.z * 16, this.position.x, this.position.z) <= 256 * 256) {
                global.server.world.getChunk(packet.x, packet.z).sendTo(this);
            }
        });

        this.socket.on("position", (packet: { position: PlayerPosition, velocity: Vec3, onGround: boolean }) => {
            Object.assign(this, packet);
            this.socket.broadcast.emit("position", {
                id: this.id,
                ...packet
            });
        });

        this.socket.broadcast.emit("playerAdd", {
            id: this.id,
            position: this.position,
            name: this.name
        });

        global.server.players.forEach(player => {
            this.socket.emit("playerAdd", {
                id: player.id,
                position: player.position,
                name: player.name
            });
        });
    }

}

export default Player;