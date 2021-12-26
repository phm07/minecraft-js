import Mesh from "../gl/Mesh";

class Quad2D extends Mesh {

    public constructor(x = 0, y = 0, width = 1, height = 1) {

        const vertices = [
            x, y,
            x + width, y,
            x, y + height,
            x + width, y + height
        ];

        const attributes = [2];

        const indices = [
            1, 2, 0,
            3, 2, 1
        ];

        super(vertices, attributes, indices);
    }
}

export default Quad2D;