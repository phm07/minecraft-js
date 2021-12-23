class ImageUtils {

    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D | null;
    private imageData: Uint8ClampedArray | null;
    public width: number;
    public height: number;

    public constructor(image: HTMLImageElement, width = image.width, height = image.height, offX = 0, offY = 0) {

        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.canvas.getContext("2d");
        this.context?.drawImage(image, offX, offY, width, height, 0, 0, width, height);

        this.imageData = null;
    }

    public static loadImage(src: string): Promise<HTMLImageElement> {
        const image = new Image();
        image.src = src;
        return new Promise<HTMLImageElement>((resolve): void => {
            image.onload = (): void => resolve(image);
        });
    }

    public updateImageData(): void {
        this.imageData = this.context?.getImageData(0, 0, this.canvas.width, this.canvas.height).data ?? null;
    }

    public pixelAt(x: number, y: number): number {

        if (!this.imageData) return 0;

        const index = (x + y * this.canvas.width) * 4;

        return ((this.imageData[index] << 24)
                | (this.imageData[index + 1] << 16)
                | (this.imageData[index + 2] << 8)
                | this.imageData[index + 3]) >>> 0;
    }

    public setPixel(x: number, y: number, rgba: number): void {

        const data = new Uint8ClampedArray(4);
        data[0] = (rgba & (0xff << 24)) >>> 24;
        data[1] = (rgba & (0xff << 16)) >>> 16;
        data[2] = (rgba & (0xff << 8)) >>> 8;
        data[3] = rgba & 0xff;
        this.context?.putImageData(new ImageData(data, 1, 1), x, y);
    }

    public toBase64(): string {
        return this.canvas.toDataURL("image/png");
    }

    public save(): Promise<HTMLImageElement> {
        return ImageUtils.loadImage(this.toBase64());
    }
}

export default ImageUtils;