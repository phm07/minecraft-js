import Mesh from "../gl/Mesh";

class Quad2D extends Mesh {

    public constructor(x: number, y: number, width: number, height: number) {

        const vertices = [
            x, y,
            x + width, y,
            x, y + height,
            x + width, y + height
        ];

        const attributes = [2];

        const indices = [
            0, 2, 1,
            1, 2, 3
        ];

        super(vertices, attributes, indices);
    }
}

export default Quad2D;