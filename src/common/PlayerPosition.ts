import Util from "./Util";

class PlayerPosition {

    public x: number;
    public y: number;
    public z: number;
    public yaw: number;
    public pitch: number;

    public constructor(x = 0, y = 0, z = 0, yaw = 0, pitch = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.yaw = yaw;
        this.pitch = pitch;
    }

    public static clone(position: PlayerPosition): PlayerPosition {
        return JSON.parse(JSON.stringify(position)) as PlayerPosition;
    }

    public static distSquare({ x: x1, y: y1, z: z1 }: PlayerPosition, { x: x2, y: y2, z: z2 }: PlayerPosition): number {
        return Util.dist3Square(x1, y1, z1, x2, y2, z2);
    }

    public static dist(a: PlayerPosition, b: PlayerPosition): number {
        return Math.sqrt(PlayerPosition.distSquare(a, b));
    }
}

export default PlayerPosition;