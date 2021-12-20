class VertexBuffer {

    private readonly vao: WebGLVertexArrayObject | null;
    private readonly buffer: WebGLBuffer | null;

    public constructor(vertices: number[], attributes: number[]) {

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

    public delete(): void {
        GL.deleteBuffer(this.buffer);
        GL.deleteVertexArray(this.vao);
    }

    public bind(): void {
        GL.bindVertexArray(this.vao);
    }

    public unbind(): void {
        GL.bindVertexArray(null);
    }
}

export default VertexBuffer;