import Mesh from "../gl/Mesh";

class ShadedTexturedCuboid extends Mesh {

    public constructor(data: number[][]) {

        const vertices = [
            // front
            0.0, 0.0, 1.0, ...data[0],
            1.0, 0.0, 1.0, ...data[1],
            1.0, 1.0, 1.0, ...data[2],
            0.0, 1.0, 1.0, ...data[3],
            // back
            0.0, 0.0, 0.0, ...data[4],
            0.0, 1.0, 0.0, ...data[5],
            1.0, 1.0, 0.0, ...data[6],
            1.0, 0.0, 0.0, ...data[7],
            // top
            0.0, 1.0, 0.0, ...data[8],
            0.0, 1.0, 1.0, ...data[9],
            1.0, 1.0, 1.0, ...data[10],
            1.0, 1.0, 0.0, ...data[11],
            // bottom
            0.0, 0.0, 0.0, ...data[12],
            1.0, 0.0, 0.0, ...data[13],
            1.0, 0.0, 1.0, ...data[14],
            0.0, 0.0, 1.0, ...data[15],
            // right
            1.0, 0.0, 0.0, ...data[16],
            1.0, 1.0, 0.0, ...data[17],
            1.0, 1.0, 1.0, ...data[18],
            1.0, 0.0, 1.0, ...data[19],
            // left
            0.0, 0.0, 0.0, ...data[20],
            0.0, 0.0, 1.0, ...data[21],
            0.0, 1.0, 1.0, ...data[22],
            0.0, 1.0, 0.0, ...data[23]
        ];

        const attributes = [3, 2, 1];

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23   // left
        ];

        super(vertices, attributes, indices);
    }
}

export default ShadedTexturedCuboid;