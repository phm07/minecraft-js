class Player {

    constructor(socket) {
        
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
        });
    }

}

export default Player;