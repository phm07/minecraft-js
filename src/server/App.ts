import http from "http";
import * as express from "express";
import { Server } from "socket.io";

import GameServer from "src/server/GameServer";

const app = express.default();
const httpServer = http.createServer(app);

app.use(express.static(__dirname));

global.io = new Server(httpServer);
global.server = new GameServer();

const port = process.env.PORT ?? 80;
httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});