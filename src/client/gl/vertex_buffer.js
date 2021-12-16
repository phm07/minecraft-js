class VertexBuffer {

    constructor(vertices, attributes) {

        this.vao = GL.createVertexArray();
        GL.bindVertexArray(this.vao);

        this.buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);


        const stride = attributes.reduce((a, b) => a+b)*4;
        let offset = 0;

        for(let i = 0; i < attributes.length; i++) {
            GL.enableVertexAttribArray(i);
            GL.vertexAttribPointer(i, attributes[i], GL.FLOAT, false, stride, offset);
            offset += attributes[i] * 4;
        }

        GL.bindVertexArray(null);
    }

    delete() {
        GL.deleteBuffer(this.buffer);
        GL.deleteVertexArray(this.vao);
    }

    bind() {
        GL.bindVertexArray(this.vao);
    }

    unbind() {
        GL.bindVertexArray(null);
    }
}

export default VertexBuffer;