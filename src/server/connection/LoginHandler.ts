import Player from "src/server/game/player/Player";

class LoginHandler {

    public constructor() {

        io.on("connection", (socket) => {

            const timeout = setTimeout(() => {
                socket.disconnect();
            }, 10000);

            socket.on("login", (event: { name: string, timestamp: number }) => {

                clearTimeout(timeout);
                const existing = server.getPlayerByName(event.name);

                if (event.name.length < 3 || event.name.length > 24) {
                    socket.emit("error", "Invalid name");
                    socket.disconnect();
                    return;
                }

                if (existing) {
                    socket.emit("error", "Player already online");
                    socket.disconnect();
                    return;
                }

                socket.emit("login", { timestamp: event.timestamp });
                server.players.push(new Player(socket, event.name));
            });
        });

    }
}

export default LoginHandler;