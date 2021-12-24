import express from "express";
import http from "http";
import { Server } from "socket.io";

import GameServer from "./GameServer";

const app = express();
const httpServer = http.createServer(app);

app.use(express.static(__dirname));

global.io = new Server(httpServer);
global.server = new GameServer();

const port = process.env.PORT ?? 80;
httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});