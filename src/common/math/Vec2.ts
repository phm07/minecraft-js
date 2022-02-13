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

    public static normalize(vec: Vec2): Vec2 {
        const max = Math.max(Math.abs(vec.x), Math.abs(vec.y));
        const normalized = Vec2.clone(vec);
        normalized.x /= max;
        normalized.y /= max;
        return normalized;
    }
}

export default Vec2;