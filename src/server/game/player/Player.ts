import MathUtils from "common/math/MathUtils";
import Vec3 from "common/math/Vec3";
import Position from "common/world/Position";
import ServerChunk from "server/game/world/ServerChunk";

class Player {

    public readonly socket: PlayerSocket;
    public readonly id: string;
    public readonly name: string;
    public readonly skin: string | null;
    public position: Position;
    public velocity: Vec3;
    public onGround: boolean;

    public constructor(id: string, socket: PlayerSocket, name: string, skin: string | null) {

        this.socket = socket;
        this.id = id;
        this.name = name;
        this.skin = skin;

        this.socket.on("disconnect", () => {
            server.players.splice(server.players.indexOf(this), 1);
            this.socket.broadcast.emit("playerRemove", {
                id: this.id
            });
        });

        void server.world.getSpawnPoint().then((spawnPoint) => {
            this.position = spawnPoint;
            this.socket.emit("teleport", {
                position: this.position
            });
        });

        this.position = new Position();
        this.velocity = new Vec3();
        this.onGround = false;

        this.socket.on("requestChunk", async (packet) => {
            if (MathUtils.dist2Square(packet.x * 16, packet.z * 16, this.position.x, this.position.z) <= 256 * 256) {
                const chunk = await server.world.getChunk(packet.x, packet.z) as ServerChunk;
                chunk.sendTo(this);
            }
        });

        this.socket.on("updatePosition", (packet) => {
            Object.assign(this, packet);
            this.socket.broadcast.emit("updatePosition", {
                id: this.id,
                ...packet
            });
        });

        this.socket.on("blockUpdate", (packet: { position: { x: number, y: number, z: number }, type: number }) => {
            server.world.setBlock(packet.position.x, packet.position.y, packet.position.z, packet.type);
            this.socket.broadcast.emit("blockUpdate", packet);
        });

        this.socket.on("chatMessage", (packet) => {
            if (!packet.text.replace(/\s/g, "")) return;
            server.sendChatMessage("<" + name + "> " + packet.text);
        });

        this.socket.broadcast.emit("playerAdd", {
            id: this.id,
            name: this.name,
            skin: this.skin ?? undefined
        });

        server.players.forEach((player) => {
            this.socket.emit("playerAdd", {
                id: player.id,
                name: player.name,
                skin: player.skin ?? undefined
            });
        });

        setTimeout(() => {
            server.sendChatMessage(name + " joined the game", "#f5ff99");
        }, 100);
    }

}

export type { PlayerSocket };
export default Player;