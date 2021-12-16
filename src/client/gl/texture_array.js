import Texture from "./texture";

class TextureArray {

    constructor(src, tilesX, tilesY) {

        this.texture = GL.createTexture();
        this.bind();

        GL.texImage3D(GL.TEXTURE_2D_ARRAY, 0, GL.RGBA, 1, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

        Texture.loadImage(src).then(image => {

            this.bind();

            const tileWidth = Math.floor(image.width/tilesX);
            const tileHeight = Math.floor(image.height/tilesY);

            GL.texImage3D(GL.TEXTURE_2D_ARRAY, 0, GL.RGBA, tileWidth, tileHeight, tilesX*tilesY,
                0, GL.RGBA, GL.UNSIGNED_BYTE, null);

            const promises = [];
            for(let x = 0; x < tilesX; x++) {
                for(let y = 0; y < tilesY; y++) {
                    promises.push(TextureArray.#cropImage(image, x*tileWidth, y*tileHeight, tileWidth, tileHeight));
                }
            }

            Promise.all(promises).then((tiles) => {

                this.bind();

                for(let x = 0; x < tilesX; x++) {
                    for(let y = 0; y < tilesY; y++) {
                        GL.texSubImage3D(GL.TEXTURE_2D_ARRAY, 0, 0, 0, x+y*tilesX,
                            tileWidth, tileHeight, 1, GL.RGBA, GL.UNSIGNED_BYTE, tiles[y+x*tilesY]);
                    }
                }
            });
        });
    }

    static #cropImage(image, offX, offY, width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, offX, offY, width, height, 0, 0, width, height);
        return Texture.loadImage(canvas.toDataURL("image/png"));
    }

    delete() {
        GL.deleteTexture(this.texture);
    }

    bind() {
        GL.bindTexture(GL.TEXTURE_2D_ARRAY, this.texture);
    }

    unbind() {
        GL.bindTexture(GL.TEXTURE_2D_ARRAY, null);
    }
}

export default TextureArray;