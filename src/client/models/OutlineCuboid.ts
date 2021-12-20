import Mesh from "../gl/Mesh";

class OutlineCuboid extends Mesh {

    constructor() {
        const vertices = [
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            1, 1, 0,
            0, 0, 1,
            1, 0, 1,
            0, 1, 1,
            1, 1, 1
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
}

export default OutlineCuboid;