import Mesh from "src/client/gl/Mesh";

class Axes extends Mesh {

    public constructor() {
        super(
            [
                0, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 1, 0,
                0, 1, 0, 0, 1, 0,
                0, 0, 0, 0, 0, 1,
                0, 0, 1, 0, 0, 1
            ],
            [
                3, 3
            ],
            [
                0, 1,
                2, 3,
                4, 5
            ]
        );
    }

    public render(): void {
        this.bind();
        GL.drawElements(GL.LINES, this.numIndices, GL.UNSIGNED_INT, 0);
    }
}

export default Axes;