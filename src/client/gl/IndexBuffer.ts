class IndexBuffer {

    private readonly buffer: WebGLBuffer | null;

    public constructor(indices: number[]) {
        this.buffer = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Int32Array(indices), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }

    public delete(): void {
        GL.deleteBuffer(this.buffer);
    }

    public bind(): void {
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    public unbind(): void {
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }
}

export default IndexBuffer;