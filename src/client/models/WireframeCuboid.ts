import Vec3 from "../../common/Vec3";
import Mesh from "../gl/Mesh";

class WireframeCuboid extends Mesh {

    public constructor({ x, y, z } = new Vec3(), { x: w, y: h, z: d } = new Vec3(1)) {
        const vertices = [
            x, y, z,
            x + w, y, z,
            x, y + h, z,
            x + w, y + h, z,
            x, y, z + d,
            x + w, y, z + d,
            x, y + h, z + d,
            x + w, y + h, z + d
        ];
        const attributes = [3];
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