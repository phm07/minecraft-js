import Vertex from "./vertex";
import Mesh from "./mesh";

class ObjLoader {

    static load(source) {

        const vertices = [], indices = [];

        for(let line of source.split("\n")) {
            line = line.trim();
            const args = line.split(" ");
            if(line.startsWith("v ")) {
                const x = Number.parseFloat(args[1]);
                const y = Number.parseFloat(args[2]);
                const z = Number.parseFloat(args[3]);
                vertices.push(new Vertex(x, y, z));
            } else if(line.startsWith("f ")) {
                for(let i = 1; i < 4; i++) {
                    indices.push(Number.parseFloat(args[i].split("/")[0])-1);
                }
            }
        }

        return new Mesh(vertices, indices);
    }
}

export default ObjLoader;