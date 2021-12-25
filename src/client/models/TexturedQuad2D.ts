import Mesh from "../gl/Mesh";

class TexturedQuad2D extends Mesh {

    public constructor(left: number, right: number, top: number, bottom: number, x = 0, y = 0, width = 1, height = 1) {

        const vertices = [
            x, y, left, bottom,
            x + width, y, right, bottom,
            x, y + height, left, top,
            x + width, y + height, right, top
        ];

        const attributes = [2, 2];

        const indices = [
            0, 2, 1,
            1, 2, 3
        ];

        super(vertices, attributes, indices);
    }
}

export default TexturedQuad2D;