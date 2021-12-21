import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";

import DevServer from "./DevServer";
import GameServer from "./GameServer";

const app = express();
const httpServer = http.createServer(app);

if (process.env.NODE_ENV === "development") {
    DevServer.use(app);
}

app.use(express.static(__dirname));

global.io = new Server(httpServer);
global.server = new GameServer();

const port = process.env.PORT ?? 80;
httpServer.listen(port, () => {
    console.log(`${(process.env.NODE_ENV === "development" ? "Development" : "")} Server started on port ${port}`);
});