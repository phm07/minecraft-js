class IndexBuffer {

    constructor(indices) {
        this.buffer = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Int32Array(indices), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }

    delete() {
        GL.deleteBuffer(this.buffer);
    }

    bind() {
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    unbind() {
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }
}

export default IndexBuffer;