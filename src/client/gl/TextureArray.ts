import ImageUtils from "src/common/util/ImageUtils";

class TextureArray {

    private readonly texture: WebGLTexture | null;

    public constructor(data: ImageData, tilesX: number, tilesY: number) {

        this.texture = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D_ARRAY, this.texture);

        const tileWidth = Math.floor(data.width / tilesX);
        const tileHeight = Math.floor(data.height / tilesY);

        GL.texImage3D(GL.TEXTURE_2D_ARRAY, 0, GL.RGBA, tileWidth, tileHeight, tilesX * tilesY,
            0, GL.RGBA, GL.UNSIGNED_BYTE, null);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D_ARRAY, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

        for (let x = 0; x < tilesX; x++) {
            for (let y = 0; y < tilesY; y++) {
                const tile = new ImageUtils(data, tileWidth, tileHeight, x * tileWidth, y * tileHeight).getData();
                GL.texSubImage3D(GL.TEXTURE_2D_ARRAY, 0, 0, 0, x + y * tilesX,
                    tileWidth, tileHeight, 1, GL.RGBA, GL.UNSIGNED_BYTE, tile);
            }
        }
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