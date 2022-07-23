import Texture from "client/gl/Texture";
import ImageUtils from "common/util/ImageUtils";

type FontData = Record<string, { uvs: { left: number, right: number, top: number, bottom: number }, width: number, height: number } | undefined>;

class Font {

    public readonly fontData: FontData;
    public readonly glyphHeight: number;
    public texture: Texture | null;

    public constructor(data: ImageData, glyphHeight: number) {

        this.fontData = {};
        this.glyphHeight = glyphHeight;
        this.texture = null;
        this.load(data);
    }

    public delete(): void {
        if (this.texture) {
            this.texture.delete();
        }
    }

    private load(data: ImageData): void {

        const image = new ImageUtils(data);
        image.updateImageData();

        const inset = 0.001;
        const red = 0xff0000ff;
        let char = 32;
        for (let y = 0; y < image.height; y += this.glyphHeight) {

            let x = 0;
            while (x < image.width) {
                if (image.pixelAt(x, y) === red) {
                    image.setPixel(x, y, 0);
                    const x1 = x++;
                    while (image.pixelAt(x, y) !== red && x < image.width) x++;
                    if (x < image.width) {
                        this.fontData[String.fromCharCode(char++)] = {
                            uvs: {
                                left: x1 / image.width + inset,
                                right: x / image.width - inset,
                                top: y / image.height + inset,
                                bottom: (y + this.glyphHeight) / image.height - inset
                            },
                            width: x - x1,
                            height: this.glyphHeight
                        };
                    }
                } else x++;
            }
        }

        this.texture = new Texture(image.getData());
    }
}

export default Font;