import VertexBuffer from "./vertex_buffer";
import IndexBuffer from "./index_buffer";

class Mesh {

    constructor(vertices, attributes, indices) {
        this.vertices = vertices;
        this.indices = indices;
        this.vertexBuffer = new VertexBuffer(vertices, attributes);
        this.indexBuffer = new IndexBuffer(indices);
    }

    delete() {
        this.vertexBuffer.delete();
        this.indexBuffer.delete();
    }

    bind() {
        this.vertexBuffer.bind();
        this.indexBuffer.bind();
    }

    unbind() {
        this.vertexBuffer.unbind();
        this.indexBuffer.unbind();
    }
}

export default Mesh;