class AABB {

    public x: number;
    public y: number;
    public z: number;
    public w: number;
    public h: number;
    public l: number;

    public constructor(x: number, y: number, z: number, w: number, h: number, l: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.l = l;
    }

    public intersects(that: AABB): boolean {
        return (this.x <= that.x + that.w && this.x + this.w >= that.x) &&
                (this.y <= that.y + that.h && this.y + this.h >= that.y) &&
                (this.z <= that.z + that.l && this.z + this.l >= that.z);
    }
}

export default AABB;