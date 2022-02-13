class Uint8Array3D extends Uint8Array {

    private readonly width;
    private readonly height;
    private readonly depth;

    public constructor(width: number, height: number, depth: number, data = new Uint8Array(width * height * depth)) {
        super(data);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    public getAt(x: number, y: number, z: number): number {
        return this[x + z * this.width + y * this.width * this.depth];
    }

    public setAt(x: number, y: number, z: number, value: number): void {
        this[x + z * this.width + y * this.width * this.depth] = value;
    }
}

export default Uint8Array3D;