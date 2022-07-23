class Vec3 {

    public x: number;
    public y: number;
    public z: number;

    public constructor(x = 0, y = x, z = x) {
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

    public static len(vec: Vec3): number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    }

    public static normalize(vec: Vec3): Vec3 {
        const len = Vec3.len(vec);
        const normalized = Vec3.clone(vec);
        normalized.x /= len;
        normalized.y /= len;
        normalized.z /= len;
        return normalized;
    }
}

export default Vec3;