import MathUtils from "common/math/MathUtils";

class Position {

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

    public static clone(position: Position): Position {
        return JSON.parse(JSON.stringify(position)) as Position;
    }

    public static distSquare({ x: x1, y: y1, z: z1 }: Position, { x: x2, y: y2, z: z2 }: Position): number {
        return MathUtils.dist3Square(x1, y1, z1, x2, y2, z2);
    }

    public static dist(a: Position, b: Position): number {
        return Math.sqrt(Position.distSquare(a, b));
    }
}

export default Position;