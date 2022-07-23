class MathUtils {

    public static clamp(x: number, lower: number, upper: number): number {
        return Math.min(Math.max(x, lower), upper);
    }

    public static lerp(a: number, b: number, mix: number): number {
        return a + (b - a) * this.clamp(mix, 0, 1);
    }

    public static dist3Square(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2);
    }

    public static dist3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
        return Math.sqrt(MathUtils.dist3Square(x1, y1, z1, x2, y2, z2));
    }

    public static dist2Square(x1: number, y1: number, x2: number, y2: number): number {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }

    public static dist2(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(MathUtils.dist2Square(x1, y1, x2, y2));
    }

    public static map(x: number, from: number, to: number, lower: number, upper: number): number {
        return this.clamp((x - from) / (to - from), 0, 1) * (upper - lower) + lower;
    }

    public static wrapRadians(angle: number): number {
        return angle - Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
    }

    public static mod(n: number, d: number): number {
        return (n % d + d) % d;
    }
}

export default MathUtils;