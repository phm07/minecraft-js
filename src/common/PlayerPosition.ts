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

    public static distSquare(a: PlayerPosition, b: PlayerPosition): number {
        return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z);
    }

    public static dist(a: PlayerPosition, b: PlayerPosition): number {
        return Math.sqrt(PlayerPosition.distSquare(a, b));
    }
}

export default PlayerPosition;