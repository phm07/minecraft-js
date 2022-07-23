import Mesh from "client/gl/Mesh";
import Vec3 from "common/math/Vec3";

class WireframeCuboid extends Mesh {

    public constructor({ x, y, z } = new Vec3(), { x: w, y: h, z: d } = new Vec3(1)) {
        const vertices = [
            x, y, z, 0, 0, 0,
            x + w, y, z, 0, 0, 0,
            x, y + h, z, 0, 0, 0,
            x + w, y + h, z, 0, 0, 0,
            x, y, z + d, 0, 0, 0,
            x + w, y, z + d, 0, 0, 0,
            x, y + h, z + d, 0, 0, 0,
            x + w, y + h, z + d, 0, 0, 0
        ];
        const attributes = [3, 3];
        const indices = [
            0, 1,
            1, 3,
            2, 0,
            3, 2,
            4, 5,
            5, 7,
            6, 4,
            7, 6,
            0, 4,
            1, 5,
            2, 6,
            3, 7
        ];

        super(vertices, attributes, indices);
    }

    public render(): void {
        this.bind();
        GL.drawElements(GL.LINES, this.numIndices, GL.UNSIGNED_INT, 0);
    }
}

export default WireframeCuboid;