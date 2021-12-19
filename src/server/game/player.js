class Player {

    constructor(socket) {

        this.id = server.newEntityId();

        this.socket = socket;

        this.position = server.world.spawnPoint;
        this.socket.emit("teleport", {
            position: this.position
        });

        this.socket.on("requestChunk", packet => {
            const dx = packet.x*16-this.position.x;
            const dz = packet.z*16-this.position.z;
            if(dx*dx + dz*dz <= (256)*(256)) {
                server.world.getChunk(packet.x, packet.z).sendTo(this);
            }
        })

        this.socket.on("position", packet => {
            this.position = {
                ...this.position,
                ...packet.position
            };
            this.socket.broadcast.emit("position", {
                id: this.id,
                position: this.position
            });
        });

        this.socket.broadcast.emit("playerAdd", {
            id: this.id,
            position: this.position
        });

        for(let player of server.players) {
            this.socket.emit("playerAdd", {
                id: player.id,
                position: player.position
            });
        }
    }

}

export default Player;