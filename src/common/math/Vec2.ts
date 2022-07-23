class Vec2 {

    public x: number;
    public y: number;

    public constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    public static add({ x: x1, y: y1 }: Vec2, { x: x2, y: y2 }: Vec2): Vec2 {
        return new Vec2(x1 + x2, y1 + y2);
    }

    public static toArray(vec: Vec2): number[] {
        return [vec.x, vec.y];
    }

    public static clone(vec: Vec2): Vec2 {
        return JSON.parse(JSON.stringify(vec)) as Vec2;
    }

    public static len(vec: Vec2): number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }

    public static normalize(vec: Vec2): Vec2 {
        const len = Vec2.len(vec);
        const normalized = Vec2.clone(vec);
        normalized.x /= len;
        normalized.y /= len;
        return normalized;
    }
}

export default Vec2;