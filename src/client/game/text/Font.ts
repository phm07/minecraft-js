import Texture from "src/client/gl/Texture";
import ImageUtils from "src/common/util/ImageUtils";

type FontData = Record<string, { uvs: { left: number, right: number, top: number, bottom: number }, width: number, height: number } | undefined>;

class Font {

    private readonly fontData: FontData;
    private waiting: ((data: FontData) => void)[];
    private ready: boolean;
    public readonly glyphHeight: number;
    public texture: Texture | null;

    public constructor(src: string, glyphHeight: number) {

        this.ready = false;
        this.fontData = {};
        this.waiting = [];
        this.glyphHeight = glyphHeight;
        this.texture = null;
        void this.load(src);
    }

    public delete(): void {
        if (this.texture) {
            this.texture.delete();
        }
    }

    private async load(src: string): Promise<void> {

        const image = new ImageUtils(await ImageUtils.loadImage(src));
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

        this.texture = new Texture(image.toBase64());
        this.ready = true;
        this.waiting.forEach((resolve) => resolve(this.fontData));
        this.waiting = [];
    }

    public async getFontData(): Promise<FontData> {
        if (this.ready) return Promise.resolve(this.fontData);
        else return new Promise((resolve) => this.waiting.push(resolve));
    }
}

export default Font;