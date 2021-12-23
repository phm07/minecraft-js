import ImageUtils from "../../../common/ImageUtils";
import Texture from "../../gl/Texture";

class Font {

    declare public readonly characters: { [index: string]: { uvs: { left: number, right: number, top: number, bottom: number }, width: number, height: number } | null };
    public readonly glyphHeight: number;
    public texture: Texture | null;

    public constructor(src: string, glyphHeight: number, onload: () => void) {

        this.characters = {};
        this.glyphHeight = glyphHeight;
        this.texture = null;

        void (async (): Promise<void> => {

            const image = new ImageUtils(await ImageUtils.loadImage(src));
            image.updateImageData();

            const inset = 0.001;
            const red = 0xff0000ff;
            let char = 32;
            for (let y = 0; y < image.height; y += glyphHeight) {

                let x = 0;
                while (x < image.width) {
                    if (image.pixelAt(x, y) === red) {
                        image.setPixel(x, y, 0);
                        const x1 = x++;
                        while (image.pixelAt(x, y) !== red && x < image.width) x++;
                        if (x < image.width) {
                            this.characters[String.fromCharCode(char++)] = {
                                uvs: {
                                    left: x1 / image.width + inset,
                                    right: x / image.width - inset,
                                    top: y / image.height + inset,
                                    bottom: (y + glyphHeight) / image.height - inset
                                },
                                width: x - x1,
                                height: glyphHeight
                            };
                        }
                    } else x++;
                }
            }

            this.texture = new Texture(image.toBase64());
            onload();
        })();
    }
}

export default Font;