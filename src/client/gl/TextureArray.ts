import ImageUtils from "../../common/ImageUtils";

class TextureArray {

    private readonly texture: WebGLTexture | null;

    public constructor(src: string, tilesX: number, tilesY: number) {

        this.texture = GL.createTexture();
        this.bind();

        GL.texImage3D(GL.TEXTURE_2D_ARRAY, 0, GL.RGBA, 1, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

        void (async (): Promise<void> => {

            const image = await ImageUtils.loadImage(src);
            this.bind();

            const tileWidth = Math.floor(image.width / tilesX);
            const tileHeight = Math.floor(image.height / tilesY);

            GL.texImage3D(GL.TEXTURE_2D_ARRAY, 0, GL.RGBA, tileWidth, tileHeight, tilesX * tilesY,
                0, GL.RGBA, GL.UNSIGNED_BYTE, null);

            const promises = [];
            for (let x = 0; x < tilesX; x++) {
                for (let y = 0; y < tilesY; y++) {
                    promises.push(new ImageUtils(image, tileWidth, tileHeight, x * tileWidth, y * tileHeight).save());
                }
            }

            const tiles = await Promise.all(promises);
            this.bind();

            for (let x = 0; x < tilesX; x++) {
                for (let y = 0; y < tilesY; y++) {
                    GL.texSubImage3D(GL.TEXTURE_2D_ARRAY, 0, 0, 0, x + y * tilesX,
                        tileWidth, tileHeight, 1, GL.RGBA, GL.UNSIGNED_BYTE, tiles[y + x * tilesY]);
                }
            }
        })();
    }

    public delete(): void {
        GL.deleteTexture(this.texture);
    }

    public bind(): void {
        GL.bindTexture(GL.TEXTURE_2D_ARRAY, this.texture);
    }

    public unbind(): void {
        GL.bindTexture(GL.TEXTURE_2D_ARRAY, null);
    }
}

export default TextureArray;