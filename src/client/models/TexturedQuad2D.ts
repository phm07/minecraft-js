import Mesh from "../gl/Mesh";

class TexturedQuad2D extends Mesh {

    public constructor(x: number, y: number, width: number, height: number, uvs: number[]) {

        const vertices = [
            x, y, uvs[0], uvs[1],
            x+width, y, uvs[2], uvs[3],
            x, y+height, uvs[4], uvs[5],
            x+width, y+height, uvs[6], uvs[7]
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