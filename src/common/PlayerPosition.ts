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
}

export default PlayerPosition;