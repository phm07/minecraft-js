import ImageUtils from "src/common/util/ImageUtils";

class Texture {

    private readonly texture: WebGLTexture | null;

    public constructor(src: string, wrap = GL.CLAMP_TO_EDGE) {

        this.texture = GL.createTexture();
        this.bind();
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, wrap);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, wrap);

        void (async (): Promise<void> => {
            const image = await ImageUtils.loadImage(src);
            this.bind();
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
        })();
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