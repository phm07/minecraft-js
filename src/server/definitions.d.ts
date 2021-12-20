import {Server} from "socket.io";
import GameServer from "./GameServer";

declare global {
    var io: Server;
    var server: GameServer;
}

export { };