import { Server, Socket } from "socket.io";

import GameServer from "./GameServer";
import { ClientToServerPackets, ServerToClientPackets } from "common/packet/Protocol";

declare global {
    var io: Server<ClientToServerPackets, ServerToClientPackets>;
    var server: GameServer;
    type PlayerSocket = Socket<ClientToServerPackets, ServerToClientPackets>;
}

export { };