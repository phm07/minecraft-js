class Uint8Array3D {

    private readonly width;
    private readonly height;
    private readonly depth;
    private readonly data;

    public constructor(width: number, height: number, depth: number, data = new Uint8Array(width * height * depth)) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.data = data;
    }

    public get(x: number, y: number, z: number): number {
        return this.data[x + z * this.width + y * this.width * this.depth];
    }

    public set(x: number, y: number, z: number, value: number): void {
        this.data[x + z * this.width + y * this.width * this.depth] = value;
    }
}

export default Uint8Array3D;