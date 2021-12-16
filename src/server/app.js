import express from "express"
import http from "http"
import { Server } from "socket.io";
import GameServer from "./game_server";

const app = express();
const server = http.createServer(app);

global.io = new Server(server);
app.use(express.static(__dirname));

global.server = new GameServer();

const port = process.env.PORT ?? 80;
server.listen(port, () => {
    console.log("Server started on port " + port);
});