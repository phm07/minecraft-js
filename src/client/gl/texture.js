class Texture {

    constructor(src, wrap=GL.CLAMP_TO_EDGE) {

        this.texture = GL.createTexture();
        this.bind();
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, wrap);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, wrap);

        Texture.loadImage(src).then(image => {
            this.bind();
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
        });
    }

    static loadImage(src) {
        const image = new Image();
        image.src = src;
        return new Promise(resolve => {
            image.onload = () => resolve(image);
        });
    }

    delete() {
        GL.deleteTexture(this.texture);
    }

    bind() {
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
    }

    unbind() {
        GL.bindTexture(GL.TEXTURE_2D, null);
    }
}

export default Texture;