import Vec3 from "common/math/Vec3";
import Position from "common/world/Position";

interface BidirectionalPackets {
    chatMessage: (packet: { text: string, color?: string }) => void;
    blockUpdate: (packet: { position: Vec3, type: number }) => void;
}

interface ClientToServerPackets extends BidirectionalPackets {
    requestChunk: (packet: { x: number, z: number }) => void;
    updatePosition: (packet: { position: Position, velocity: Vec3, onGround: boolean }) => void;
    login: (
        packet: { name: string, skin?: string, timestamp: number },
        callback: (response: { error?: string, timestamp?: number, id?: string }) => void
    ) => void;
}

interface ServerToClientPackets extends BidirectionalPackets {
    teleport: (packet: { position: Position }) => void;
    error: (packet: { error: string }) => void;
    updatePosition: (packet: { id: string, position: Position, velocity: Vec3, onGround: boolean }) => void;
    playerAdd: (packet: { id: string, name: string, skin?: string }) => void;
    playerRemove: (packet: { id: string }) => void;
    chunk: (packet: { x: number, z: number, blocks: ArrayBuffer }) => void;
}

export { ClientToServerPackets, ServerToClientPackets };