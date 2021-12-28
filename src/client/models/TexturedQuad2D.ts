import Mesh from "../gl/Mesh";

class TexturedQuad2D extends Mesh {

    public constructor(left: number, right: number, top: number, bottom: number, x = 0, y = 0, w = 1, h = 1) {

        const vertices = [
            x, y, left, bottom,
            x + w, y, right, bottom,
            x, y + h, left, top,
            x + w, y + h, right, top
        ];

        const attributes = [2, 2];

        const indices = [
            1, 2, 0,
            3, 2, 1
        ];

        super(vertices, attributes, indices);
    }
}

export default TexturedQuad2D;