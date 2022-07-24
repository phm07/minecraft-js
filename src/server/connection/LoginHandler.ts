import { imageSize } from "image-size";
import Player from "server/game/player/Player";

class LoginHandler {

    public constructor() {

        io.on("connection", (socket) => {

            const timeout = setTimeout(() => {
                socket.disconnect();
            }, 10000);

            socket.on("login", (packet, callback) => {

                clearTimeout(timeout);
                const existing = server.getPlayerByName(packet.name);

                if (packet.name.length < 3 || packet.name.length > 24) {
                    callback({ error: "Invalid name" });
                    socket.disconnect();
                    return;
                }

                if (existing) {
                    callback({ error: "Player already online" });
                    socket.disconnect();
                    return;
                }

                if (packet.skin && !LoginHandler.isValidSkin(packet.skin)) {
                    callback({ error: "Invalid skin" });
                    socket.disconnect();
                    return;
                }

                const id = server.newEntityId();
                callback({ timestamp: packet.timestamp, id });
                server.players.push(new Player(id, socket, packet.name, packet.skin));
            });
        });

    }

    private static isValidSkin(skin: string): boolean {

        if (!skin.startsWith("data:image/png;base64,")) {
            return false;
        }

        const img = Buffer.from(skin.substring(22), "base64");
        const { width, height } = imageSize(img);
        return width === 64 && height === 64;
    }
}

export default LoginHandler;