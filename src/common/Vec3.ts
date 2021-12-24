class Vec3 {

    public x: number;
    public y: number;
    public z: number;

    public constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static add({ x: x1, y: y1, z: z1 }: Vec3, { x: x2, y: y2, z: z2 }: Vec3): Vec3 {
        return new Vec3(x1 + x2, y1 + y2, z1 + z2);
    }

    public static toArray(vec: Vec3): number[] {
        return [vec.x, vec.y, vec.z];
    }

    public static clone(vec: Vec3): Vec3 {
        return JSON.parse(JSON.stringify(vec)) as Vec3;
    }

    public static normalize(vec: Vec3): Vec3 {
        const max = Math.max(Math.abs(vec.x), Math.abs(vec.y), Math.abs(vec.z));
        const normalized = Vec3.clone(vec);
        normalized.x /= max;
        normalized.y /= max;
        normalized.z /= max;
        return normalized;
    }
}

export default Vec3;