import { Socket } from "socket.io";

import PlayerPosition from "../../common/PlayerPosition";

class Player {

    public readonly socket: Socket;
    public readonly name: string;
    public readonly id: number;
    public position: PlayerPosition;

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
        this.socket.emit("teleport", {
            position: this.position
        });

        this.socket.on("requestChunk", (packet: { x: number, z: number }) => {
            const dx = packet.x*16-this.position.x;
            const dz = packet.z*16-this.position.z;
            if (dx*dx + dz*dz <= (256)*(256)) {
                global.server.world.getChunk(packet.x, packet.z).sendTo(this);
            }
        });

        this.socket.on("position", (packet: { position: PlayerPosition }) => {
            Object.assign(this.position, packet.position);
            this.socket.broadcast.emit("position", {
                id: this.id,
                position: this.position
            });
        });

        this.socket.broadcast.emit("playerAdd", {
            id: this.id,
            position: this.position
        });

        for (const player of global.server.players) {
            this.socket.emit("playerAdd", {
                id: player.id,
                position: player.position
            });
        }
    }

}

export default Player;