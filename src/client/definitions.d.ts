import Game from "client/Game";
import { Socket } from "socket.io-client";
import { ClientToServerPackets, ServerToClientPackets } from "common/packet/Protocol";

declare global {
    var game: Game;
    var GL: WebGL2RenderingContext;
    type ServerSocket = Socket<ServerToClientPackets, ClientToServerPackets>;
}

export { };