class Util {

    public static clamp(x: number, lower: number, upper: number): number {
        return Math.min(Math.max(x, lower), upper);
    }

    public static lerp(a: number, b: number, mix: number): number {
        return a + (b - a) * this.clamp(mix, 0, 1);
    }

    public static distSquare(x1: number, y1: number, x2: number, y2: number): number {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }

    public static dist(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Util.distSquare(x1, y1, x2, y2));
    }

    public static map(x: number, from: number, to: number, lower: number, upper: number): number {
        return this.clamp((x - from) / (to - from), 0, 1) * (upper - lower) + lower;
    }

    public static wrapRadians(angle: number): number {
        return angle - Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
    }
}

export default Util;