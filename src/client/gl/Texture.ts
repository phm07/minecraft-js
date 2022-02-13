class Texture {

    private readonly texture: WebGLTexture | null;

    public constructor(data: ImageData, wrap = GL.CLAMP_TO_EDGE) {

        this.texture = GL.createTexture();
        this.bind();
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, data.width, data.height, 0, GL.RGBA, GL.UNSIGNED_BYTE, data);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, wrap);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, wrap);
    }

    public delete(): void {
        GL.deleteTexture(this.texture);
    }

    public bind(): void {
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
    }

    public unbind(): void {
        GL.bindTexture(GL.TEXTURE_2D, null);
    }
}

export default Texture;