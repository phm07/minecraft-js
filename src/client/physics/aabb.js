class AABB {

    constructor(x, y, z, w, h, l) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.l = l;
    }

    intersects(that) {
        return (this.x <= that.x+that.w && this.x+this.w >= that.x) &&
                (this.y <= that.y+that.h && this.y+this.h >= that.y) &&
                (this.z <= that.z+that.l && this.z+this.l >= that.z);
    }
}

export default AABB;